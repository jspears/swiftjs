import { Param } from "text";
import { ClassDeclaration, ClassDeclarationStructure, ClassExpression, OptionalKind, SourceFile, ThrowStatement } from "ts-morph";
import { SyntaxNode as Node } from "web-tree-sitter";


export class ContextImpl {

    private scope: Map<string, string|undefined> = new Map<string, string|undefined>;
    constructor(public src: SourceFile, public clazz?: ClassDeclaration | ClassExpression, public parent?: ContextImpl,) {
    }
    walk(v: (c:ContextImpl)=> boolean):ContextImpl | undefined{
        return v(this) ? this : this.parent?.walk(v);
    }
    classNameFor(name: string) {

        const cname = this.walk(v => v.clazz?.getProperty(name) != null)?.getClassName();
        if (cname) {
            return `${cname}.${name}`;
        }
        return name;
        
    }
    inScope(name: string): boolean {
        //const name = check.replace(/import\("[^"]*"\)\./, '').replace(/<.*>/, '');

        return this.scope.has(name) ||
            this.clazz?.getTypeParameter(name) != null ||
            this.src.getClass(name) != null ||
            this.src.getVariableDeclaration(name) != null ||
            this.parent?.inScope(name) ||
            this.src.getClass(name) != null ||
            this.hasClass(name)             ;
    }
    hasClass(name: string): boolean {
        
        if (this.clazz?.getName() === name) {
            return true;
        }
        if (this.src.getClass(name)) {
            return true;
        }
        return this.clazz?.getProperty(name)?.getType() instanceof ClassExpression ?? this.parent?.hasClass(name) ?? false;
    }

    getParentClass() {
        return this.walk(v => v.clazz !== this.clazz);
    }
    getClassName(): string | undefined {
        const pClass = this.getParentClass();
        if (pClass?.clazz) {
            return `${pClass.getClassName()}.${this.clazz?.getName()}`;
        }
        return this.clazz?.getName();
    }
    getClass() {
        return this.clazz;
    }
    getClassOrThrow(message = 'no class in context') {
        if (!this.clazz) {
            throw new Error(message);
        }
        return this.clazz;
    }
    inThisScope(name: string) {
        if (this.inScope(name)) {
            return false;
        }
        return this.clazz?.getMember(name) != null;
    }

    addImport(namedImport: string, moduleSpecifier: string) {
        const imp = this.src.getImportDeclaration((impl) =>
            impl.getModuleSpecifier().getLiteralValue() === moduleSpecifier
        ) || this.src.addImportDeclaration({ moduleSpecifier })
        if (namedImport && !imp.getNamedImports().find(v => v.getText() === namedImport)) {
            imp.addNamedImport(namedImport);
        }
        return namedImport;
    }
    /** adds a class and also creates a new context for the class */
    addClass({ name, ...clazz }: OptionalKind<ClassDeclarationStructure>,
        isCloneOnAssign?: boolean | string | string[] | ((className: string) => string)): ContextImpl {
        if (!name) {
            throw new Error(`must have a class name`);
        }

        let clz:ClassDeclaration | ClassExpression = this.src.addClass({
            ...clazz,
            name,
            isExported: this.clazz == null
        });
        if (this.clazz) {
            const initializer = clz.getText();
            clz.remove();
            clz = (this.clazz.addProperty({
                name: name,
                initializer,
                isStatic: true,
                isReadonly: true
            }).getInitializer() as ClassExpression);
            
        };
        const ctx = this.newContext(clz);

        if (isCloneOnAssign) {
            ctx.addImport('cloneable', '@tswift/util');
            clz.addMethod({
                name: '[cloneable]',
                statements:
                    typeof isCloneOnAssign === 'function' ? isCloneOnAssign(name) :
                        isCloneOnAssign === true ? `return new ${name}(this);` : isCloneOnAssign
            })
        }
        return ctx;
    }
    unknownType(n: Node, message: string = '') {
        console.warn(`unknown type ${message}: '${n.type}'`, n.text);
        debugger;
    }
    newContext(clazz: ClassDeclaration | ClassExpression) {
        return new ContextImpl(this.src, clazz || this.clazz, this);
    }

    add(...label: (Param| [string, string|undefined])[]):ContextImpl {
        const ctx = new ContextImpl(this.src, this.clazz, this);
        label.forEach(v=>Array.isArray(v) ?ctx.scope.set(v[0], v[1]) : ctx.scope.set(v.name, v.type))
        return ctx;
    }
}