import { ContextImpl } from "./context";
import { Scope, StructureKind, FunctionDeclaration, MethodDeclaration, Node as TSNode, PropertyDeclaration, VariableStatement, VariableDeclarationKind, FunctionDeclarationStructure } from "ts-morph";
import { Param } from "@tswift/util";
import { unfunc } from "./manipulate";
import {  toDestructureBody, toParamBody, unkind, writeDestructure, writeType } from "text";
import { inTwo } from "group";

export type Func = {
    kind?: StructureKind.Method;
    scope?: Scope;
    isAsync?: boolean;
    name: string;
    parameters: Param[];
    statements: string[];
    returnType?: string;
};

function overloadClass(ctx: ContextImpl, func: Func, tupleReturn?: TupleT[]) {
    
    const clazz = ctx.getClassOrThrow();
    const member = clazz.getMember(func.name);
    const overloadParamNames: string[] = [];
    let _overload;
    if (member) {
        if (TSNode.isMethodDeclaration(member)) {
            overloadParamNames.push(...member.getParameters().map(v => v.getName()));
        }
        _overload = unfunc(member);
        member.remove();
    }
    let m: MethodDeclaration | PropertyDeclaration = clazz.addMethod(func);
    if (tupleReturn?.length) {
        
    }

    //If all the parameters are '_' positional than we don't have to wrap in a func.
    if (TSNode.isMethodDeclaration(m) && func.parameters.every(v => v.name == '_' && v.internal)) {
        func.parameters.forEach(v => {
            if (!v.internal) {
                throw new Error('methods need parameter names');
            }
            TSNode.isMethodDeclaration(m) &&
                m.addParameter({
                    name: v.internal,
                    type: v.type,

                });
        });
    } else if (func.parameters.length) {
        m.addParameter({
            name: writeDestructure(func.parameters),
            type: writeType(func.parameters)
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
        const initializer = `${ctx.addBuiltIn('overload')}(${_overload},${JSON.stringify(func.parameters)},${otext} )`;
        clazz.addProperty({
            name,
            scope,
            initializer
        });

    }
    return ctx;


}

function overloadVar(ctx: ContextImpl, { parameters, kind, ...func }: Func,  tupleReturn?:TupleT[]):ContextImpl {
    let f: FunctionDeclaration | VariableStatement = ctx.src.addFunction({
        isExported: true,
        ...func,
    });
    const [named, unnamed] = inTwo(parameters, v => v.name !== '_');
    f.addParameters(unnamed.map(v => ({ ...v, name: v.internal || '' })));
    f.addParameter({
        name: toDestructureBody(named),
        type: toParamBody(named),
    });
    if (tupleReturn?.length) {
        f.setIsExported(false);
        const name = f.getName() || 'unnamed';
        f.setReturnType('');
        const body = f.getText();
        const pos = f.getChildIndex();
        f.remove();
        ctx.src.insertVariableStatement(pos, {
            isExported:true,
            declarationKind: VariableDeclarationKind.Const,
            declarations: [
                {
                    name,
                    initializer:`${ctx.addBuiltIn('retuple')}(${body}, ${JSON.stringify(tupleReturn.map(([v])=>v))})`
                }
            ]            
        });

    }
    return ctx.add(...parameters);
    // if (parameters.length) {
    //     f.setIsExported(false);
    //     const orig = f.getText();
    //     f.remove();
    //     ctx.addImport('func', '@tswift/util');
    //     f = ctx.src.addVariableStatement({
    //         declarationKind: VariableDeclarationKind.Const,
    //         isExported: true,
    //         declarations: [{
    //             name: func.name,
    //             initializer: `func(${orig}, ${parameters.map(v => JSON.stringify(v.name)).join(',')})`
    //         }]
    //     });
    // }
}

export function handleOverload(ctx: ContextImpl, func: Func, tupleReturn?: TupleT[]) {
//    console.log(tupleReturn);
    return ctx.clazz ? overloadClass(ctx, func, tupleReturn) : overloadVar(ctx, func, tupleReturn);
}

function wrapTuple(ctx: ContextImpl, f: FunctionDeclaration, tupleReturn:TupleT[]): string {
    f.setIsExported(false);
    const name = f.getName() || 'unnamed';
    f.setReturnType('');
    const body = f.getText();
    const pos = f.getChildIndex();
    f.remove();
    return `${ctx.addBuiltIn('retuple')}(${body}, ${JSON.stringify(tupleReturn.map(([v]) => v))})`;         
}
type TupleT = [string | undefined, string | undefined];