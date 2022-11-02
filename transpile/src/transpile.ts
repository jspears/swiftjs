import { filterDirective } from './filterDirective';
import { findDescendant, findParent, findSib } from './nodeFind';
import { addReturnTuple, fixAllFuncs, handleOverload } from './overload';
import { TypeParameter, Func, Param } from './internalTypes';

//import { basename, join } from "path";
import { Node as TSNode, GetAccessorDeclaration, OptionalKind, Project, PropertyDeclaration, PropertyDeclarationStructure, Scope, SetAccessorDeclaration, TypeParameterDeclarationStructure, TypeAliasDeclaration, TypeAliasDeclarationStructure, TypeParameterDeclaration } from "ts-morph";
import Parser, { SyntaxNode } from "web-tree-sitter";
import { makeConstructor } from './constructor';
import { ContextImpl } from './context';
import { assertNodeType } from './nodeHelper';
import { getParser } from "./parser";
import { parseStr, toStringLit } from "./parseStr";
import { lambdaReturn, mapSpecialLiteral, replaceEnd, replaceStart, toParamStr, toScope, unkind } from "./paramHelper";
import { toType } from './toType';
import { ComputedPropDecl, TranspileConfig } from './types';
type Arg = {
    name?: string,
    value?: string,
}
export class Transpile {
    config: TranspileConfig;
    _parser?: Parser;


    asType(ctx: ContextImpl, namedImport?: string, moduleSpecifier: string = '@tswift/util'): string {
        if (namedImport) {
            if (/<.*>/.test(namedImport)) {
                namedImport = namedImport.replace(/<.*>/, '');
                debugger;
            }
            if (namedImport in this.config.builtInTypeMap) {
                return this.config.builtInTypeMap[namedImport];
            }
            const nested = ctx.classNameFor(namedImport);
            if (ctx.hasClass(nested)) {
                return nested;
            }
            if (ctx.hasClass(namedImport)) {
                return namedImport
            }
            if (ctx.inScope(namedImport)) {
                return namedImport;
            }
            if (namedImport.trim().startsWith('{')) {
                //for anonymous types.
                return namedImport;
            }
            //  namedImport = namedImport.replace(/<.*>/, '');
            if (Object.values(this.config.builtInTypeMap).includes(namedImport)) {
                return namedImport;
            }

            ctx.addImport(namedImport, this.config.importMap[moduleSpecifier] || moduleSpecifier);
        }

        return namedImport || '';
    }
    constructor({
        readFile = async (path: string, enc: unknown) => '',
        overwrite = true,
        basedir = (v) => v,
        importMap = { 'SwiftUI': '@tswift/ui' },
        builtInTypeMap = { 'Character': 'string', 'number': 'number', 'Double': 'number', 'Int': 'number', 'Int8': 'number', 'String': 'string' },
        srcDir = `${__dirname}/../src`,
        project = new Project({
            tsConfigFilePath: `${__dirname}/../tsconfig.json`
        })
    }: Partial<TranspileConfig> = {}) {
        this.config = { readFile, overwrite, basedir, importMap, builtInTypeMap, srcDir, project };
    }
    async parse(content: string) {
        this._parser = await getParser();
        return this._parser.parse(content);
    }
    async transpile(name: string, content?: string) {
        if (!content) {
            content = await this.config.readFile(name, 'utf8');
        }
        const fileName = [this.config.srcDir, replaceEnd('.swift', name) + '.ts'].join('/');

        const srcFile = this.config.project.createSourceFile(fileName, '', {
            overwrite: this.config.overwrite
        });

        const tree = await this.parse(content);
        this.handleRoot(tree.rootNode, new ContextImpl(srcFile).add(...Object.entries(this.config.builtInTypeMap)));
        fixAllFuncs(srcFile);
        srcFile.formatText();
        return srcFile;
    }

    handleRoot(n: SyntaxNode, ctx: ContextImpl): void {
        switch (n.type) {
            case 'source_file':
                //skip directives for now
                filterDirective(n.children).forEach(n => this.handleRoot(n, ctx));
                break;
            case 'import_declaration':
                this.asType(ctx, '', n.children[1].text);
                break;
            case 'multiline_comment':
            case 'comment':
                ctx.src.addStatements(n.text);
                break;
            case 'protocol_declaration':
            case 'class_declaration':
                this.handleClassDecl(n, ctx);
                break;
            case 'function_declaration':
                ctx = this.handleFunction(n, ctx);
                break;
            case 'call_expression':
                const statements = this.handleCallExpression(n, ctx);
                ctx.src.addStatements(statements);
                break;
            case 'property_declaration':
                ctx.src.addStatements(this.processPropertyDeclaration(n, ctx));
                break;

            case 'if_statement':
                ctx.src.addStatements(this.processIfStatement(n, ctx));
                break;
            case "typealias_declaration":
                this.handleTypealiasDeclaration(n, ctx);
                break;
            default:
                if (/statement|expression/.test(n.type)) {
                    ctx.src.addStatements(this.processNode(n, ctx));
                    break;
                }
                ctx.unknownType(n, 'handleRoot');
        }
    }
    handleTypealiasDeclaration(node: Parser.SyntaxNode, ctx: ContextImpl) {
        assertNodeType(node, 'typealias_declaration');
        const alias: Partial<TypeAliasDeclarationStructure> = {}
        node.children.forEach(n => {
            switch (n.type) {
                case 'modifiers':
                    switch (n.text) {
                        case 'public':
                            alias.isExported = true;
                            break;
                    }
                    break;
                case '=':
                case 'typealias':
                    break;
                case 'type_identifier':
                    alias.name = n.text;
                    break;
                case 'tuple_type':
                    alias.type = this.handleTupleType(n, ctx);
                    break;
                case 'user_type':
                    alias.type = this.handleUserType(n, ctx);
                    // n.children.forEach(u => {
                    //     switch (u.type) {
                    //         case 'type_identifier':
                    //             alias.type = u.text;
                    //             break;
                    //         case 'type_arguments':
                    //             if (!alias.typeParameters) {
                    //                 alias.typeParameters=[]
                    //             }
                    //             alias.typeParameters.push(u.text);
                    //             break;
                    //     }
                    // })
                    break;
                default:
                    ctx.unknownType(n, 'typealias_declaration');
            }
        });
        if (ctx.clazz) {
            ctx.clazz.addTypeParameter({ name: alias.name as string, constraint: alias.type });
        } else {
            ctx.src.addTypeAlias(alias as any);
        }

    }
    handleTupleType(node: SyntaxNode, ctx: ContextImpl) {
        let type = ''
        node.children.forEach(n => {
            switch (n.type) {
                case '(': type += '[';
                    break;
                case ')': type += ']';
                    break;
                case ',':
                case 'tuple_type_item':
                    type += n.text;
                    break;
                default:
                    ctx.unknownType(n, 'typealias_declaration->tuple_type');

            }
        });
        return type;
    }

    /**
     * Maybe not what you think.  The parser calls all assignment property_declaration
     * so I am just gonna keep the name consistent.
     * @param node 
     * @param ctx 
     * @returns string[];
     */
    processPropertyDeclaration(node: SyntaxNode, ctx: ContextImpl): string {
        assertNodeType(node, 'property_declaration');
        const ret: string[] = [];
        let propName = '';
        node.children.forEach(n => {
            switch (n.type) {
                case 'call_expression':
                    ret.push(this.handleCallExpression(n, ctx));
                    break;
                case 'let':
                    ret.push('const');
                    break;
                case 'var':
                    ret.push('let');
                    break;
                case 'pattern':
                    propName = this.process(ctx, n.children).join('');
                    ctx = ctx.add([propName, '']);
                    ret.push(propName);
                    break;
                case '=':
                    ret.push(n.text);
                    break;
                case 'type_annotation':
                    ret.push(':');
                    const ta = this.processTypeAnnotation(n, ctx);
                    const type = ta.type + (ta.hasQuestionToken ? '| undefined' : '');
                    ret.push(type);
                    ctx = ctx.add([propName, type]);
                    break;
                case 'modifiers':
                    //TODO - figure out.
                    break;
                default:
                    ret.push(this.processNode(n, ctx));
            }
        });

        return ret.join(' ');
    }

    handleRHS(v: SyntaxNode, ctx: ContextImpl): string {
        // switch (v.parent?.type) {
        //     case 'directly_assignable_expression':
        //         return v.text;
        // }
        const pType = v.parent?.type;
        if (ctx.inThisScope(v.text)) {
            return `this.${v.text}`;
        }
        const nested = ctx.classNameFor(v.text)
        if (ctx.hasClass(nested)) {
            return `new ${nested}`;
        }
        if (ctx.hasClass(v.text)) {
            return `new ${v.text}`;
        }
        return v.text;
    }
    processRangeExpression(node: SyntaxNode, ctx: ContextImpl) {
        assertNodeType(node, 'range_expression');
        let inclusive = false;
        const parts: string[] = [];
        node.children.forEach(n => {
            switch (n.type) {
                case '..<': break;
                case '...':
                    inclusive = true;
                    break;
                default:
                    parts.push(this.processNode(n, ctx));
                    break;
            }
        });
        return {
            from: parts[0],
            to: parts[1],
            inclusive,
        }
    }
    handleCallSuffix(node: SyntaxNode, ctx: ContextImpl): string {
        assertNodeType(node, 'call_suffix', 'constructor_suffix');
        
        const args: Arg[] = [];
        let arg: Arg = {};
        let isPropertyIndex = false;

        node.children.forEach(n => {
            switch (n.type) {
                case 'lambda_literal': {
                    args.push({ ...arg, value: this.processLambdaLiteral(n, ctx) });
                    arg = {};
                    break;
                }
                case ':': break;

                case 'value_arguments':
                    n.children.forEach(v => {
                        let arg: Arg | undefined;
                        switch (v.type) {
                            case 'range_expression':
                                isPropertyIndex = false;
                                const range = this.processRangeExpression(v.children[0], ctx);
                                args.push({ value: `${ctx.addBuiltIn('range')}({from:${range.from}, to:${range.to}, inclusive:${range.inclusive}})` });
                                break;
                            case '[':
                                isPropertyIndex = true;
                                break;
                            case '.':
                            case ']':
                            case '(':
                            case ')':
                                break;
                            case ',':
                                isPropertyIndex = false;
                                if (arg) {
                                    args.push(arg);
                                    arg = undefined;
                                }
                                break;
                            case 'value_argument': {
                                arg = {};
                                args.push(arg);
                                v.children.forEach(va => {
                                    switch (va.type) {
                                        case 'simple_identifier':
                                            if (!arg) arg = {};
                                            arg.value = va.text;
                                            break;
                                        case ':': {
                                            if (!arg) arg = {};
                                            arg.name = arg?.value;
                                            arg.value = undefined;
                                            break;
                                        }
                                        case 'range_expression':
                                            //will be handled upstream.
                                            break;
                                        case 'navigation_expression':

                                        default:
                                            if (!arg) arg = {};
                                            arg.value = this.processNode(va, ctx);

                                    }
                                })

                                break;
                            }


                            default:
                                ctx.unknownType(v, 'call_expression->call_suffix->value_arguments')
                        }

                    });
                    break;
                case 'simple_identifier':
                    arg.name = this.processNode(n, ctx);
                    break;
                default:
                    ctx.unknownType(n, 'call_expression->call_suffix');
            }
        });

        if (args.length == 0) {
            return '()';
        }
        const start = isPropertyIndex ? '[' : '(', end = isPropertyIndex ? ']' : ')';
        if (args.some(v => v.name == null)) {
            return `${start}${args.map((k) => k.value).join(',')}${end}`;
        }
        return '({' + args.map((k) => `${k.name}:${k.value}`).join(',') + '})';
    }
    handleCallExpression(node: SyntaxNode, ctx: ContextImpl): string {
        let ret = '';
        node.children.forEach(n => {
            switch (n.type) {
                case 'simple_identifier':
                    this.asType(ctx, n.text);
                    ret += this.handleRHS(n, ctx);
                    break;
                case 'call_suffix':
                    const range = n.descendantsOfType('range_expression')
                    if (range.length == 1) {
                        ctx.addBuiltIn('SwiftArrayT');
                        const parts = this.processRangeExpression(range[0], ctx);
                        ret += `.range({from:${parts.from}, to:${parts.to}, inclusive:${parts.inclusive}})`;
                        break;
                    }
                    ret += this.handleCallSuffix(n, ctx);
                    break;
                case 'navigation_expression':
                    ret += this.processNode(n, ctx);
                    break;
                case 'prefix_expression':
                    const p = findParent(n, 'function_declaration')?.descendantsOfType('->')[0]?.nextSibling?.descendantsOfType('type_identifier')[0];
                    if (p) {
                        ret += `${p.text}${n.text}`;
                    } else {
                        ret += `'${n.text}'`;
                    }
                    break;
                default:
                    ctx.unknownType(n, 'call_expression');
            }
        });

        return ret;
    }

    processIfStatement(node: SyntaxNode, ctx: ContextImpl): string {
        assertNodeType(node, 'if_statement');
        const ret: string[] = [];
        let isNilCheck = false;
        let hasElse = false;
        let as = '';
        node.children?.forEach(n => {
            switch (n.type) {
                case 'else':
                    hasElse = true;
                    ret.push('else');
                    break;
                case 'if':
                    isNilCheck = (n.nextSibling?.type === 'let');
                    //always insert it here, we may end up with double, otherwise we
                    // would have to paren check the whole expresion if (stuff) && (other) {
                    // is valid swift, so we can't just look at the '{' and back up.
                    ret.push(`if (${isNilCheck ? '(' : ''}`);
                    break;
                case 'let':
                    //allows let assignment in if statements.  block scoping is messed up now.
                    ret.unshift(`let ${n.nextSibling?.text};\n`);
                    break;
                case 'statements':
                    ret.push(this.processStatement(n, ctx).join(''));

                    break;
                case 'comparison_expression':
                    ret.push(this.processStatement(n, ctx).join(''));
                    break;

                case '}':
                    ret.push('\n}');
                    if (hasElse) {
                        hasElse = false;
                    }

                    break;
                case '{':
                    if (hasElse) {
                        ret.push('{\n');
                        hasElse = false;
                    } else {
                        ret.push(`${isNilCheck ? `) != null ${as}` : ''}){\n`);
                    }
                    break;
                case '=':
                    ret.push(' = ');
                    break;
                case 'equality_expression':
                case 'simple_identifier':
                    ret.push(this.processNode(n, ctx));
                    break;
                case 'if_statement':
                    ret.push(this.processIfStatement(n, ctx))
                    break;
                case 'as_expression':
                    const label = n.children[0].text;
                    ret.push(label);
                    as = `&& ${label} instanceof ${ctx.classNameFor(n.children[2].text)}`;
                    break;

                default:
                    ctx.unknownType(n, 'if_statement');
                    ret.push(...this.processStatement(n, ctx));
            }
        });
        return ret.join(' ');
    }
    //node.type === 'switch_statement';
    processSwitchStatement(node: SyntaxNode, ctx: ContextImpl): string {
        assertNodeType(node, 'switch_statement');
        const ret: string[] = [];
        let switchContext = '';
        node.children.forEach(n => {

            switch (n.type) {
                case 'self_expression':
                    switchContext = 'this';
                    ret.push('this');

                    break;
                case 'switch':
                    ret.push(n.text + '(');
                    break;
                case 'switch_entry':
                    n.children.forEach(se => {
                        switch (se.type) {
                            case 'default_keyword':
                                ret.push(se.text + ': ');
                                break;
                            case ':':
                                //by swallowing the colon we let the and adding case we support 
                                //fallthrough/mutltiple match of swift.
                                break;
                            case ',':
                                ret.push(' case ')
                                break;
                            case 'case':
                                ret.push(' ' + se.text + ' ');
                                break;
                            case 'switch_pattern':
                                if (se.text.startsWith('.')) {
                                    if (ctx.clazz) {
                                        ret.push(`${ctx.clazz.getName()}${se.text}: `);
                                    } else {
                                        ret.push(`${switchContext}${se.text}: `);
                                    }
                                } else {
                                    ret.push(`${se.text}:`);
                                }
                                break;
                            case 'statements':
                                ret.push(this.processStatement(se, ctx).join(' '));
                                ret.push(';break;\n');
                                break;
                            default:
                                ctx.unknownType(se, 'switch_entry');
                        }
                    });
                    break;
                case '{':
                    ret.push(')' + n.text + '\n');
                    break;
                case '}':
                    ret.push(n.text);
                    break;
                case 'simple_identifier':
                    switchContext = this.handleRHS(n, ctx);
                    ret.push(switchContext);
                    break;
                case "navigation_expression":
                    switchContext = this.processNode(n, ctx);
                    ret.push(switchContext);
                    break;
                default:
                    ctx.unknownType(n, 'switch_statement');

            }
        });
        return ret.join('')
    }
    process(ctx: ContextImpl, n: SyntaxNode[], start: number = 0, end: number | undefined = undefined, fn = this.processNode): string[] {
        return ((start || end) ? n.slice(start, end) : n).map(v => fn.call(this, v, ctx));
    }
    processDictionaryLiteral(n: SyntaxNode, ctx: ContextImpl): string {
        assertNodeType(n, 'dictionary_literal');
        return n.children.reduce((ret, n) => {
            switch (n.type) {
                case ']': return ret + '\n}';
                case '[': return ret + '{\n';
                case ',': return ret + ',\n';
                case ':': return ret + ': ';
                default: return ret + this.processNode(n, ctx);
            }
        }, '');
    }
    processGuardStatement(n: SyntaxNode, ctx: ContextImpl): string {
        assertNodeType(n, 'guard_statement');
        const { children } = n;
        let ret = '';
        if (children[1].type === 'let') {
            ret += `\nif (${children[4].text} == null){\n`;
            const state = findSib('statements', children[4]);
            ret += this.processNode(state, ctx);
            ret += '\n}\n'
            ret += `const ${children[2].text} = ${children[4].text}`;
        } else {
            const state = findSib('statements', children[2]);
            ret += `\nif(${this.processNode(children[1], ctx)}){\n`
            ret += this.processNode(state, ctx);
            ret += '\n}\n';
        }

        return ret;
    }
    /**
     * These are not cloneable.
     * @param n 
     * @param ctx 
     * @returns 
     */
    processLiteral(n: SyntaxNode, ctx: ContextImpl): string | undefined {
        switch (n.type) {
            case 'boolean_literal':
                return `Bool(${n.text})`;
            case 'float_literal':
            case 'double_literal':
            case 'real_literal':
            case 'integer_literal':
            case 'oct_literal':
            case 'hex_literal':
            case 'bin_literal':
                if (n.nextSibling?.type == 'navigation_suffix') {
                    //This fixes 25.4..mm
                    return n.text.includes('.') ? n.text : `${n.text}.`;
                }
                return n.text;
            case 'self_expression':
                //So yeah for extending Number this needs to be anything.
                // I dunno maybe a better way to make that all work but...

                switch (n.nextSibling?.type) {
                    case '/':
                    case '*':
                    case '-':
                    case '+':
                    case '+=':
                    case '/=':
                    case '*=':
                    case '-=':
                        return 'this as any';
                }
                return 'this';
            case 'nil':
                return 'undefined';
            case 'dictionary_literal':
                return this.processDictionaryLiteral(n, ctx);
            case 'array_literal':
                ctx.addBuiltIn('SwiftArrayT');
                return this.process(ctx, n.children).join(' ');

            case 'line_str_text':
            case 'line_string_literal':
                const rawStr = n.children[1]?.text || n.text;
                const { literals, values } = parseStr(rawStr);
                if (values.length == 0) {
                    return JSON.stringify(rawStr);
                }
                return toStringLit({
                    literals,
                    values: values.map(v => this.processStatement(this.stringToNode(v), ctx).join(''))
                });

        }
    }
    processNode(n: SyntaxNode | undefined, ctx: ContextImpl): string {
        if (n == null) {
            return '';
        }
        const litP = this.processLiteral(n, ctx);
        if (litP) {
            return litP;
        }
        switch (n.type) {
            case 'bitwise_operation':
                return this.process(ctx, n.children, 1).join(' ');
            case 'guard_statement':
                return this.processGuardStatement(n, ctx);
            case 'try_expression':
                return this.process(ctx, n.children, 1).join('') + '\n'
            case 'try':
                return '';
            case 'do':
                return 'try';
            case 'comment':

                return n.text + '\n';
            case 'pattern':
                //let (a,b) = (1,2);
                //const [a,b] = [1,2];
                if (n.nextSibling?.type === '=') {
                    const { children } = n;
                    if (children[0]?.type === '(' && children[children.length - 1]?.type === ')') {
                        return ['[', ...this.process(ctx, children, 1, -1), ']'].join(' ');
                    }
                }
                return this.processStatement(n, ctx).join('');
            case 'source_file':
                return '';
            case 'switch_statement':
                return this.processSwitchStatement(n, ctx);
            case 'simple_identifier':
                return this.handleRHS(n, ctx);
            case 'property_declaration':
                return this.processPropertyDeclaration(n, ctx);
            case 'ternary_expression':
                return this.process(ctx, n.children).join(' ');
            case 'call_expression':
                return this.handleCallExpression(n, ctx);
            case 'navigation_expression':
                //this.node.dot.node
                const [first, ...rest] = n.children;
                let start = ''
                if (first.type === 'simple_expression' && ctx.inThisScope(first.text)) {
                    start = `this.${start}`;
                } else {
                    start = this.processNode(first, ctx);
                }
                const retNe = [start, ...this.process(ctx, rest)].join('');
                return retNe;

            //                return this.processStatement(n, ctx).join('');
            case 'call_suffix':
                return this.handleCallSuffix(n, ctx);
            case 'value_arguments':
                throw new Error(`use handleCallExpression instead`);

            case 'assignment':
                const [left, op, right] = n.children;
                switch (op.type) {
                    case '=':
                    case '-=':
                    case '+=':
                    case '^=':
                    case '*=':
                        const pRight = this.processNode(right, ctx);
                        const pLeft = this.processNode(left, ctx);
                        //Probable need to do some operator overload magic in here.
                        return `${pLeft} ${op.text} ${pRight}`
                    default:
                        ctx.unknownType(op, 'processNode');
                }

            case 'tuple_expression':
                //figure out when a tuple and when an expression.  I think
                //checking for transfer control or return statement might be right.
                switch (n.parent?.type) {
                    case 'assignment':
                    case 'additive_expression':
                    case 'comparison_expression':
                    case 'multiplicative_expression':
                    case 'directly_assignable_expression':
                        return this.process(ctx, n.children).join(' ')
                }
                const tuples: RawTuple[] = [];
                let name: string | undefined, value: string | undefined;
                n.children.slice(1, -1).forEach(t => {
                    switch (t.type) {
                        case 'simple_identifier':
                            value = this.processNode(t, ctx);
                            break;
                        case ':':
                            name = value;
                            value = undefined;
                            break;
                        case ',':
                            tuples.push([name, value]);
                            name = undefined;
                            value = undefined;
                            break;
                        case 'pattern':
                            name = t.text;
                            value = undefined;
                            break;
                        default:
                            value = this.processNode(t, ctx);
                        //  ctx.unknownType(t, 'tuple_expresion');
                    }
                });
                if (value || name) {
                    tuples.push([name, value])
                }
                if (tuples.find(([v]) => v == null)) {
                    return `[${tuples.map(([, v]) => v).join(',')}]`;
                }
                return `${ctx.addBuiltIn('tuple')}(${tuples.map(([k, v]) => `[${k ? JSON.stringify(k) : 'undefined'}, ${v}]`).join(',')})`
            case "equality_expression":
            case 'additive_expression':
            case 'comparison_expression':
            case 'multiplicative_expression':
            case 'directly_assignable_expression':
            case 'control_transfer_statement':
                return this.processStatement(n, ctx).join(' ');
            case 'return':
            case '=':
            case '(':
            case ')':
            case ':':
            case ',':
            case '[':
            case ']':
            case '{':
            case '}':
            case '?':                 
                return n.text;
            case '*':
            case '>':
            case '<':
            case '+':
            case '/':
            case '-':
            case '+=':
            case '>=':
            case '<=':
            case '>>':
            case '<<':
            case '|':
            case '&':
            case '==':
            case '-=':
                if (n.parent?.type === 'value_argument' && n.previousSibling?.type == ':') {
                    //try to capture operator methods;
                    return ` ${ctx.addBuiltIn('operator')}("${n.text}") `;
                }
                return ` ${n.text} `;
            case '"':
                if (n.parent?.type === 'line_string_literal') {
                    return '';
                }
            case 'navigation_suffix':
                return n.text;
            case 'lambda_literal':
                return this.processLambdaLiteral(n, ctx);
            case 'catch_keyword':
                return 'catch';
            case 'catch_block':
                if (n.children[1]?.type == '{') {
                    return [`catch(e)`, ...this.process(ctx, n.children, 1)].join('');
                }
                return '';
            case 'do_statement':
                return this.processStatement(n, ctx).join(' ');

            //fall through
            case 'statements':
                return this.processStatement(n, ctx).join(' ');
            case 'if_statement':
                return this.processIfStatement(n, ctx);
            case 'if':
                throw new Error('if should be handled in processIfStatement');
            case 'throw_keyword':
                return 'throw';
            case 'infix_expression':
                return this.processStatement(n, ctx).join(' ');

            case 'custom_operator':
                //says its >=
                return n.text;
            case 'for_statement':
                return this.handleForStatement(n, ctx);
            case 'is':
                return 'instanceof';
            case 'user_type':
                return this.handleUserType(n, ctx);
            case 'function_type':
                return this.handleFunctionType(n, ctx);
            case '#file':
            case '#fileId':
            case '#filePath':
            case '#dsohandle':
            case '#column':
            case '#line':
            case '#function':
                return mapSpecialLiteral(n) ?? '';

            case 'postfix_expression':
                return n.text;
            case 'super_expression':
                return 'super';
            case 'wildcard_pattern':
                //not sure what this is.
                //looks like     for _ in 0..<(n &- 1) {
                return n.text;
            case 'prefix_expression':
                //(../function_declaration/*/->/*/type_identifier)
                const p = findParent(n, 'function_declaration')?.descendantsOfType('->')[0]?.nextSibling?.descendantsOfType('type_identifier')[0];
                if (p) {
                    return `${p.text}${n.text}`;
                }
                return `'${n.text}'`;
            case 'while_statement':
                return this.handleWhileStatement(n, ctx);
            case 'as_expression':
                return this.processNode(n.children[0], ctx) + ' as unknown as ' + this.processNode(n.children[2], ctx)

            
            case 'constructor_expression':
                return this.handleConstructorExpression(n, ctx);
            case 'ERROR':
                throw new Error(`processNode: '${n.type}' '${n.text}'`);

            default:
                ctx.unknownType(n, 'processNode');
                return n.text;
        }
    }
    handleConstructorExpression(node: Parser.SyntaxNode, ctx: ContextImpl): string {
        let ret = 'new ';
        node.children.forEach(n=>{
            switch (n.type) {
                case 'user_type':
                    ret += this.handleUserType(n, ctx);
                    break;
                case 'constructor_suffix':
                    ret += this.handleCallSuffix(n, ctx);
                    break;
                default:
                    ctx.unknownType(n, 'constructor_expression');

            }
        })


        return ret;
        
    }
    handleValueArguments(n: Parser.SyntaxNode, ctx: ContextImpl) {
        let isPropertyIndex = true;
        const args = []
        n.children.forEach(v => {
            let arg: Arg | undefined;
            switch (v.type) {
                case 'range_expression':
                    isPropertyIndex = false;
                    const range = this.processRangeExpression(v.children[0], ctx);
                    args.push({ value: `${ctx.addBuiltIn('range')}({from:${range.from}, to:${range.to}, inclusive:${range.inclusive}})` });
                    break;
                case '[':
                    isPropertyIndex = true;
                    break;
                case '.':
                case ']':
                case '(':
                case ')':
                    break;
                case ',':
                    isPropertyIndex = false;
                    if (arg) {
                        args.push(arg);
                        arg = undefined;
                    }
                    break;
                case 'value_argument': {
                    arg = {};
                    args.push(arg);
                    v.children.forEach(va => {
                        switch (va.type) {
                            case 'simple_identifier':
                                if (!arg) arg = {};
                                arg.value = va.text;
                                break;
                            case ':': {
                                if (!arg) arg = {};
                                arg.name = arg?.value;
                                arg.value = undefined;
                                break;
                            }
                            case 'range_expression':
                                //will be handled upstream.
                                break;
                            case 'navigation_expression':

                            default:
                                if (!arg) arg = {};
                                arg.value = this.processNode(va, ctx);

                        }
                    })

                    break;
                }


                default:
                    ctx.unknownType(v, 'call_expression->call_suffix->value_arguments')
            }

        });    }
    handleWhileStatement(node: Parser.SyntaxNode, ctx: ContextImpl): string {
        assertNodeType(node, 'while_statement');
        let ret = '';
        node.children.forEach(n => {
            switch (n.type) {
                case 'while':
                case '}':
                case '{':
                    ret += n.text;
                    break;
                default:
                    ret += '(' + this.processNode(n, ctx) + ')';
                    break;
            }
        })
        return ret;
    }
    handleUserType(node: SyntaxNode, ctx: ContextImpl): string {
        let ret = '';
        node.children.forEach(n => {
            switch (n.type) {
                case 'type_identifier':
                    
                    ret += this.asType(ctx, n.text);
                    break;
                case 'type_arguments':
                    n.children.forEach(ta => {
                        switch (ta.type) {
                            case '<':
                            case '>':
                            case ',':
                                ret += ta.text;
                                break;
                            case 'user_type':
                                ret += this.handleUserType(ta, ctx);
                                break;
                            default:
                                ctx.unknownType(ta, 'user_type->type_arguments');
                        }
                    });
                    break;
                default:
                    ctx.unknownType(n, 'user_type->type_arguments');
            }
        })

        return ret;
    }
    /*
    handles the type of function not an actual function
    ()->Void;
    */
    handleFunctionType(node: SyntaxNode, ctx: ContextImpl): string {

        assertNodeType(node, 'function_type');

        const params: Param[] = [];
        let returnType = 'unknown';

        node.children.forEach(n => {
            switch (n.type) {
                case 'user_type':
                    returnType = this.handleUserType(n, ctx);
                    break;
                case '->':
                    break;
                //I think this is a bug in the parser
                // so we gonna treat it like parameters.
                case 'tuple_type':
                    n.children.forEach(t => {
                        switch (t.type) {
                            case '(':
                            case ')':
                                break;
                            case 'tuple_type_item':
                                const type = this.processNode(t.children[0], ctx);
                                params.push({ name: '_', type });
                                break;
                            default:
                                ctx.unknownType(t, 'function_type->tuple_type');
                        }
                    });
                    break;
                default:
                    ctx.unknownType(n, 'function_type');
            }
        })
        if (params.length == 0) {
            return `()=>${returnType}`;
        }
        return `(${params.map(v => `${v.name || v.internal || '_'}:${v.type || 'unknown'}`)})=>${returnType}`;
    }
    handleParam(node: SyntaxNode, ctx: ContextImpl): Param {
        let param: Partial<Param> = {};
        if (node.nextSibling?.type === '=' && node.nextSibling.nextSibling) {
            param.initializer = this.processNode(node.nextSibling.nextSibling, ctx)
        }
        node.children.forEach(n => {
            switch (n.type) {
                case ':':
                    break;
                case 'function_type': {
                    param.type = this.processNode(n, ctx);
                    break;
                }
                case 'simple_identifier':
                    param[param.name ? 'internal' : 'name'] = n.text;
                    break;
                case 'optional_type':
                    param.optional = true;
                    param.type = this.asType(ctx, n.children[0]?.text)
                    break;

                case 'user_type':
                    param.type = this.handleUserType(n, ctx);
                    break;
                case 'array_type':
                    param.type = this.asType(ctx, n.children[1]?.text) + '[]';
                    break;
                default:
                    ctx.unknownType(n, 'handleParam');

            }
        });
        return param as Param;
    }
    processLambdaLiteral(node: SyntaxNode, ctx: ContextImpl): string {
        assertNodeType(node, 'lambda_literal');
        const params: Param[] = [];
        let statements: string[] = [];
        let returnType = '';
        node.children.forEach(n => {
            switch (n.type) {
                case 'in':
                case '{':
                case '}':
                case '=>':
                    //swallow external {}
                    break;
                case 'lambda_function_type':
                    n.children.forEach(lft => {
                        switch (lft.type) {
                            case '(':
                            case ')':
                            case '->':
                                break;
                            case 'user_type':
                                returnType = this.handleUserType(lft, ctx);
                                break;
                            case 'lambda_function_type_parameters':
                                lft.children.forEach(lf => {
                                    switch (lf.type) {
                                        case ',': break;
                                        case 'lambda_parameter':
                                            params.push(this.handleParam(lf, ctx));
                                            break;
                                        default:
                                            ctx.unknownType(lf, 'lambda_literal->lambda_function_type_parameters->lambda_function_type')
                                    }
                                });
                                break;
                            default:
                                ctx.unknownType(lft, 'lambda_literal->lambda_function_type');
                        }
                    });
                    break;
                case 'statements':
                    statements = this.processStatement(n, ctx);
                    break;
                case 'comment':
                    statements.push(n.text);
                    break;
                default:
                    ctx.unknownType(n, 'lamda_literal');
            }

        });
        const finStatements = lambdaReturn(statements);
        if (!params.length) {
            for (const [name] of finStatements.matchAll(/(\$\d+?)/g)) {
                params.push({ name, type: 'unknown' });
            }
        }
        const lambda =
            (params.length == 1 && !params[0]?.type) ?
                `${toParamStr(params)}=>${finStatements}`
                :
                `(${toParamStr(params)})=>${finStatements}`;
        return lambda;
    }
    handleForStatement(node: SyntaxNode, ctx: ContextImpl): string {
        assertNodeType(node, 'for_statement');
        let ret = '';
        node.children.forEach((n) => {
            switch (n.type) {
                case '(':
                    ret += 'const [ ';
                    break;
                case ')':
                    ret += ' ]'
                    break;
                case 'for':
                    ret += 'for( const ';
                    break;
                case 'in':
                    ret += ' of ';
                    break;
                case '{':
                    ret += '){\n';
                    break;
                case '}':
                    ret += '\n}\n';
                    break;
                case 'statements':
                case 'pattern':
                    ret += this.processNode(n, ctx);
                    break;
                case 'range_expression':
                    ret += `${ctx.addBuiltIn('range')}("${n.text}")`;
                    break;
                case 'simple_identifier':
                    ret += this.processNode(n, ctx);
                    break;
                case 'call_expression':
                    ret += this.handleCallExpression(n, ctx);
                    break;
                default:
                    ctx.unknownType(n, 'for_statement')
                    ret += this.processNode(n, ctx);

            }
        });

        return ret;
    }
    stringToNode(v: string): SyntaxNode {
        if (!this._parser) {
            throw new Error(`_parser not initialized`);
        }
        return this._parser?.parse(v).rootNode;
    }
    processStatement(n: SyntaxNode | undefined, ctx: ContextImpl): string[] {
        return this.process(ctx, n?.children ?? []);
    }

    handleAddProperty(node: SyntaxNode, ctx: ContextImpl, comment?: string): ComputedPropDecl | undefined {
        let prop: OptionalKind<PropertyDeclarationStructure> = { name: '__unknown__' };
        let computedNode: SyntaxNode | undefined;
        let lazy = false;
        node.children.forEach(n => {
            switch (n.type) {
                case 'let':
                    prop.isReadonly = true;
                    break;
                case 'var':
                    break;
                case 'pattern':
                    prop.name = n.text;

                    break;
                case 'modifiers': {
                    n.children.forEach(m => {
                        OUTER: switch (m.type) {
                            case 'attribute':
                                const name = this.asType(ctx, replaceStart('@', m.text));
                                prop.decorators = [...(prop.decorators || []), { name }];
                                break;
                            case 'visibility_modifier':
                                prop.scope = toScope(m.text);
                                break;
                            case 'inheritance_modifier':
                                //final?
                                break;
                            case 'property_modifier':
                                switch (m.text) {
                                    case 'override':
                                        prop.hasOverrideKeyword = true;
                                        break OUTER;
                                    case 'abstract':
                                        prop.isAbstract = true;
                                        break OUTER;
                                    case 'static':
                                        prop.isStatic = true;
                                        break OUTER;

                                    case 'final':
                                    //final 
                                    case 'class':
                                        //TODO - figure out what this does
                                        //@objc public class var v2: Int { return 0 }
                                        break OUTER;
                                    default:
                                        ctx.unknownType(m, 'property->modifiers->property_modifier');
                                }
                                break;
                            case 'property_behavior_modifier':
                                switch (m.text) {
                                    case 'lazy':
                                        lazy = true;
                                        break;
                                    default:
                                        ctx.unknownType(m, 'property->modifiers->property_behavior_modifier');

                                }
                                break;
                            case 'ownership_modifier':
                                //TODO - weak
                                break;
                            default:
                                ctx.unknownType(m, 'property->modifiers');
                        }
                    });
                    break;
                }

                case 'line_string_literal':
                    prop.initializer = n.text;
                    prop.type = 'string';
                    break;
                case 'boolean_literal':
                    prop.initializer = `Bool(${n.text})`;
                    prop.type = 'Bool';
                    ctx.addBuiltIn('Bool');
                    break;
                case 'real_literal':
                case 'float_literal':
                case 'double_literal':
                case 'integer_literal':
                    prop.type = 'number';
                    prop.initializer = n.text;
                    break;
                case '=':
                    break;
                case 'type_annotation':
                    Object.assign(prop, this.processTypeAnnotation(n, ctx))

                    break;
                case 'prefix_expression':
                    const type = n.parent?.children.find(v => v.type === 'type_annotation')?.children?.[1]?.text;
                    if (type) {
                        prop.initializer = `${type}${n.text}`
                    }
                    break;
                case ',':
                    const p = ctx.getClassOrThrow().addProperty(prop);
                    if (p && comment) {
                        p.addJsDoc(comment);
                        comment = undefined;
                    }
                    break;

                case 'computed_property':

                case 'call_expression':
                    computedNode = n;
                    //we'll cycle through props again, adding them
                    break;
                case 'dictionary_literal':
                    prop.initializer = this.processNode(n, ctx);
                    break;
                case 'array_literal':
                    prop.initializer = this.processStatement(n, ctx).join('');
                    break;
                case 'constructor_expression':
                    prop.initializer = this.handleConstructorExpression(n, ctx);
                    break;
                
                case "protocol_property_requirements":
                    //not exactly sure what to do with this {get, set} map to readonly?
                    break;
                default:
                    ctx.unknownType(n, 'property');
            }
        });

        if (lazy) {
            const strPropName = JSON.stringify(prop.name);
            const lazyStr = ctx.addBuiltIn('lazy');
            ctx.getClassOrThrow().addGetAccessor({
                ...unkind(prop),
                statements: `return ${lazyStr}(this, ${strPropName}, ${prop.initializer});`
            });
            ctx.getClassOrThrow().addSetAccessor({
                ...unkind(prop),
                parameters: [{ name: 'val' }],
                statements: `${lazyStr}(this, ${strPropName}, val);`
            });
        }
        const p = ctx.getClassOrThrow().addProperty(prop);
        if (comment) {
            p.addJsDoc(comment);
        }

        return computedNode ? [computedNode, p] : undefined;
    }
    processTypeAnnotation(node: Parser.SyntaxNode, ctx: ContextImpl): {
        hasQuestionToken?: boolean;
        type: string
    } {
        const prop: { hasQuestionToken?: boolean, type?: string } = {}
        node.children?.forEach(n => {
            switch (n.type) {
                case 'optional_type':
                    prop.hasQuestionToken = true;
                    prop.type = this.asType(ctx, n.child(0)?.text);
                    break;
                case ':': break;
                case 'user_type':
                    prop.type = this.handleUserType(n, ctx);
                    break;
                case 'opaque_type':

                    n.children.forEach(o => {
                        switch (o.type) {
                            case 'some': break;
                            case 'user_type':
                                prop.type = this.handleUserType(o, ctx);
                                break;
                            default:
                                ctx.unknownType(o, 'processTypeAnnotation->opaque_type');
                        }
                    })
                    break;
                case 'array_type':
                    ctx.addBuiltIn('SwiftArrayT');
                    prop.type = 'Array<' + this.asType(ctx, n.children[1]?.text) + '>';
                    break;
                case 'tuple_type':
                    prop.type = this.handleTupleType(n, ctx);
                    break;
                default:
                    ctx.unknownType(n, 'type_annotation');
            }
        });
        if (!prop.type) {
            throw new Error(`no  type found for type_annotation: ` + node.text);
        }
        return prop as any;
    }

    handleComputedProperty(n: SyntaxNode, pd: PropertyDeclaration, ctx: ContextImpl) {
        let prop: PropertyDeclaration | GetAccessorDeclaration | SetAccessorDeclaration = pd;
        const clz = ctx.getClassOrThrow();
        let getter: { statements: string[] } | undefined;
        let setter: {
            statements: string[];
            parameters: { name: string; type?: string }[];
        } | undefined;
        let decoratorType: string;

        switch (n.type) {
            case '{':
            case '}':
                break;
            case 'statements': {
                if (prop instanceof PropertyDeclaration) {
                    const struct = unkind(prop.getStructure());
                    prop.remove();
                   const getA = clz.addGetAccessor({
                        ...struct,
                        decorators: [
                            ...(struct.decorators || []),
                            { name: ctx.addBuiltIn('Cache') }],
                        statements: this.processStatement(n, ctx)
                   })
                    // prop.setInitializer(`(()=>{` +.join('\n') + '})()');
                }
                break;
            }
            case 'computed_property':
                n.children.forEach(v => {
                    switch (v.type) {
                        case '{':
                        case '}':
                            break;
                        case 'computed_setter':
                            v.children.forEach(s => {
                                switch (s.type) {
                                    case 'setter_specifier':
                                    case '{':
                                    case '(':
                                    case ')':
                                    case '}': break;
                                    case 'statements':
                                        if (!setter) setter = { statements: [], parameters: [] };
                                        setter.statements = this.processStatement(s, ctx);
                                        if (prop) {
                                            const struct = unkind(prop.getStructure());
                                            if (prop instanceof PropertyDeclaration) {
                                                prop.remove();
                                            }
                                            prop = clz?.addSetAccessor({
                                                ...struct,
                                                ...setter,
                                                returnType: undefined,
                                            });
                                        }
                                        break;
                                    case 'simple_identifier':
                                        if (!setter) setter = { statements: [], parameters: [] };
                                        setter.parameters.push({
                                            name: s.text,
                                            type: toType(prop)
                                        });
                                        break;
                                    default: ctx.unknownType(s, 'computed_property->computed_setter');

                                }
                            });
                            break;
                        case 'computed_getter':
                            v.children.forEach(s => {
                                switch (s.type) {
                                    case 'getter_specifier':
                                    case '{':
                                    case '}': break;
                                    case 'statements':
                                        if (!getter) getter = { statements: [] };

                                        getter.statements.push(...this.processStatement(s, ctx));
                                   //     statementsToTuple(ctx,getter)
                                        if (prop) {
                                            const returnType = toType(prop)
                                            const struct = unkind(prop.getStructure());
                                            if (prop instanceof PropertyDeclaration) {
                                                prop.remove();
                                            }

                                            prop = clz?.addGetAccessor({
                                                ...struct,
                                                ...getter,
                                                returnType,
                                            });
                                            addReturnTuple(prop);

                                        }
                                        break;
                                    default:
                                        console.log('unknown computed_getter', s.type);

                                }
                            })
                            break;
                        //This handles computed getters... which 
                        // is the default.
                        case 'statements':
                            if (!getter) getter = { statements: [] };
                            getter.statements.push(...this.processStatement(v, ctx));
                        //    statementsToTuple(ctx, getter);
                            if (prop) {
                                const struct = unkind(prop.getStructure());
                                if (prop instanceof PropertyDeclaration) {
                                    prop.remove();
                                }
                                prop = clz?.addGetAccessor({
                                    ...struct,
                                    ...getter
                                });
                                addReturnTuple(prop);
                            }
                            break;
                        default:
                            ctx.unknownType(v, 'computed_property');
                    }
                });
                break;
            case 'call_expression':
                const [first, second] = n.children;
                if (second?.children[0]?.type === 'lambda_literal') {

                    if (prop instanceof PropertyDeclaration) {
                        prop.setInitializer(this.processNode(first, ctx));
                    }
                    const lamda = second.children[0].children[1];
                    let decoratorType: string | undefined;
                    lamda?.children.forEach(d => {
                        d.children?.forEach(l => {
                            switch (l.type) {
                                case 'call_suffix':
                                    const dec = decoratorType && prop.getDecorator(decoratorType);
                                    if (!dec) {
                                        throw new Error(`could not find decorator ` + decoratorType);
                                    }
                                    const type = toType(prop);
                                    //defaults to oldValue 
                                    const arg = l.children.reduce((ret, c) => {
                                        switch (c.type) {
                                            case 'value_arguments':
                                                return c.children.reduce((ret, va) => {
                                                    switch (va.type) {
                                                        case '(':
                                                            return `function(this:${ctx.getClassName()},`;
                                                        case 'value_argument':
                                                            return ret += va.text + (type ? `:${type}` : '');
                                                        default:
                                                            return ret + va.text;

                                                    }
                                                }, '');
                                            case 'lambda_literal':
                                                return ret += c.children?.reduce((r, k) => {
                                                    switch (k.type) {
                                                        case '}':
                                                        case '{':
                                                            return `${r}${k.text}`;
                                                        default:
                                                            return `${r} ${this.processNode(k, ctx)} `
                                                    }
                                                }, '');
                                            default:
                                                ctx.unknownType(c, 'computed_property->call_expression->lambda');
                                                return ret;
                                        }
                                    }, `function(this:${ctx.getClassName()}, oldValue${type ? `:${type}` : ''})`);

                                    dec?.addArgument(arg);
                                    break;
                                //implement willSet/didSet
                                case 'simple_identifier':
                                    decoratorType = ctx.addBuiltIn(l.text);
                                    prop?.addDecorator({ name: decoratorType });
                                    break;
                                default:
                                    ctx.unknownType(l, 'computed_property->call_expression');
                                    break;
                            }
                        });
                    })
                    break;
                } else {
                    if (TSNode.isPropertyDeclaration(prop)) {
                        prop.setInitializer(this.processStatement(n, ctx).join(''));
                        break;
                    }
                    throw new Error(`not a property can not initialize`);
                }
                break;
            case 'simple_identifier':
                if (TSNode.isPropertyDeclaration(prop)) {
                    prop.setInitializer(this.processNode(n, ctx));
                    break;
                }
                throw new Error(`not a property can not initialize`);

            default:
                if (/_literal/.test(n.type)) {
                    if (prop instanceof PropertyDeclaration) {
                        prop.setInitializer(this.processNode(n, ctx));
                        break;
                    }
                    throw new Error(`not a property can not initialize`);

                }
                ctx.unknownType(n, 'computed_property');
        }

    }
    handleClassDecl(node: SyntaxNode, ctx: ContextImpl) {
        assertNodeType(node, 'class_declaration', 'enum_declaration', 'protocol_declaration');
        if (node.children[0].type === 'enum') {
            return this.handleEnum(node, ctx);
        }
        return this.handleClass(node, ctx);
    }
    handleClassBody(node: SyntaxNode, ctx: ContextImpl): void {
        const clz = ctx.getClassOrThrow('Class body with no class?');
        let comment: string | undefined;
        let constructors: SyntaxNode[] = [];
        node.children.filter(p => p.type === 'class_declaration').forEach(v => {
            this.handleClassDecl(v, ctx);
        });
        const computedProperties: [SyntaxNode, PropertyDeclaration][] = [];
        filterDirective(node.children).forEach(n => {
            switch (n.type) {
                case '{':
                case '}':
                    break;
                case 'protocol_function_declaration':
                    ctx.clazz?.setIsAbstract(true);
                    this.handleFunction(n, ctx);
                    break;
                case 'property_declaration': {
                    const p = this.handleAddProperty(n, ctx, comment);
                    if (p) {
                        computedProperties.push(p);
                    }
                    comment = undefined;
                    break;
                }
                case 'comment': {
                    comment = replaceStart('//', n.text);
                    break;
                }
                case 'subscript_declaration':
                    this.handleSubscript(n, ctx);
                    break;
                //for now handle [] and () the same.
                case 'function_declaration':
                    const init = n.descendantsOfType('init');
                    if (init.length) {
                        constructors.push(init[0]);
                    } else {
                        this.handleFunction(n, ctx);
                    }
                    break;
                case 'class_declaration':
                    //handled up top;
                    break;
                case "associatedtype_declaration":
                    const tp: TypeParameter = {} as any;
                    n.children.forEach(a => {
                        switch (a.type) {
                            case '=':
                            case ':':
                            case 'associatedtype':
                                break;
                            case 'type_identifier':
                                tp.name = a.text;
                                break;
                            case 'user_type':
                                if (a.previousSibling?.text == '=') {
                                    tp.default = a.text === 'Self' ? 'this' : a.text;
                                } else {
                                    tp.constraint = a.text;
                                }
                                break;
                            case 'type_constraints':
                                const clz = ctx.getClassOrThrow();
                                this.processTypeConstraints(a, ctx).forEach(v =>
                                    clz.addTypeParameter(v)
                                );
                                break;

                            default:
                                ctx.unknownType(a, 'associatedtype_declaration');
                        }
                    });
                    if (tp.name != null) {
                        ctx.getClassOrThrow().addTypeParameter(tp as any);
                    }
                    break;
                case 'typealias_declaration':
                    this.handleTypealiasDeclaration(n, ctx);
                    break;
                    
                case "protocol_property_declaration":
                    this.handleAddProperty(n, ctx, comment);
                    break;
                case 'ERROR':
                    console.warn('handleClassBody Error:', n.text);
                    break;
                default:
                    ctx.unknownType(n, 'class_body');
            }
        });
        if (comment) {
            clz.addJsDoc(comment);
        }
        //parameters before constructors or else accessors become a problem.
        this.handleComputedProperties(computedProperties, ctx);
        this.handleConstructors(constructors, ctx);
        this.fixJSDOC(ctx);
    }
    handleSubscript(n: Parser.SyntaxNode, ctx: ContextImpl) {
        //TODO - not implemeented yet
    }
    /**
     * So we can't statically evaluate constructors to ensure that all prooperties
     * are assigned, (due to extensions) so we will ask typescript to ignore them
     * if 1 - the are required and 2 - they don't have an initializer.
     * 
     * We do this here, because of how Computed Properties are handled, since they
     * may depend on props we have to scan for all properties first, and so any
     * required prop will be given an ignore even if it is initialized.
     */
    fixJSDOC(ctx: ContextImpl) {
        ctx.getClassOrThrow().getProperties().forEach(prop => {
            if (!(prop.hasQuestionToken() || prop.hasInitializer())) {
                prop.addJsDoc('@ts-ignore');
            }
        })
    }
    handleComputedProperties(computedProperties: ComputedPropDecl[], clz: ContextImpl) {
        computedProperties.forEach(([node, prop]) => this.handleComputedProperty(node, prop, clz));
    }

    handleConstructors(constructors: SyntaxNode[], ctx: ContextImpl): void {
        const parameters: [Param[], string][] = [];

        constructors.forEach(constructor => {
            const perConst: Param[] = []
            const current: [Param[], string] = [perConst, ''];
            parameters.push(current);
            constructor.children.forEach(v => {
                switch (v.type) {
                    case 'init':

                    case '?'://what does this do optional init ? init?(){}
                    case '(':
                    case ',':
                    case ')':
                        break;
                    case 'parameter': {
                        perConst.push(this.handleParam(v, ctx));
                        break;
                    }
                    case 'function_body':
                        current[1] = this.processNode(v.children[1], ctx);
                        break;
                    default: ctx.unknownType(v, 'constructor');
                }

            })
        });

        makeConstructor(parameters, ctx);
        if (ctx.isExtension) {
            const name = ctx.getClassName()?.split('$')[0] || '__PROBLEM__';
            ctx.src.addStatements(`Object.setPrototypeOf(${name}.prototype, ${ctx.getClassName()}.prototype)`)
            const project = this.config.project;
            const extensions = project.getSourceFile('src/extensions.d.ts') || this.config.project.createSourceFile('src/extensions.d.ts');
            // const mod = extensions.addModule({
            //     hasDeclareKeyword: true,
            //     name: 'global'
            // });
            extensions.addInterface({
                ...ctx.getClassOrThrow().extractInterface(),
                name
            })
            console.log(extensions.getText());
        }
    }


    handleFunction(node: SyntaxNode, ctx: ContextImpl): ContextImpl {
        let func: Partial<Func> = { isAbstract: true };

        let tupleReturn: [string | undefined, string | undefined][] = [];
        for (let i = 0; i < node.childCount; i++) {
            const n = node.children[i];
            switch (n.type) {
                case ',':
                case '(':
                case ')':
                case '->':
                case 'subscript':
                case 'func': break;
                case 'parameter':
                    (func.parameters ?? (func.parameters = [])).push(this.handleParam(n, ctx));
                    if (n.nextSibling?.type === '=') {
                        i += 2;
                    }
                    break;
                case 'optional_type':
                    func.returnType = `${this.processNode(n.children[0], ctx)} | undefined`;
                    break;
                case 'modifiers':
                    if (n.text === 'mutating') {
                        ctx = ctx.mutateScope(true);
                        break;
                    }
                    n.children.forEach(m => {
                        switch (m.type) {
                            case 'attribute':
                                func.decorators = [
                                    { name: m.text }
                                ];
                                break;
                            case 'visibility_modifier':
                                func.scope = toScope(m.text);
                                break;
                            default:
                                ctx.unknownType(m, 'handleFunction->modfiers');
                        }
                    });
                    break;
                case 'simple_identifier':
                    func.name = n.text;
                    break;
                case 'user_type':
                    func.returnType = this.handleUserType(n, ctx);
                    break;
                case 'function_body':
                    func.isAbstract = false;
                    if (func.parameters)
                        ctx = ctx.add(...func.parameters);
                    n.children.forEach(f => {
                        switch (f.type) {
                            case '{':
                            case '}':
                                break;
                            default:
                                func.statements = this.processStatement(f, ctx);
                                break;
                        }
                    });
                    break;
                case 'tuple_type':
                    n.children.forEach(t => {
                        switch (t.type) {
                            case '(':
                            case ')':
                            case ',':
                                //check if its gonna be an array or an object.
                                //tuples prolly should be always an array with
                                // properties, but I dunno.
                                break;
                            case 'tuple_type_item':
                                if (t.children.length == 3) {
                                    const type = this.asType(ctx, t.children[2].text);
                                    const key = t.children[0].text;
                                    tupleReturn.push([key, type]);
                                } else {
                                    const type = this.asType(ctx, t.children[0].text);
                                    tupleReturn.push([undefined, type]);
                                }
                                break;
                            default:
                                ctx.unknownType(t, 'handleFunction->tuple_type');
                        }
                    });
                    func.returnType = `${ctx.addBuiltIn('Tuple')}<${tuplify(tupleReturn)}>`;
                    break;
                case 'type_parameters':
                    func.typeParameters = this.processTypeParameters(n, ctx);
                    break;
                case '=':


                    break;

                case 'throws':
                    break;
                case 'array_type':
                    func.returnType = `Array<${this.processNode(n.children[1], ctx)}>`;
                    break;
                case 'type_constraints':
                    func.typeParameters = this.processTypeConstraints(n, ctx);
                    break;
                default:
                    ctx.unknownType(n, 'function');
            }
        };
        return handleOverload(ctx, func as Func, tupleReturn);
    }
    processTypeParameters(node: Parser.SyntaxNode, ctx: ContextImpl) {
        const ret: { name: string, constraint?: string }[] = [];
        node.children.forEach(n => {
            switch (n.type) {
                case '>':
                case '<':
                case ',':
                    break;
                case 'type_parameter':
                    const param: { name: string, constraint?: string } = {} as any;
                    n.children.forEach(t => {
                        switch (t.type) {
                            case ':': break;
                            case 'type_identifier':
                                param.name = t.text;
                                break;
                            case 'user_type':
                                param.constraint = this.handleUserType(t, ctx);
                                break;
                        }
                    });
                    ret.push(param);
                    break;
                default:
                    ctx.unknownType(n, 'type_parameters');
            }
        })

        return ret;
    }
    handleEnum(node: SyntaxNode, ctx: ContextImpl) {

        let enums: OptionalKind<PropertyDeclarationStructure>[] = [];
        let typeParameter: string | undefined;
        node.children.forEach(c => {
            switch (c.type) {
                case ':':
                case 'enum':
                    break;
                case 'type_identifier':
                    ctx = ctx.addClass({
                        name: c.text,
                    }, (clzName) => `return new ${clzName}(this.rawValue)`);
                    break;
                case 'inheritance_specifier':
                    typeParameter = this.asType(ctx, c.text);
                    break;
                case 'enum_class_body':
                    enums = this.processEnums(c, ctx, typeParameter);
                    break;
                default:
                    ctx.unknownType(c, 'enum');
            }
        });

        const enm = ctx.getClassOrThrow();
        enm.addProperties(enums);
        enm.addConstructor({
            parameters: [
                {
                    name: 'rawValue',
                    type: typeParameter || 'string',
                    isReadonly: true,
                    scope: Scope.Public,

                }
            ]
        });
        //add the array import.
        ctx.addBuiltIn('SwiftArrayT');
        enm.addProperty({
            isStatic: true,
            name: 'allCases',
            scope: Scope.Public,
            isReadonly: true,
            initializer: `[${enums.map(v => `${enm.getName()}.${v.name}`).join(', ')}] as const`,
        });

        return enm;
    }
    processEnums(node: SyntaxNode, ctx: ContextImpl, type?: string) {
        const enums: OptionalKind<PropertyDeclarationStructure>[] = [];
        let start: number | undefined;
        const clzName = ctx.getClassOrThrow().getName();
        const computedProps: ComputedPropDecl[] = []
        node.children.forEach(e => {
            switch (e.type) {
                case '{':
                case '}':
                    break;
                case 'enum_entry':
                    let enm: OptionalKind<PropertyDeclarationStructure> = {
                        name: '',
                        isStatic: true,
                        scope: Scope.Public,
                        isReadonly: true,
                    }

                    e.children.forEach(ec => {

                        switch (ec.type) {
                            case ',':
                                enums.push(enm);
                                enm = {
                                    ...enm,
                                };
                                break;
                            case '=':
                            case 'case':
                                break;
                            case 'simple_identifier':
                                enm.name = ec.text;
                                enm.initializer = start == null ?
                                    type == null ?
                                        `new ${clzName}("${enm.name}")`
                                        : `new ${clzName}()`
                                    : `new ${clzName}(${++start})`

                                break;
                            case 'integer_literal':
                                enm.initializer = `new ${clzName}(${(start = Number(ec.text))})`;
                                break;
                            default:
                                enm.initializer = `new ${clzName}(${this.processNode(ec, ctx)})`;
                        }
                    });
                    enums.push(enm);
                    break;
                case 'class_declaration':
                    this.handleClassDecl(e, ctx);
                    break;
                case 'property_declaration':
                    const p = this.handleAddProperty(e, ctx);
                    if (p) {
                        computedProps.push(p);
                    }
                    break;
                default:
                    ctx.unknownType(e, 'enum');

            }
        });
        this.handleComputedProperties(computedProps, ctx);
        return enums;
    }
    processTypeConstraints(node: SyntaxNode, ctx: ContextImpl) {
        TypeParameterDeclaration
        const ret: TypeParameter[] = [];
        node.children.forEach(n => {
            switch (n.type) {
                case ',':
                case 'where_keyword': break;

                case 'type_constraint':
                    n.children.forEach(t => {
                        switch (t.type) {
                            case 'inheritance_constraint':
                                ret.push({
                                    name: t.children[0].text,
                                    constraint: t.children[2]?.text
                                });
                                break;
                            case 'equality_constraint':
                                ret.push({
                                    name: t.children[0].text,
                                    default: t.children[2]?.text
                                });
                                break;
                            default:
                                ctx.unknownType(t, 'type_constraints->type_constraint');
                        }
                    });
                    break;
                default:
                    ctx.unknownType(n, 'type_constraints')
            }
        });

        return ret;
    }
    handleClass(node: SyntaxNode, ctx: ContextImpl): void {
        let isStruct = false;
        let isExtension = false;
        node.children.forEach(n => {
            switch (n.type) {
                case ':':
                    break;
                case 'extension':
                    isExtension = true;
                    break;
                case 'class':
                    isStruct = false;
                    break;
                case 'protocol':
                case 'struct':
                    isStruct = true;
                    break;
                case 'type_constraints':
                    ctx.getClassOrThrow().addTypeParameters(this.processTypeConstraints(n, ctx));
                    break;

                case 'inheritance_specifier':
                    const clz = ctx.getClassOrThrow();
                    const ext = clz.getExtends();
                    const type = findDescendant(n, 'type_identifier');
                    n.descendantsOfType('type_arguments')?.forEach(t => {
                        switch (t.type) {
                            case '<':
                            case '>':
                            case ',':
                                break;
                            case 'user_type':
                                ctx.add([t.text, undefined]);
                                break;
                        }
                    });
                    if (type)
                        this.asType(ctx, type?.text);
                    if (ext) {
                        const mix = ctx.addBuiltIn('Mixin');
                        clz.setExtends(`${mix}(${n.text}, ${ext.getText()})`)
                    } else {
                        clz.setExtends(n.text);
                    }
                    break;
                case 'user_type':
                case 'type_identifier':
                    ctx = ctx.addClass({ name: n.text }, isStruct, isExtension);
                    break;
                case 'protocol_body':
                case 'class_body':
                    this.handleClassBody(n, ctx);
                    break;
                case 'type_parameters':
                    n.children.forEach(v => {
                        switch (v.type) {
                            case '>':
                            case '<':
                            case ',':
                                break;
                            case 'type_parameter':
                                ctx.getClassOrThrow().addTypeParameter(v.text);
                                break;
                            default:
                                ctx.unknownType(v, 'handleClass->type_parameter');
                        }
                    })
                    break;
                case 'enum':
                case 'enum_class_body':
                    break;
                case 'modifiers':
                    this.handleClassModifiers(n, ctx);
                    break;
                case 'class_declaration':
                    this.handleClassDecl(n, ctx);
                    break;
                case 'indirect':
                    //https://www.hackingwithswift.com/example-code/language/what-are-indirect-enums
                    //I think we can ignore.
                    break;
                case ',':
                    break;
                default:
                    ctx.unknownType(n, 'class');
            }

        });
    }
    handleClassModifiers(n: Parser.SyntaxNode, ctx: ContextImpl) {
        n.children.forEach(v => {
            switch (v.type) {
                case 'visibility_modifier':
                    //implement public/private/fileprivate
                    break;
                case 'attribute':
                    //implement '@objc'
                    ctx.clazz?.addDecorator({
                        name: '@' + ctx.addBuiltIn('objc')
                    });
                    break;
            }
        });
    }
    async save() {
        return this.config.project.save();
    }
}


const tuplify = (tuples: RawTuple[]) => '[' + tuples.map(([key, value]) => `[${key == null ? 'undefined' : JSON.stringify(key)}, ${value}]`).join(',') + ']';


type RawTuple = [string | undefined, string | undefined];