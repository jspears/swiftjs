import { getParser } from "./parser";
import { CallExpression, GetAccessorDeclaration, OptionalKind, ParameterDeclarationStructure, Project, PropertyDeclarationStructure, Scope, SetAccessorDeclaration, SourceFile, Statement, StructureKind } from "ts-morph";
import { readFile as fsReadFile } from 'fs/promises';
import { basename, join } from "path";
import Parser from "web-tree-sitter";
import { ClassDeclaration } from "ts-morph";
import { replaceEnd, replaceStart } from "text";
import { isSourceFile } from "typescript";

type Node = Parser.SyntaxNode;

export interface TranspileConfig {
    project: Project;
    srcDir: string;
    readFile: typeof fsReadFile,
    basedir(path: string): string,
    overwrite: boolean,
    importMap: Record<string, string>,
    builtInTypeMap: Record<string, string>,
}
const cname = (n: number) => n == 0 ? 'init' : `init$${n - 1}`;

export class Transpile {
    project: Project;
    asType(srcOrClz: SourceFile | ClassDeclaration, namedImport?: string, moduleSpecifier: string = '@tswift/ui'): string {
        const src = srcOrClz instanceof SourceFile ? srcOrClz : srcOrClz.getSourceFile();

        if (namedImport) {
            if (namedImport in this.config.builtInTypeMap) {
                return this.config.builtInTypeMap[namedImport];
            }
            if (src.getClass(namedImport)) {
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
        this.project = project;
    }
    async parse(content: string) {
        return (await getParser()).parse(content);
    }
    async transpile(name: string, content?: string) {
        if (!content) {
            content = await this.config.readFile(name, 'utf8');
        }
        const srcFile = this.project.createSourceFile(join(this.config.srcDir, replaceEnd('.swift', this.config.basedir(name)) + '.ts'), '', {
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
            default:
                console.log('not handled node', node.type);
        }
    }
    processExpression(node: Parser.SyntaxNode, clz: ClassDeclaration): string[] {
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
    processPropertyDeclaration(node: Parser.SyntaxNode, clz: ClassDeclaration): string {
        const ret: string[] = [];

        node.children.forEach(n => {
            switch (n.type) {
                case 'let':
                    ret.push('const');
                    break;
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

    simpleIdentifier(v: string, clz: ClassDeclaration) {
        if (clz.getProperty(v)) {
            return `this.${v}`;
        }
        if (clz.getSourceFile().getClass(v)) {
            return `new ${v}`;
        }
        return v;
    }

    processStatement(node: Parser.SyntaxNode | undefined, clz: ClassDeclaration): string[] {
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
                case 'return':
                case '=':
                case '(':
                case ')':
                case ':':
                case '+':
                case '/':
                case '-':
                case ',':
                case 'integer_literal':
                case 'navigation_suffix':
                    ret.push(n.text);
                    break;
                default:
                    ret.push(n.text);
                    console.log('unknown statement', n.type);
            }
        }

        return ret;
    }

    handleProperty(node: Parser.SyntaxNode, clz: ClassDeclaration) {
        let prop: OptionalKind<PropertyDeclarationStructure> = { name: '__unknown__' };
        let expression: CallExpression | undefined;

        let getter: { statements: string[] } | undefined;
        let setter: {
            statements: string[];
            parameters: { name: string; type?: string }[];
        } | undefined;
        let statements: string[] | undefined;

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
                                prop.scope = m.text as Scope;
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
                            case 'statements':
                                statements = this.processStatement(v, clz);
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
                    prop.initializer = this.processStatement(n, clz).join('');
                    break;
                default:
                    console.log('unknown property: ' + n.type);
            }
        }
        if (prop.initializer == null) {
            prop.hasQuestionToken = true;
        }
        if (prop.decorators && prop.decorators.length) {
            //can't have decorators on scopeed properties
            delete prop.scope;
        }
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
        type MiniP = Partial<{
            name: string;
            internal: string;
            type: string;
            optional?: boolean;
        }>;
        const parameters: [MiniP[], Node?][] = [];

        constructors.forEach(constructor => {
            const perConst: MiniP[] = []
            const current:[MiniP[], Node?] = [perConst];
            parameters.push(current);
            constructor.children.forEach(v => {
                switch (v.type) {
                    case 'init':
                    case '(':
                    case ')':
                        break;
                    case 'parameter': {
                        let key: keyof MiniP = 'name';
                        const param: MiniP = {};
                        perConst.push(param);
                        v.children.forEach(p => {
                            switch (p.type) {
                                case ':':
                                    break;
                                case 'user_type': {
                                    param.type = (param.optional = p.type.endsWith('?')) ? this.asType(clz, p.type.slice(0, -1)) : p.type;
                                    break;
                                }
                                case 'simple_identifier':
                                    if (key !== 'optional') {
                                        param[key] = p.text;
                                        key = 'internal';
                                    }
                                    break;
                            }
                        });
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
        
        parameters.forEach(([params, node], idx) => clz.addMethod({
            name: idx === 0 ? 'init': `init$${idx -1 }`,
            scope: Scope.Private,
            parameters: params.map(({ optional:hasQuestionToken, internal: name, type }) => ({
                name: name as string,
                hasQuestionToken,
                type, returnType: 'void',
            })),
            statements: this.processStatement(node, clz),
        }));


    }
    handleFunction(node: Node, clz: ClassDeclaration): void {

    }
    handleClass(node: Parser.SyntaxNode, src: SourceFile): void {
        let clz: ClassDeclaration | undefined;

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
                    });
                    break;
                case 'class_body':
                    if (!clz) throw new Error('class_body but no class?');
                    this.handleClassBody(n, clz);
                    break;
                default:
                    console.log('in class ' + n.type);
            }
        }
    }
    async save() {
        return this.project.save();
    }
}
export async function run(files: string[]) {
    const t = new Transpile();
    for (const file of files) {
        console.log(`--file ${file}--`);
        await t.transpile(file);
    }
    await t.save();
}
run(process.argv.slice(2)).then(console.log, console.error);