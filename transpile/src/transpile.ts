import { getParser } from "./parser";
import {
    CallExpression, GetAccessorDeclaration, OptionalKind,
    Project, PropertyDeclarationStructure, Scope, SetAccessorDeclaration, SourceFile, StructureKind
} from "ts-morph";
import { readFile as fsReadFile } from 'fs/promises';
import { basename, join } from "path";
import Parser from "web-tree-sitter";
import { ClassDeclaration } from "ts-morph";
import { Param, replaceEnd, replaceStart, toParameter, toScope } from "text";
import { isSourceFile, isClassDecl } from "guards";
import { MethodSignature } from "typescript";
import { parseStr, toStringLit } from "parseStr";

type CParam = Partial<{
    name: string;
    internal: string;
    type: string;
    optional?: boolean;
}>;

type Context = SourceFile | ClassDeclaration;
type Node = Parser.SyntaxNode;
const asSrc = (ctx: Context) => {
    if (isSourceFile(ctx)) {
        return ctx;
    }
    return ctx.getSourceFile();
}
const asClass = (ctx: Context) => {
    if (!isSourceFile(ctx)) {
        return ctx;
    }
    return;
}
export interface TranspileConfig {
    project: Project;
    srcDir: string;
    readFile: typeof fsReadFile,
    basedir(path: string): string,
    overwrite: boolean,
    importMap: Record<string, string>,
    builtInTypeMap: Record<string, string>,
}
const cname = (n: number, prefix = 'init') => n == 0 ? prefix : `${prefix}$${n - 1}`;

export class Transpile {
    asType(srcOrClz: Context, namedImport?: string, moduleSpecifier: string = '@tswift/ui'): string {
        const src = asSrc(srcOrClz);
        if (namedImport) {
            if (namedImport in this.config.builtInTypeMap) {
                return this.config.builtInTypeMap[namedImport];
            }
            if (src.getClass(namedImport)) {
                return namedImport;
            }
            if (asClass(srcOrClz)?.getTypeParameter(namedImport)) {
                return namedImport;
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
    config: TranspileConfig;
    constructor({
        readFile = fsReadFile,
        overwrite = true,
        basedir = basename,
        importMap = { 'SwiftUI': '@tswift/ui' },
        builtInTypeMap = { 'Bool': 'boolean', 'Double': 'number', 'Int': 'number', 'String': 'string' },
        srcDir = '${__dirname}/../example/src',
        project = new Project({
            tsConfigFilePath: `${__dirname}/../example/tsconfig.json`
        })
    }: Partial<TranspileConfig> = {}) {
        this.config = { readFile, overwrite, basedir, importMap, builtInTypeMap, srcDir, project };
    }
    _parser?: Parser;
    async parse(content: string) {
        this._parser = await getParser();
        return this._parser.parse(content);
    }
    async transpile(name: string, content?: string) {
        if (!content) {
            content = await this.config.readFile(name, 'utf8');
        }
        const srcFile = this.config.project.createSourceFile(join(this.config.srcDir, replaceEnd('.swift', this.config.basedir(name)) + '.ts'), '', {
            overwrite: this.config.overwrite
        });

        const tree = await this.parse(content);
        this.handleRoot(tree.rootNode, srcFile);
        return srcFile;

    }
    handleRoot(node: Parser.SyntaxNode, src: SourceFile): void {
        switch (node.type) {
            case 'source_file':
                node.children.forEach(child => this.handleRoot(child, src));
                break;
            case 'import_declaration':
                this.asType(src, '', node.children[1].text);
                break;
            case 'comment':
                src.addStatements(node.text);
                break;
            case 'class_declaration':
                this.handleClass(node, src);
                break;
            case 'call_expression':
                const statements = this.processStatement(node, src);
                src.addStatements(statements);
                break;
            case 'property_declaration':
                src.addStatements(this.processPropertyDeclaration(node, src));
                break;
            default:
                console.log('handleRoot did not handle node', node.type);
        }
    }
    processExpression(node: Parser.SyntaxNode, clz: Context): string[] {
        let ret: string[] = [];

        node.children.forEach(n => {
            switch (n.type) {
                case 'simple_identifier':
                    ret.push(this.simpleIdentifier(n.text, clz));
                    break;
                case 'navigation_expression':
                    ret.push(this.processExpression(n, clz).join(''));
                    break;
                default:
                    ret.push(n.text);
            }
        });
        return ret;
    }


    /**
     * Maybe not what you think.  The parser calls all assignment property_declaration
     * so I am just gonna keep the name consistent.
     * @param node 
     * @param clz 
     * @returns string[];
     */
    processPropertyDeclaration(node: Parser.SyntaxNode, clz: Context): string {
        const ret: string[] = [];

        node.children.forEach(n => {
            switch (n.type) {
                case 'let':
                    ret.push('const');
                    break;
                case 'call_expression':
                    const [fn, args] = n.children;
                    if (args?.children[0]?.type === 'value_arguments') {
                        const c0 = args.children[0]
                        let str = ''
                        for (let i = 1; i < c0.childCount - 1; i++) {
                            const n = c0.child(i);
                            if (!n) continue;
                            str += n.text;
                        }
                        const clzTxt = asSrc(clz).getClass(fn.text) ? `new ${fn.text}` : fn.text;
                        ret.push(`${clzTxt}({${str}})`);
                        break;
                    }
                case 'var':
                    ret.push('let');
                    break;
                case 'additive_expression':
                    ret.push(this.processExpression(n, clz).join(' '));
                    break;
                default:
                    ret.push(n.text);
            }
        });

        return ret.join(' ');
    }

    simpleIdentifier(v: string, clz: Context) {
        if (isClassDecl(clz) && clz.getProperty(v)) {
            return `this.${v}`;
        }
        if (asSrc(clz).getClass(v)) {
            return `new ${v}`;
        }
        return v;
    }

    processStatement(node: Parser.SyntaxNode | undefined, clz: Context): string[] {
        if (!node) {
            return [];
        }
        const ret: string[] = [];
        for (let i = 0; i < node.childCount; i++) {
            const n = node.child(i);
            if (!n) continue;
            switch (n.type) {
                case 'simple_identifier':
                    ret.push(this.simpleIdentifier(n.text, clz));
                    break;
                case 'property_declaration':
                    ret.push(this.processPropertyDeclaration(n, clz));
                    break;
                case 'call_expression':
                case 'navigation_expression':
                    ret.push(this.processStatement(n, clz).join(''))
                    break;
                case 'call_suffix':
                // const c0 = n.child(0);
                // if (c0?.type == 'value_arguments'){
                //     let str = '';
                //     for(let i=1;i<c0.childCount-1;i++){
                //         str+= c0.child(i)?.text || ''
                //     }
                //     ret.push(`({${str}})`);
                //     break;
                // }

                case 'value_argument':
                case 'value_arguments':
                case 'assignment':
                case 'additive_expression':
                case 'tuple_expression':
                case 'multiplicative_expression':
                case 'directly_assignable_expression':
                case 'control_transfer_statement':
                    ret.push(this.processStatement(n, clz).join(' '))
                    break;
                case 'real_literal':
                case 'return':
                case '=':
                case '(':
                case ')':
                case ':':
                case '+':
                case '/':
                case '-':
                case ',':
                case '[':
                case ']':
                case '{':
                case '}':
                case 'integer_literal':

                case 'navigation_suffix':
                    ret.push(n.text);
                    break;
                case 'ERROR':
                    console.warn('Error ', n.text);
                case 'lambda_literal':
                    ret.push(this.processStatement(n, clz).join(' '))
                    break;
                case 'line_string_literal':
                    if (this._parser != null) {
                        const parts = parseStr(n.children[1]?.text);
                        const str = toStringLit({
                            literals: parts.literals,
                            values: parts.values.map(v => this.processStatement(this._parser?.parse(v).rootNode, clz).join(''))
                        });
                        ret.push(str);

                        break;
                    }
                    //fall through
                case 'statements':
                    ret.push(this.processStatement(n, clz).join(' '))
                    break;
                case 'if_statement':
                    n.children.forEach(is => {
                        switch (is.type) {
                            case 'if':
                                ret.push('if', '(');
                                break;
                            case 'statements':
                            case 'comparison_expression':
                                ret.push(...this.processStatement(is, clz));
                                break;
                            case '}':
                                ret.push('}');
                                break;
                            case '{':
                                ret.push('){');
                                break;

                        }
                    })
                    //ret.push(this.processStatement(n, clz).join(' '))

                    break;
                default:
                    ret.push(n.text);
                    console.log('unknown statement', n.type);
            }
        }

        return [ret.join(' ')];
    }

    handleProperty(node: Parser.SyntaxNode, clz: ClassDeclaration) {
        let prop: OptionalKind<PropertyDeclarationStructure> = { name: '__unknown__' };
        let expression: CallExpression | undefined;

        let getter: { statements: string[] } | undefined;
        let setter: {
            statements: string[];
            parameters: { name: string; type?: string }[];
        } | undefined;

        for (let i = 0; i < node.childCount; i++) {
            const n = node.child(i);
            if (!n) continue;
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
                                const name = this.asType(clz, replaceStart('@', m.text));
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
                                        console.log('unknown property modifier', m.text);
                                }
                                break;
                            default:
                                console.log('property modifier unknown: ' + m.type);
                        }
                    });
                    break;
                }
                case 'real_literal':
                case 'line_string_literal':
                case 'boolean_literal':
                case 'integer_literal':
                    prop.initializer = n.text;
                    break;
                case '=':
                    break;
                case 'type_annotation':
                    n.children?.forEach(t => {
                        switch (t.type) {
                            case ':': break;
                            case 'user_type':
                                prop.type = this.asType(clz, t.text);
                                break;
                            case 'opaque_type':
                                console.log(t.text);
                                break;
                            case 'array_type':
                                this.asType(clz, 'Array', '@tswift/util');
                                prop.type = 'Array<' + this.asType(clz, t.children[1]?.text) + '>';
                                break;
                            default:
                                console.log('unknown type annotation ' + t.type);
                        }
                    });

                    break;
                case 'prefix_expression':
                    const type = n.parent?.children.find(v => v.type === 'type_annotation')?.children?.[1]?.text;
                    if (type) {
                        prop.initializer = `${type}${n.text}`
                    }
                    break;
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
                                            setter.statements.push(...this.processStatement(s, clz));
                                            break;
                                        case 'simple_identifier':
                                            if (!setter) setter = { statements: [], parameters: [] };
                                            setter.parameters.push({ name: s.text, type: prop.type as string });
                                            break;
                                        default:
                                            console.log('unknown computed_setter', s.type);

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
                                            getter.statements.push(...this.processStatement(s, clz));
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
                                getter.statements.push(...this.processStatement(v, clz));
                                break;
                            default:
                                console.log('unknown computed property', v.type);
                        }
                    });
                    break;
                case '/':
                    console.log('what', n.text);
                    break;
                case ',':
                    clz.addProperty(prop);
                    break;
                case 'call_expression':
                    if (n.children[1]?.children[0]?.type === 'lambda_literal') {
                        prop.initializer = n.children[0].text;
                        const lamda = n.children[1].children[0].children[1];
                        lamda?.children.forEach(d => {
                            d.children?.forEach(l => {
                                switch (l.type) {
                                    case 'call_suffix':
                                        const d = prop.decorators;
                                        if (d?.length) {
                                            const dec = d?.slice(-1)[0];
                                            if (dec) {
                                                const proc = this.processStatement(l, clz).join(' ');

                                                dec.arguments = [
                                                    'function' + (proc.startsWith('(') ? '' : '(oldValue)') + proc
                                                ]
                                            }

                                        }
                                        break;
                                    //implement willSet/didSet
                                    case 'simple_identifier':
                                        if (!prop.decorators) {
                                            prop.decorators = [];
                                        }
                                        ;
                                        prop.decorators.push({
                                            name: this.asType(clz, l.text)

                                        })
                                        break;
                                    default:
                                        console.log('unknown lamda willset prop ' + l.type);
                                        break;
                                }
                            });
                        })

                    } else {
                        prop.initializer = this.processStatement(n, clz).join('');
                    }
                    break;
                case 'array_literal':
                    prop.initializer = this.processStatement(n, clz).join('');
                    break;
                default:
                    console.log('unknown property: ' + n.type);
            }
        }
        if (prop.initializer == null) {
            prop.hasQuestionToken = true;
        }
        // if (prop.decorators && prop.decorators.length) {
        //     //can't have decorators on scopeed properties
        //     delete prop.scope;
        // }
        if (getter || setter) {
            let g: GetAccessorDeclaration | undefined, s: SetAccessorDeclaration | undefined;
            if (getter) {
                g = clz.addGetAccessor({
                    kind: StructureKind.GetAccessor,
                    name: prop.name,
                    scope: prop.scope,
                    isStatic: prop.isStatic,
                    returnType: prop.type,
                    ...getter,
                })
            }
            if (setter) {
                s = clz.addSetAccessor({
                    kind: StructureKind.SetAccessor,
                    name: prop.name,
                    scope: prop.scope,
                    isStatic: prop.isStatic,
                    ...setter,
                })
            }
            if (!g && !s) {
                throw new Error(`no accessor and setter should not happen`);
            }
            return g || s;

        }

        const p = clz.addProperty(prop);

        if (expression) {
            console.log(expression);
        }
        return p;
    }
    handleClassBody(node: Parser.SyntaxNode, clz: ClassDeclaration): void {
        let comment: string | undefined;
        let constructors = [];
        for (let i = 0; i < node.childCount; i++) {
            const n = node.child(i);
            if (!n) continue;

            switch (n.type) {
                case '{':
                case '}':
                    break;
                case 'property_declaration': {
                    const p = this.handleProperty(n, clz);
                    if (comment) {
                        p?.addJsDoc(comment);
                        comment = undefined;
                    }
                    break;
                }
                case 'comment': {
                    comment = replaceStart('//', n.text);
                    break;
                }
                case 'ERROR':
                    console.warn('handleClassBody Error:', n.text);
                    break;
                case 'function_declaration':
                    if (n.child(0)?.type == 'init') {
                        constructors.push(n);
                    } else {
                        this.handleFunction(n, clz);
                    }
                    break;
                default:
                    console.log('class_body ' + n.type);
            }
        }
        if (comment) {
            console.warn('unused comment');
            clz.addJsDoc(comment);
        }
        this.handleConstructors(constructors, clz);
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
                        perConst.push(toParameter(v, name => this.asType(clz, name)));
                        break;
                    }
                    case 'function_body':
                        current.push(v.children[1]);
                        break;
                    default: {
                        console.log('unknown constructor type', v.type);
                    }
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
            })
        } else {
            parameters.forEach(([params, node], idx) => clz.addMethod({
                name: cname(idx),
                scope: Scope.Private,
                parameters: params.map(({ optional: hasQuestionToken, name = '__unknown__', internal, type }) => ({
                    name: internal || name,
                    hasQuestionToken,
                    type, returnType: 'void',
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
                            type,
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
                asSrc(clz).insertInterface(clz.getChildIndex(), {
                    name: cType,
                    typeParameters,
                    properties: clz.getProperties().map(d => {
                        const name = d.getName();
                        const type = d.getType().getText();

                        const hasQuestionToken = d.hasQuestionToken() || d.getInitializer() != null;
                        return ({ name, type, hasQuestionToken })
                    })
                });
                clz.addConstructor({
                    parameters: [{
                        name: 'param',
                        type: cType + (typeParameters.length ? `<${typeParameters.join(',')}>` : '')
                    }],
                    statements: [
                        clz.getExtends() ? 'super()' : '//assign params',
                        `Object.assign(this, param);`
                    ]
                })


            }
        }


    }
    handleFunction(node: Node, clz: Context): void {
        let func: Parameters<ClassDeclaration['addMethod']>[0] = {
            name: '__unknown__'
        };
        let params: Param[] = [];
        let statements: string[] = [];
        node.children.forEach((n) => {
            switch (n.type) {
                case '(':
                case ')':
                case '->':
                case 'func': break;
                case 'modifiers':
                    func.scope = toScope(n.text);
                    break;
                case 'simple_identifier':
                    func.name = n.text;
                    break;
                case 'user_type':
                    func.returnType = n.text;
                    break;
                case 'parameter':
                    params.push(toParameter(n, name => this.asType(clz, name)));
                    break;
                case 'function_body': {
                    n.children.forEach(f => {
                        switch (f.type) {
                            case '{':
                            case '}':
                                break;
                            default:
                                statements.push(...this.processStatement(f, clz));
                                break;
                        }
                    });
                    break;
                }
                default:
                    console.log('unknown function ' + n.type);
            }
        });

        if (isClassDecl(clz)) {
            const m = clz.addMethod(func);
            m.addStatements(statements);

            if (params.length) {
                const name = clz.getName() + '$' + func.name;
                // asSrc(clz).insertInterface(clz.getChildIndex(), {
                //     name,
                //     typeParameters: m.getTypeParameters().map(v => v.getName()),
                //     properties:params
                // })

                m.addParameter({
                    name: `{${params.map(({ name, internal = name }) => (name != internal ? (name + ':' + internal) : name)).join(',')}}`,
                    type: write => write.write(`{${params.map(({ name, optional, type }) => `${name}${optional ? '?' : ''}:${type}`).join(';')}}`)
                })
            }



        }
    }
    handleClass(node: Parser.SyntaxNode, src: SourceFile): void {
        let clz: ClassDeclaration | undefined;
        let typeParameters: string[] = [];
        for (let i = 0; i < node.childCount; i++) {
            const n = node.child(i);
            if (!n) continue;
            switch (n.type) {
                case ':':
                    break;
                case 'struct':
                    break;
                case 'type_identifier':
                    const name = n.text;
                    const next = node.child(i + 2);
                    let extend: string | undefined;
                    if (next?.type === 'inheritance_specifier') {
                        extend = this.asType(src, next.text);
                        i += 2;
                    }

                    clz = src.addClass({
                        name,
                        isExported: true,
                        extends: extend,
                        typeParameters,
                    });
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
                                console.log('unknown type_parameter', v.type);
                        }
                    })
                    break;
                default:
                    console.log('in class ' + n.type);
            }
        }
    }
    async save() {
        return this.config.project.save();
    }
}
