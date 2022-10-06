import { asInner } from "nodeHelper";
import { ClassDeclaration, SourceFile } from "ts-morph";


export class ContextImpl {
    parent?: ContextImpl;
    private scope = new Set();
    public clazz?: ClassDeclaration;
    constructor(private src: SourceFile) {
        
    }

    inScope(name: string):boolean {
        return this.scope.has(name) ||
            this.parent?.inScope(name) ||
                this.src.getClass(name) != null ||                    
                    this.src.getVariableDeclaration(name) != null;
    }
    inThisScope(name: string) {
        if (this.inScope(name)) {
            return false;
        }
        return this?.clazz?.getProperty(name) != null;
    }
    className(name: string) {
         return asInner(name, this.clazz || this.src);
    }
    newContext(clazz:ClassDeclaration) {
        const ctx = new ContextImpl(this.src);
        ctx.parent = this;
        ctx.clazz = clazz || this.clazz;

        return ctx;
    }
    add(label: string) {
        this.scope.add(label);
        return this;
    }
}