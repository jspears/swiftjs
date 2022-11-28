import { Param } from "./internalTypes";
import { Node as TSNode, ClassDeclaration, ClassDeclarationStructure, OptionalKind, SourceFile, } from "ts-morph";
import { SyntaxNode as Node } from "web-tree-sitter";
import { resolveType } from './resolveMap';

export class ContextImpl {
    isMutateScope = false;
    isExtension = false;

    //in the future change this to make sure it does not conflict with scoped variables.
    addBuiltIn(text: string) {
        this.addImport(text, '@tswift/util');
        return text;
    }

    mutateScope(scope: boolean) {
        const ctx = this.newContext();
        ctx.isMutateScope = scope;
        return ctx;
    }
    private scope: Map<string, string | undefined> = new Map<string, string | undefined>;
    constructor(public src: SourceFile, public clazz?: ClassDeclaration, public parent?: ContextImpl,) {
    }
    walk(v: (c: ContextImpl) => boolean): ContextImpl | undefined {
        return v(this) ? this : this.parent?.walk(v);
    }
    typeFor(name: string): string | undefined {
        
        return this.scope.get(name)  ?? this.clazz?.getProperty(name)?.getType().getText() ?? this.parent?.typeFor(name);
    }
    classNameFor(name: string) {
        
        const cname = this.clazz?.getName();
        if (cname) {
            return `${cname}_${name}`;
        }
        return name;

    }
    inHiearchyScope(name: string): boolean {
        if (this.hasClass(name)) {
            return true;
        }
        if (this.getClassName() == name) {
            return true;
        }
        if (this.scope.has(name)) {
            return true;
        }

        if (this.clazz?.getTypeParameter(name) != null) {
            return true;
        }
        if (this.parent?.inHiearchyScope(name)) {
            return true;
        }

        return false;
    }
    inScope(name: string): boolean {
        //const name = check.replace(/import\("[^"]*"\)\./, '').replace(/<.*>/, '');

        return this.inHiearchyScope(name) ||
            this.src.getClass(name) != null ||
            this.src.getFunction(name) != null || 
            this.src.getVariableDeclaration(name) != null 
    }
    hasClass(name: string): boolean {
        if (this.src.getClass(name) != null) {
            return true;
        }
        return this.src.getClass(this.classNameFor(name)) != null;
    }

    getParentClass() {
        return this.walk(v => v.clazz !== this.clazz);
    }
    getClassName(): string | undefined {
        return this.clazz?.getName();
    }
    getClass() {
        return this.clazz;
    }
    getClassOrThrow(message = 'no class in context') {
        if (!this.clazz) {
            debugger;
            throw new Error(message);
        }
        return this.clazz;
    }
    inThisScope(name: string) {
        if (this.inScope(name)) {
            return false;
        }
        const member = this.clazz?.getMember(name);
        if (member == null) {
            return false;
        }
        // MethodDeclaration | PropertyDeclaration | GetAccessorDeclaration | SetAccessorDeclaration 
        if (TSNode.isMethodDeclaration(member) || TSNode.isPropertyDeclaration(member) || TSNode.isGetAccessorDeclaration(member) || TSNode.isSetAccessorDeclaration(member)) {
            return !member.isStatic()
        }
        return false;
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
        isCloneOnAssign?: boolean | string | string[] | ((className: string) => string),
        isExtension: boolean = false,
    ): ContextImpl {
        if (!name) {
            throw new Error(`must have a class name`);
        }
        if (isExtension) {
            name = resolveType(name, this);
        }
        if (name == null) {
            throw new Error('class needs name');
        }
        const className = this.classNameFor(name+(isExtension ? '$Extension' : '')) ?? "WHAT"
        let clz: ClassDeclaration = this.src.addClass({
            ...clazz,
            name:className,
            isExported: this.clazz == null,
            extends: isExtension ? name : undefined,
            implements: isExtension ? [name] : undefined,
        });

        const ctx = this.newContext(clz);
        ctx.isExtension = isExtension;

        if (!isExtension && isCloneOnAssign) {
            clz.addMethod({
                name: `[${ctx.addBuiltIn('cloneable')}]`,
                statements:
                    typeof isCloneOnAssign === 'function' ? isCloneOnAssign(className) :
                        isCloneOnAssign === true ? `return new ${className}(this);` : isCloneOnAssign
            })
        }
        return ctx;
    }
    unknownType(n: Node, message: string = '') {
        if (n.type == 'ERROR') {
            console.warn(`error parsing source file `, this.src.getFilePath()+ 'at ['+n.startPosition.row+':'+n.startPosition.column+']');
        } else {
            console.warn(`unknown type ${message}: '${n.type}'`, n.text);
            debugger;
        }
    }
    newContext(clazz?: ClassDeclaration) {
        const ctx = new ContextImpl(this.src, clazz || this.clazz, this);
        ctx.isMutateScope = this.isMutateScope;
        ctx.isExtension = this.isExtension;
        return ctx;
    }

    add(...label: (Param | [string, string | undefined])[]): ContextImpl {
        const ctx = new ContextImpl(this.src, this.clazz, this);
        label.forEach(v => Array.isArray(v) ? ctx.scope.set(v[0], v[1]) : ctx.scope.set((v.name == '_' ? v.internal : v.name) ?? '', v.type))
        return ctx;
    }
    clone(text: string | undefined, type?: string) {
        if (text) {
            //Figure out better logic for this
            //struct/enum's get cloned.... everything else not so much
            // array?  I dunno.  
            const varType = type || this.typeFor(text);

            switch (varType) {
                case 'bigint':
                case 'function':
                case 'symbol':
                case 'string':
                case 'boolean':
                case 'number':
                    return text;
            }
            return `${text}?.[${this.addBuiltIn('cloneable')}]?.() ?? ${text}`;
        }
        return '';
    }
}