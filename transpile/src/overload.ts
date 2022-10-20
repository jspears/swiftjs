import { ContextImpl } from "./context";
import { Scope, StructureKind, FunctionDeclaration, MethodDeclaration, Node as TSNode, PropertyDeclaration, VariableStatement, VariableDeclarationKind, FunctionDeclarationStructure } from "ts-morph";
import { Param } from "@tswift/util";
import { unfunc } from "./manipulate";
import { toParams, unkind, writeDestructure, writeType } from "text";

export type Func = {
    kind?: StructureKind.Method;
    scope?: Scope;
    isAsync?: boolean;
    name: string;
    params: Param[];
    statements: string[];
    returnType?: string;
};

function overloadClass(ctx: ContextImpl, func:Func) {
    const clazz = ctx.getClassOrThrow();
    const member = clazz.getMember(func.name);
    const overloadParamNames: string[] = [];
    let _overload;
    if (member) {
        if (member instanceof MethodDeclaration) {
            overloadParamNames.push(...member.getParameters().map(v => v.getName()));
        }
        _overload = unfunc(member);
        member.remove();
    }
    let m: MethodDeclaration | PropertyDeclaration = clazz.addMethod(func);


    //If all the parameters are '_' positional than we don't have to wrap in a func.
    if (TSNode.isMethodDeclaration(m) && func.params.every(v => v.name == '_' && v.internal)) {
        func.params.forEach(v => {
            if (!v.internal) {
                throw new Error('methods need parameter names');
            }
            TSNode.isMethodDeclaration(m) &&
                m.addParameter({
                    name: v.internal,
                    type: v.type,

                });
        });
    } else if (func.params.length) {
        m.addParameter({
            name: writeDestructure(func.params),
            type: writeType(func.params)
        })
        const initializer = unfunc(m);
        m.remove();
        const { kind, ...rest } = func;

        m = clazz.addProperty({
            ...rest,
            initializer
        });
    }


    if (_overload) {
        const scope = m.getScope();
        const name = m.getName();
        if (TSNode.isPropertyDeclaration(m)) {
            const dev = m.getInitializer();
            if (TSNode.isFunctionExpression(dev)) {
                dev.insertParameter(0, {
                    name: 'this',
                    type: clazz.getName() || 'any'
                })
            }
        } else {
            m.insertParameter(0, {
                name: 'this',
                type: clazz.getName() || 'any'
            });
        }
    
        const otext = unfunc(m);
        m.remove();
        ctx.addImport('overload', '@tswift/util');
        const initializer = `overload(${_overload},${JSON.stringify(func.params)},${otext} )`;
        clazz.addProperty({
            name,
            scope,
            initializer
        });

    }

} 

function overloadVar(ctx:ContextImpl, func:Func){
    let f: FunctionDeclaration | VariableStatement = ctx.src.addFunction({
        isExported: true,
        ...unkind(func),
    });
  
    if (func.params.length) {
        f.setIsExported(false);
        const orig = f.getText();
        f.remove();
        ctx.addImport('func', '@tswift/util');
        f = ctx.src.addVariableStatement({
            declarationKind: VariableDeclarationKind.Const,
            isExported: true,
            declarations: [{
                name: func.name,
                initializer: `func(${orig}, ${func.params.map(v => JSON.stringify(v.name)).join(',')})`
            }]
        });
    }
}

export function handleOverload(ctx: ContextImpl, func: Func) {
    return ctx.clazz ? overloadClass(ctx, func) : overloadVar(ctx, func);
}
