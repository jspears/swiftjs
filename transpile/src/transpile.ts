import { readFile as fsReadFile } from 'fs/promises';
import { basename, join } from "path";
import { ClassDeclaration, ClassDeclarationStructure, FunctionDeclaration, GetAccessorDeclaration, OptionalKind, Project, PropertyDeclaration, PropertyDeclarationStructure, Scope, SetAccessorDeclaration, SourceFile, SyntaxKind, VariableDeclaration, VariableDeclarationKind, VariableStatement } from "ts-morph";
import Parser from "web-tree-sitter";
import { asSrc, asClass, asInner, assertNodeType, cname, findSib } from './nodeHelper';
import { Context, Node, ComputedPropDecl, CParam, TranspileConfig } from './types';
import { isClassDecl } from "./guards";
import { getParser } from "./parser";
import { parseStr, toStringLit } from "./parseStr";
import { lambdaReturn, Param, replaceEnd, replaceStart, toParams, toParamStr, toScope, unkind, writeDestructure, writeType } from "./text";

function unknownType(n: Node, message: string = '') {
    console.warn(`unknown type ${message}: `, n.type);
    debugger;
}
export class Transpile {
    config: TranspileConfig;
    _parser?: Parser;
    clone = (text: string | undefined, ctx: Context) => {
        if (text) {
            this.asType(ctx, 'cloneable', '@tswift/util');
            return `${text}?.[cloneable]?.() ?? ${text}`;
        }
        return '';
    }
    addClass({ name, ...clazz }: OptionalKind<ClassDeclarationStructure>, ctx: Context, isCloneOnAssign?: boolean | string | string[]): ClassDeclaration {
        const clz = isClassDecl(ctx) ?
            ctx.getSourceFile().insertClass(ctx.getChildIndex(), {
                ...clazz,
                isExported: false,
                name: name ? asInner(name, ctx) : undefined,
            }) : ctx.addClass({
                ...clazz,
                name,
                isExported: true
            });
        if (isCloneOnAssign) {
            this.asType(ctx, 'cloneable', '@tswift/util');
            clz.addMethod({
                name: '[cloneable]',
                statements: isCloneOnAssign === true ? `return new ${clz.getName()}(this);` : isCloneOnAssign
            })
        }
        return clz;
    }

    asType(srcOrClz: Context, namedImport?: string, moduleSpecifier: string = '@tswift/util'): string {
        const src = asSrc(srcOrClz);
        if (namedImport) {
            if (namedImport.trim().startsWith('{')) {
                //for anonymous types.
                return namedImport;
            }
            namedImport = namedImport.replace(/import\("[^"]*"\)\./, '').replace(/<.*>/, '');
            if (Object.values(this.config.builtInTypeMap).includes(namedImport)) {
                return namedImport;
            }
            if (namedImport in this.config.builtInTypeMap) {
                return this.config.builtInTypeMap[namedImport];
            }
            if (src.getClass(namedImport)|| src.getVariableDeclaration(namedImport) || src.getTypeAlias(namedImport)) {
                return namedImport;
            }
           
            const clz = asClass(srcOrClz);
            if (clz) {
                if (clz.getTypeParameter(namedImport)) {
                    return namedImport;
                } else if (src.getClass(asInner(namedImport, clz))) {
                    //emulate nested classes.
                    return asInner(namedImport, clz);
                }
            }
        }
        const imp = src.getImportDeclaration((impl) =>
            impl.getModuleSpecifier().getLiteralValue() === moduleSpecifier
        ) || src.addImportDeclaration({ moduleSpecifier: this.config.importMap[moduleSpecifier] || moduleSpecifier })
        if (namedImport && !imp.getNamedImports().find(v => v.getText() === namedImport)) {
            imp.addNamedImport(namedImport);
        }
        return namedImport || '';
    }
    constructor({
        readFile = fsReadFile,
        overwrite = true,
        basedir = basename,
        importMap = { 'SwiftUI': '@tswift/ui' },
        builtInTypeMap = { 'Character': 'string', 'Bool': 'boolean', 'number': 'number', 'Double': 'number', 'Int': 'number', 'String': 'string' },
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
        const fileName = join(this.config.srcDir, replaceEnd('.swift', name) + '.ts');
        const srcFile = this.config.project.createSourceFile(fileName, '', {
            overwrite: this.config.overwrite
        });

        const tree = await this.parse(content);
        this.handleRoot(tree.rootNode, srcFile);
        srcFile.formatText();
        return srcFile;
    }

    handleRoot(n: Node, src: SourceFile): void {
        switch (n.type) {
            case 'source_file':
                n.children.forEach(child => this.handleRoot(child, src));
                break;
            case 'import_declaration':
                this.asType(src, '', n.children[1].text);
                break;
            case 'comment':
                src.addStatements(n.text);
                break;
            case 'class_declaration':
                this.handleClassDecl(n, src);
                break;
            case 'function_declaration':
                this.handleFunction(n, src);
                break;
            case 'call_expression':
                const statements = this.handleCallExpression(n, src);
                src.addStatements(statements);
                break;
            case 'property_declaration':
                src.addStatements(this.processPropertyDeclaration(n, src));
                break;

            case 'if_statement':
                src.addStatements(this.processIfStatement(n, src));
                break;
            default:
                if (/statement|expression/.test(n.type)) {
                    src.addStatements(this.processNode(n, src));
                    break;
                }
                unknownType(n, 'handleRoot');
        }
    }

    /**
     * Maybe not what you think.  The parser calls all assignment property_declaration
     * so I am just gonna keep the name consistent.
     * @param node 
     * @param ctx 
     * @returns string[];
     */
    processPropertyDeclaration(node: Node, ctx: Context): string {
        assertNodeType(node, 'property_declaration');
        const ret: string[] = [];

        node.children.forEach(n => {
            switch (n.type) {
                case 'call_expression':
                    ret.push(this.handleCallExpression(n, ctx));
                    break;
                // const [fn, args] = n.children;
                // if (args?.children[0]?.type === 'value_arguments') {
                //     const str = args.children[0]?.children.slice(1, -1).reduce((ret, n) => ret += n.text, '');
                //     const clzName = asInner(fn.text, ctx);
                //     const clzTxt = asSrc(ctx).getClass(clzName) ? `new ${clzName}` : fn.text;
                //     ret.push(`${clzTxt}({${str}})`);
                //     break;
                // }
                case 'let':
                    ret.push('const');
                    break;
                case 'var':
                    ret.push('let');
                    break;
                case 'pattern':
                    ret.push(...this.process(ctx, n.children));
                    break;
                case '=':
                    ret.push(n.text);
                    break;
                case 'type_annotation':
                    ret.push(':');
                    const ta = this.processTypeAnnotation(n, ctx);
                    ret.push(ta.type);
                    if (ta.hasQuestionToken) {
                        ret.push(' | undefined');
                    }
                    break;
                default:
                    ret.push(this.processNode(n, ctx));
            }
        });

        return ret.join(' ');
    }

    simpleIdentifier(v: string, clz: Context) {

        if (isClassDecl(clz) && clz.getProperty(v)) {
            return `this.${v}`;
        }
        const src = asSrc(clz);
        const inner = asInner(v, clz);
        if (src.getClass(inner)) {
            return `new ${inner}`;
        }
        if (asSrc(clz).getClass(v)) {
            return `new ${v}`;
        }
        return v;
    }
    processRangeExpression(node: Node, ctx: Context) {
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
    handleCallSuffix(node: Node, ctx: Context): string {
        assertNodeType(node, 'call_suffix');
        type Arg = {
            name?: string,
            value?: string,
        }
        const args: Arg[] = [];
        node.children.forEach(n => {
            switch (n.type) {
                case 'lambda_literal': {
                    args.push({ value: this.processLambdaLiteral(n, ctx) });
                    break;
                }
                case 'value_arguments':
                    n.children.forEach(v => {
                        let arg: Arg | undefined;
                        switch (v.type) {
                            case 'range_expression':
                                const range = this.processRangeExpression(v.children[0], ctx);
                                this.asType(ctx, 'range');
                                args.push({ value: `range({from:${range.from}, to:${range.to}, inclusive:${range.inclusive}}, ${ret})` });
                                break;
                            case '.':
                            case '[':
                            case ']':
                            case '(':
                            case ')':
                                break;
                            case ',':
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
                                        default:
                                            if (!arg) arg = {};
                                            arg.value = this.processNode(va, ctx);

                                    }
                                })

                                break;
                            }


                            default:
                                unknownType(v, 'call_expression->call_suffix->value_arguments')
                        }

                    });
                    break;
                default:
                    unknownType(n, 'call_expression->call_suffix');
            }
        });
        if (args.length == 0){
            return '()';
        }
        const namedArgs:Arg[] = [], unnamedArgs:Arg[] = [];
        args.forEach(v => (v.name != null ? namedArgs : unnamedArgs).push(v));
        let ret = unnamedArgs.map(v => v.value).join(',');
        if (namedArgs.length) {
            if (ret) {
                ret += ',';
            }
            ret += '{' + namedArgs.map((k) => `${k.name}:${k.value}`).join(',') +'}';
        }
        return '('+ret+')';
    }
    handleCallExpression(node: Node, ctx: Context): string {
        let ret = '';
        node.children.forEach(n => {
            switch (n.type) {
                case 'simple_identifier':
                    this.asType(ctx, n.text);
                    ret += this.simpleIdentifier(n.text, ctx);
                    break;
                case 'call_suffix':
                    ret += this.handleCallSuffix(n, ctx);
                    break;
                case 'navigation_expression':
                    ret += this.processNode(n, ctx);
                    break;
                default:
                    unknownType(n, 'call_expression');
            }
        });

        return ret;
    }

    processIfStatement(node: Node, clz: Context): string {
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
                    ret.push(this.processStatement(n, clz).join(''));

                    break;
                case 'comparison_expression':
                    ret.push(this.processStatement(n, clz).join(''));
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
                case 'simple_identifier':
                    ret.push(this.processNode(n, clz));
                    break;
                case 'if_statement':
                    ret.push(this.processIfStatement(n, clz))
                    break;
                case 'as_expression':
                    const label = n.children[0].text;
                    ret.push(label);
                    as = `&& ${label} instanceof ${asInner(n.children[2].text, clz)}`;
                    break;
                default:
                    unknownType(n, 'if_statement');
                    ret.push(...this.processStatement(n, clz));
            }
        });
        return ret.join(' ');
    }
    //node.type === 'switch_statement';
    processSwitchStatement(node: Node, ctx: Context): string {
        assertNodeType(node, 'switch_statement');
        const ret: string[] = [];
        const cls = asClass(ctx);
        node.children.forEach(n => {

            switch (n.type) {
                case 'self_expression':
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
                                    ret.push(`${cls?.getName()}${se.text}:`);
                                } else {
                                    ret.push(`${se.text}:`);
                                }
                                break;
                            case 'statements':
                                ret.push(this.processStatement(se, ctx).join(' '));
                                ret.push(';break;\n');
                                break;
                            default:
                                unknownType(se, 'switch_entry');
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
                    ret.push(this.simpleIdentifier(n.text, ctx));
                    break;

                default:
                    unknownType(n, 'switch_statement');

            }
        });
        return ret.join('')
    }
    process(ctx: Context, n: Node[], start: number = 0, end: number | undefined = undefined, fn = this.processNode): string[] {
        return ((start || end) ? n.slice(start, end) : n).map(v => fn.call(this, v, ctx));
    }
    processDictionaryLiteral(n: Node, ctx: Context): string {
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
    processGuardStatement(n: Node, ctx: Context): string {
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
    processNode(n: Node | undefined, ctx: Context): string {
        if (n == null) {
            return '';
        }
        switch (n.type) {
            case 'guard_statement':
                return this.processGuardStatement(n, ctx);
            case 'dictionary_literal':
                return this.processDictionaryLiteral(n, ctx);
            case 'array_literal':
                this.asType(ctx, 'SwiftArray');
                return this.process(ctx, n.children).join(' ');
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
            case 'oct_literal':
            case 'hex_literal':
            case 'bin_literal':
                return n.text;
            case 'source_file':
                return '';
            case 'nil':
                return 'undefined';
            case 'self_expression':
                return 'this';
            case 'switch_statement':
                return this.processSwitchStatement(n, ctx);
            case 'simple_identifier':
                return this.simpleIdentifier(n.text, ctx);
            case 'property_declaration':
                return this.processPropertyDeclaration(n, ctx);

            case 'call_expression':
                return this.handleCallExpression(n, ctx);
            case 'navigation_expression':
                //this.node.dot.node
                const [first, ...rest] = n.children;
                const retNe = `${asClass(ctx)?.getProperty(first.text) ? 'this.' : ''}${first.text}${rest.map(v => v.text).join('')}`
                return retNe;

            //                return this.processStatement(n, ctx).join('');
            case 'call_suffix':
                return this.handleCallSuffix(n, ctx);
            case 'value_arguments':
                throw new Error(`use handleCallExpression instead`);

            case 'assignment':

                if (n.children[0]?.type === 'simple_identifier') {
                    return this.clone(n.text, ctx);
                }
                //I dunno are these cloneable?
                switch (n.children[1].type) {
                    case '-=':
                    case '+=':
                    case '^=':
                    case '*=':
                        return this.processStatement(n, ctx).join(' ');
                }
                return `${this.processNode(n.children[0], ctx)} ${n.children[1].text} ${this.clone(n.children[2].text, ctx)}`

            case 'tuple_expression':
                const tuples: [string | undefined, string | undefined][] = [];
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
                            unknownType(t, 'tuple_expresion');
                    }
                });
                if (value || name) {
                    tuples.push([name, value])
                }
                this.asType(ctx, 'tuple');
                return `tuple(${tuples.map(([k, v]) => `[${k ? JSON.stringify(k) : 'undefined'}, ${v}]`).join(',')})`;
            case 'additive_expression':
            case 'comparison_expression':

            case 'multiplicative_expression':
            case 'directly_assignable_expression':
            case 'control_transfer_statement':
                return this.processStatement(n, ctx).join(' ');
            case 'real_literal':
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
            case '-=':
                if (n.parent?.type === 'value_argument' && n.previousSibling?.type == ':') {
                    //try to capture operator methods;
                    this.asType(ctx, 'operator');
                    return ` operator("${n.text}") `;
                }
                return ` ${n.text} `;
            case '"':
                if (n.parent?.type === 'line_string_literal') {
                    return '';
                }
            case 'boolean_literal':
            case 'integer_literal':
                return n.text
            case 'navigation_suffix':
                return n.text;
            case 'lambda_literal':
                return this.processLambdaLiteral(n, ctx);
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
                return this.asType(ctx, n.text);
            case 'function_type':
                return this.handleFunctionType(n, ctx);
                ; case 'ERROR':
                throw new Error(`processNode: '${n.type}' '${n.text}'`);

            default:
                unknownType(n, 'processNode');
                return n.text;
        }
    }
    /*
    handles the type of function not an actual function
    ()->Void;
    */
    handleFunctionType(node: Node, ctx: Context): string {

        assertNodeType(node, 'function_type');
        let ret = '';
        node.children.forEach(n => {
            switch (n.type) {
                case 'user_type':
                    ret += this.processNode(n, ctx);
                    break;
                case '->':
                    ret += ' => ';
                    break;
                //I think this is a bug in the parser
                // so we gonna treat it like parameters.
                case 'tuple_type':
                    n.children.forEach(t => {
                        switch (t.type) {
                            case '(':
                            case ')':
                                ret += t.type;
                                break;
                            default:
                                unknownType(t, 'function_type->tuple_type');
                        }
                    });
                    break;
                default:
                    unknownType(n, 'function_type');
            }
        })

        return ret;
    }
    handleParam(node: Node, ctx: Context): Param {
        let param: Partial<Param> = {};
        node.children.forEach(n => {
            switch (n.type) {
                case ':':
                    break;
                case 'function_type': {
                    param.type = this.processNode(n, ctx);
                    break;
                }
                case 'simple_identifier':
                    if (param.name) {
                        param.internal = param.name;
                    }
                    param.name = n.text;
                case 'optional_type':
                    param.optional = true;
                    param.type = this.asType(ctx, n.children[0]?.text)
                    break;

                case 'user_type':
                    param.type = this.processNode(n, ctx);
                    break;
                case 'array_type':
                    param.type = this.asType(ctx, n.children[1]?.text) + '[]';
                    break;
                default:
                    unknownType(n, 'handleParam');

            }
        });
        return param as Param;
    }
    processLambdaLiteral(node: Node, ctx: Context): string {
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
                                returnType = this.processNode(lft, ctx);
                                break;
                            case 'lambda_function_type_parameters':
                                lft.children.forEach(lf => {
                                    switch (lf.type) {
                                        case ',': break;
                                        case 'lambda_parameter':
                                            params.push(this.handleParam(lf, ctx));
                                            break;
                                        default:
                                            unknownType(lf, 'lambda_literal->lambda_function_type_parameters->lambda_function_type')
                                    }
                                });
                                break;
                            default:
                                unknownType(lft, 'lambda_literal->lambda_function_type');
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
                    unknownType(n, 'lamda_literal');
            }

        });
        const finStatements = lambdaReturn(statements);
        if (!params.length) {
            for (const [name] of finStatements.matchAll(/(\$\d+?)/g)) {
                params.push({ name });
            }
        }
        const lambda =
            (params.length == 1 && !params[0]?.type) ?
                `${toParamStr(params)}=>${finStatements}`
                :
                `(${toParamStr(params)})=>${finStatements}`;
        return lambda;
    }
    handleForStatement(node: Node, ctx: Context): string {
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
                    this.asType(ctx, 'range', '@tswift/util');
                    ret += `range("${n.text}")`;
                    break;
                case 'simple_identifier':
                    ret += this.processNode(n, ctx);
                    break;
                case 'call_expression':
                    ret += this.handleCallExpression(n, ctx);
                    break;
                default:
                    unknownType(n, 'for_statement')
                    ret += this.processNode(n, ctx);

            }
        });

        return ret;
    }
    stringToNode(v: string): Node {
        if (!this._parser) {
            throw new Error(`_parser not initialized`);
        }
        return this._parser?.parse(v).rootNode;
    }
    processStatement(n: Node | undefined, clz: Context): string[] {
        if (!n) {
            return [];
        }
        return n.children.map(c => this.processNode(c, clz));
    }

    handleAddProperty(node: Node, ctx: Context, comment?: string): ComputedPropDecl | undefined {
        let prop: OptionalKind<PropertyDeclarationStructure> = { name: '__unknown__' };
        let computedNode: Node | undefined;

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
                        switch (m.type) {
                            case 'attribute':
                                const name = this.asType(ctx, replaceStart('@', m.text));
                                prop.decorators = [...(prop.decorators || []), { name }];
                                break;
                            case 'visibility_modifier':
                                prop.scope = toScope(m.text);
                                break;
                            case 'property_modifier':
                                switch (m.text) {
                                    case 'override':
                                        prop.hasOverrideKeyword = true;
                                        break;
                                    case 'abstract':
                                        prop.isAbstract = true;
                                        break;
                                    case 'static':
                                        prop.isStatic = true;
                                        break;
                                    default:
                                        unknownType(m, 'property->modifiers->property_modifier');
                                }
                                break;
                            default:
                                unknownType(m, 'property->modifiers');
                        }
                    });
                    break;
                }

                case 'line_string_literal':
                    prop.initializer = n.text;
                    prop.type = 'string';
                    break;
                case 'boolean_literal':
                    prop.initializer = n.text;
                    prop.type = 'boolean';
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
                    const p = asClass(ctx)?.addProperty(prop);
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
                default: unknownType(n, 'property');
            }
        });

        const cls = asClass(ctx);
        if (!cls) {
            throw new Error(`no class to add property to`);
        }
        const p = cls.addProperty(prop);
        if (comment) {
            p.addJsDoc(comment);
        }
        return computedNode ? [computedNode, p] : undefined;
    }
    processTypeAnnotation(n: Parser.SyntaxNode, ctx: Context): {
        hasQuestionToken?: boolean;
        type: string
    } {
        const prop: { hasQuestionToken?: boolean, type?: string } = {}
        n.children?.forEach(t => {
            switch (t.type) {
                case 'optional_type':
                    prop.hasQuestionToken = true;
                    prop.type = this.asType(ctx, t.child(0)?.text);
                    break;
                case ':': break;
                case 'user_type':
                    prop.type = this.asType(ctx, t.text);
                    break;
                case 'opaque_type':
                    prop.type = this.asType(ctx, t.text);
                    console.log('unknown opaque_type: ' + t.text);
                    break;
                case 'array_type':
                    this.asType(ctx, 'Array', '@tswift/util');
                    prop.type = 'Array<' + this.asType(ctx, t.children[1]?.text) + '>';
                    break;
                default:
                    unknownType(t, 'type_annotation');
            }
        });
        if (!prop.type) {
            throw new Error(`no  type found for type_annotation: ` + n.text);
        }
        return prop as any;
    }

    handleComputedProperty(node: Node, pd: PropertyDeclaration, ctx: Context) {
        let prop: PropertyDeclaration | GetAccessorDeclaration | SetAccessorDeclaration = pd;
        const clz = asClass(ctx);
        if (!clz) {
            throw new Error(`can not add a computed property to a non-class`)
        }
        let getter: { statements: string[] } | undefined;
        let setter: {
            statements: string[];
            parameters: { name: string; type?: string }[];
        } | undefined;
        let decoratorType: string;

        node.children.forEach(n => {
            switch (n.type) {
                case '{':
                case '}':
                    break;
                case 'statements': {
                    if (prop instanceof PropertyDeclaration) {
                        const struct = unkind(prop.getStructure());
                        prop.remove();
                        clz.addGetAccessor({
                            ...struct,
                            decorators: [
                                ...(struct.decorators || []),
                                { name: this.asType(ctx, 'Cache', '@tswift/util') }],
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
                                                    returnType: 'void',
                                                });
                                            }
                                            break;
                                        case 'simple_identifier':
                                            if (!setter) setter = { statements: [], parameters: [] };
                                            setter.parameters.push({
                                                name: s.text, type:
                                                    this.asType(ctx, prop?.getType().getText())
                                            });
                                            break;
                                        default: unknownType(s, 'computed_property->computed_setter');

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

                                            if (prop) {
                                                const returnType = this.asType(ctx, prop.getType().getText());
                                                const struct = unkind(prop.getStructure());
                                                if (prop instanceof PropertyDeclaration) {
                                                    prop.remove();
                                                }

                                                prop = clz?.addGetAccessor({
                                                    ...struct,
                                                    ...getter,
                                                    returnType,
                                                });
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
                                if (prop) {
                                    const struct = unkind(prop.getStructure());
                                    if (prop instanceof PropertyDeclaration) {
                                        prop.remove();
                                    }
                                    prop = clz?.addGetAccessor({
                                        ...struct,
                                        ...getter
                                    });
                                }
                                break;
                            default:
                                unknownType(v, 'computed_property');
                        }
                    });
                    break;
                case 'call_expression':
                    if (n.children[1]?.children[0]?.type === 'lambda_literal') {
                        if (prop instanceof PropertyDeclaration)
                            prop.setInitializer(n.children[0].text)
                        const lamda = n.children[1].children[0].children[1];
                        lamda?.children.forEach(d => {
                            d.children?.forEach(l => {
                                switch (l.type) {
                                    case 'call_suffix':
                                        const d = prop?.getDecorator(decoratorType);

                                        const proc = this.processStatement(l, ctx).join(' ');

                                        d?.addArgument(
                                            'function' + (proc.startsWith('(') ? '' : '(oldValue)') + proc
                                        );
                                        break;
                                    //implement willSet/didSet
                                    case 'simple_identifier':
                                        decoratorType = this.asType(ctx, l.text)
                                        prop?.addDecorator({ name: decoratorType });
                                        break;
                                    default:
                                        console.log('unknown lamda willset prop ' + l.type);
                                        break;
                                }
                            });
                        })

                    } else {
                        if (prop instanceof PropertyDeclaration) {
                            prop?.setInitializer(this.processStatement(n, ctx).join(''));
                        } else {
                            throw new Error(`not a property can not initialize`);
                        }
                    }
                    break;
                default:
                    unknownType(n, 'computed_property');
            }
        });
        return prop;
    }
    handleClassDecl(node: Node, ctx: Context) {
        assertNodeType(node, 'class_declaration', 'enum_declaration');
        if (node.children[0].type === 'enum') {
            return this.handleEnum(node, ctx);
        }
        return this.handleClass(node, ctx);
    }
    handleClassBody(node: Node, clz: ClassDeclaration): void {
        let comment: string | undefined;
        let constructors: Node[] = [];
        node.children.filter(p => p.type === 'class_declaration').forEach(v => {
            this.handleClassDecl(v, clz);
        });
        const computedProperties: [Node, PropertyDeclaration][] = [];
        node.children.forEach(n => {
            switch (n.type) {
                case '{':
                case '}':
                    break;
                case 'property_declaration': {
                    const p = this.handleAddProperty(n, clz, comment);
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
                case 'function_declaration':
                    if (n.child(0)?.type == 'init') {
                        constructors.push(n);
                    } else {
                        this.handleFunction(n, clz);
                    }
                    break;
                case 'class_declaration':
                    //handled up top;
                    break;
                case 'ERROR':
                    console.warn('handleClassBody Error:', n.text);
                    break;
                default:
                    unknownType(n, 'class_body');
            }
        });
        if (comment) {
            clz.addJsDoc(comment);
        }
        //parameters before constructors or else accessors become a problem.
        this.handleComputedProperties(computedProperties, clz);
        this.handleConstructors(constructors, clz);
    }

    handleComputedProperties(computedProperties: ComputedPropDecl[], clz: Context) {
        computedProperties.forEach(([node, prop]) => this.handleComputedProperty(node, prop, clz));
    }

    handleConstructors(constructors: Node[], clz: ClassDeclaration): void {
        const parameters: [CParam[], Node?][] = [];

        constructors.forEach(constructor => {
            const perConst: CParam[] = []
            const current: [CParam[], Node?] = [perConst];
            parameters.push(current);
            constructor.children.forEach(v => {
                switch (v.type) {
                    case 'init':
                    case '(':
                    case ')':
                        break;
                    case 'parameter': {
                        perConst.push(this.handleParam(v, clz));
                        break;
                    }
                    case 'function_body':
                        current.push(v.children[1]);
                        break;
                    default: unknownType(v, 'constructor');
                }

            })
        });

        if (parameters.length === 1) {
            const [params, node] = parameters[0];
            clz.addConstructor({
                parameters: params.map(({ optional: hasQuestionToken, internal: name, type }) => ({
                    name: name as string,
                    hasQuestionToken,
                    type,
                })),
                statements: this.processStatement(node, clz),
            });
        } else {
            parameters.forEach(([params, node], idx) => clz.addMethod({
                name: cname(idx),
                scope: Scope.Private,
                parameters: params.map(({ optional: hasQuestionToken, name = '__unknown__', internal, type }) => ({
                    name: internal || name,
                    hasQuestionToken,
                    type,
                    returnType: 'void',
                })),
                typeParameters: clz.getTypeParameters().map(v => v.getName()),
                statements: this.processStatement(node, clz),
            }));
            const cType = clz.getName() + 'Constructor';
            if (parameters.length) {
                const src = asSrc(clz);
                const types: string[] = [];
                parameters.forEach(([param, node], idx) => {
                    const name = cname(idx, cType);
                    types.push(name);
                    src.insertInterface(clz.getChildIndex(), {
                        name,
                        properties: param.map(({ name = '__unknown__', type, optional: hasQuestionToken }) => ({
                            name,
                            type: this.asType(clz, type),
                            hasQuestionToken
                        }))
                    });
                });
                src.insertTypeAlias(clz.getChildIndex(), {
                    name: cType,
                    type: types.join(' | ')
                });
                clz.addConstructor({
                    parameters: [
                        {
                            name: 'param',
                            type: cType
                        }
                    ],
                    statements: [
                        clz.getExtends() ? 'super(param)' : '//pick the correct init',
                        parameters.map(([config], i) => {
                            this.asType(clz, 'initIfMatching', '@tswift/util');
                            return `initIfMatching(this, '${cname(i)}', param, ${JSON.stringify(config)} )`
                        }).join(' || ')]
                })

            } else {
                const typeParameters = clz.getTypeParameters().map(v => v.getName());
                //So if its a class without a constructor,
                // we add one to emulate swift's default constructor named
                // parameter behaviour.
                // If a property is optional, than the param is optional, 
                // if a property has a initial value than the param is optional.
                // otherwise a property will be required.
                // if all parameters are optional, than so should 
                // the constructor param.
                let hasQuestionTokenParam = true;
                const intf = asSrc(clz).insertInterface(clz.getChildIndex(), {
                    name: cType,
                    typeParameters,
                    properties: clz.getProperties().filter(v => {
                        return !v.isStatic();
                    }).map(d => {
                        const name = d.getName();

                        const type = this.asType(clz, d.getType().getText());

                        const hasQuestionToken = d.hasQuestionToken() || d.getInitializer() != null;
                        hasQuestionTokenParam = hasQuestionTokenParam && hasQuestionToken;
                        return ({ name, type, hasQuestionToken })
                    })
                });

                clz.addConstructor({
                    parameters: [{
                        name: 'param',
                        hasQuestionToken: hasQuestionTokenParam,
                        type: cType + (typeParameters.length ? `<${typeParameters.join(',')}>` : '')
                    }],
                    statements: [
                        clz.getExtends() ? 'super()' : '//assign params',
                        ...intf.getProperties().map(p => {
                            const { name, } = p.getStructure();
                            const paramName = this.clone(`param${hasQuestionTokenParam ? '?' : ''}.${name}`, clz);
                            if (!p.hasQuestionToken() && !p.hasInitializer()) {
                                return `this.${name} = ${paramName};`;
                            }
                            return `if (param && ('${name}' in param) && param.${name} !== undefined) this.${name} = ${paramName};`;
                        })
                    ]
                });
            }
        }
    }


    handleFunction(node: Node, ctx: Context): void {
        let func: Parameters<ClassDeclaration['addMethod']>[0] = {
            name: '__unknown__'
        };
        let params: Param[] = [];
        let statements: string[] = [];
        let tupleReturn: [string | undefined, string | undefined][] = [];
        node.children.forEach((n) => {
            switch (n.type) {
                case ',':
                case '(':
                case ')':
                case '->':
                case 'func': break;
                case 'parameter':
                    params.push(this.handleParam(n, ctx));
                    break;
                case 'modifiers':
                    func.scope = toScope(n.text);
                    break;
                case 'simple_identifier':
                    func.name = n.text;
                    break;
                case 'user_type':
                    func.returnType = this.asType(ctx, n.text);
                    break;
                case 'function_body':
                    n.children.forEach(f => {
                        switch (f.type) {
                            case '{':
                            case '}':
                                break;
                            default:
                                statements.push(...this.processStatement(f, ctx));
                                break;
                        }
                    });
                    break;
                case 'tuple_type':
                    let retType = '';
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
                                unknownType(t, 'handleFunction->tuple_type');
                        }
                    });
                    func.returnType = `[${tupleReturn.map(([k, v]) => v).join(',')}]`;
                    break;
                case 'throws':
                    break;
                default:
                    unknownType(n, 'function');
            }
        });
        if (isClassDecl(ctx)) {
            const m = ctx.addMethod(func);
            m.addStatements(statements);

            if (params.length) {
                m.addParameter({
                    name: writeDestructure(params),
                    type: writeType(params)
                })
            }



        } else {
            let f:FunctionDeclaration | VariableStatement = ctx.addFunction({
                name: func.name,
                isAsync: func.isAsync,
                isExported: true,
            });
            if (params.length) {
                f.addParameters(toParams(params));
                
            }
            f.addStatements(statements);
            if (params.length) {
                f.setIsExported(false);
                const orig = f.getText();
                f.remove();
                this.asType(ctx, 'func')
                f = ctx.addVariableStatement({
                    declarationKind: VariableDeclarationKind.Const,
                    isExported: true,
                    declarations: [{
                        name: func.name,
                        initializer: `func(${orig}, ${params.map(v => JSON.stringify(v.name)).join(',')})`
                    }]
                });
            }

            if (tupleReturn.length) {
                f.setIsExported(false);
                const orig = f.getText();
                f.remove();
                const wrapped = JSON.stringify(tupleReturn.map(([v]) => v));
                this.asType(ctx, 'tupleWrap');
                ctx.addVariableStatement({
                    declarationKind: VariableDeclarationKind.Const,
                    isExported: true,
                    declarations: [{
                        name: func.name,
                        initializer: `tupleWrap(${wrapped} as const, ${orig})`
                    }]
                });

            }
        }
    }
    handleEnum(node: Node, ctx: Context) {
        const src = asSrc(ctx);

        let enums: OptionalKind<PropertyDeclarationStructure>[] = [];
        let typeParameter: string | undefined;
        let clzName = '';
        let enm: ClassDeclaration | undefined;
        node.children.forEach(c => {
            switch (c.type) {
                case ':':
                case 'enum':
                    break;
                case 'type_identifier':
                    clzName = asInner(c.text, ctx);
                    enm = this.addClass({
                        name: clzName,
                    }, asSrc(ctx), `return new ${clzName}(this.rawValue)`);
                    break;
                case 'inheritance_specifier':
                    typeParameter = this.asType(ctx, c.text);
                    break;
                case 'enum_class_body':
                    if (!enm) throw new Error(`class should have been created by now`);
                    enums = this.processEnums(c, enm, typeParameter);
                    break;
                default:
                    unknownType(c, 'enum');
            }
        });

        if (!enm) {
            throw new Error('should have defined enum by this point');
        }


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
        this.asType(ctx, 'Array', '@tswift/util');
        enm.addProperty({
            isStatic: true,
            name: 'allCases',
            scope: Scope.Public,
            isReadonly: true,
            initializer: `[${enums.map(v => `${clzName}.${v.name}`).join(', ')}] as const`,
        });

        return enm;
    }
    processEnums(node: Node, clz: ClassDeclaration, type?: string) {
        const enums: OptionalKind<PropertyDeclarationStructure>[] = [];
        let start: number | undefined;
        const clzName = clz.getName() as string;
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
                                enm.initializer = `new ${clzName}(${this.processNode(ec, clz)})`;
                        }
                    });
                    enums.push(enm);
                    break;
                case 'class_declaration':
                    this.handleClassDecl(e, clz);
                    break;
                case 'property_declaration':
                    const p = this.handleAddProperty(e, clz);
                    if (p) {
                        computedProps.push(p);
                    }
                    break;
                default:
                    unknownType(e, 'enum');

            }
        });
        this.handleComputedProperties(computedProps, clz);
        return enums;
    }

    handleClass(node: Node, ctx: Context): void {
        let clz: ClassDeclaration | undefined;
        let typeParameters: string[] = [];
        const src = asSrc(ctx);
        let isStruct = false;
        for (let i = 0; i < node.childCount; i++) {
            const n = node.child(i);
            if (!n) continue;
            switch (n.type) {
                case ':':
                    break;
                case 'class':
                    isStruct = false;
                    break;
                case 'struct':
                    isStruct = true;
                    break;
                case 'type_identifier':
                    let name = n.text;
                    const next = node.child(i + 2);
                    let extend: string | undefined;
                    if (next?.type === 'inheritance_specifier') {
                        extend = this.asType(src, next.text);
                        i += 2;
                    }
                    clz = this.addClass({
                        name,
                        extends: extend,
                        typeParameters,
                    }, ctx, isStruct);

                    break;
                case 'class_body':
                    if (!clz) throw new Error('class_body but no class?');
                    this.handleClassBody(n, clz);
                    break;
                case 'type_parameters':
                    n.children.forEach(v => {
                        switch (v.type) {
                            case '>':
                            case '<':
                            case ',':
                                break;
                            case 'type_parameter':
                                if (clz) {
                                    clz?.addTypeParameter(v.text);
                                } else {
                                    typeParameters.push(v.text);
                                }
                                break;
                            default:
                                unknownType(v, 'handleClass->type_parameter');
                        }
                    })
                    break;
                case 'enum':
                case 'enum_class_body':
                    break;
                case 'class_declaration':
                    this.handleClassDecl(n, clz || ctx);
                    break;
                default:
                    unknownType(n, 'class');
            }
        }
    }
    async save() {
        return this.config.project.save();
    }
}
