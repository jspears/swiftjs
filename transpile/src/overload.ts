import { ContextImpl } from "./context";
import { Scope, StructureKind, FunctionDeclaration, MethodDeclaration, Node as TSNode, PropertyDeclaration, VariableStatement, VariableDeclarationKind, FunctionDeclarationStructure, OptionalKind, TypeParameterDeclarationStructure, ParameterDeclarationStructure, SyntaxKind, Node, GetAccessorDeclaration, IfStatement, Block, VariableDeclaration, SourceFile, ArrowFunction, FunctionExpression } from "ts-morph";
import { unfunc } from "./manipulate";
import { toDestructureBody, toParamBody} from "./paramHelper";
import { inTwo } from "./group";
import { Func } from './internalTypes';

export function fixAllFuncs(src: Node) {
    for (const child of src.getChildren()) {
        switch (child.getKind()) {
            case SyntaxKind.MethodDeclaration:
            case SyntaxKind.FunctionDeclaration:
            case SyntaxKind.ArrowFunction:
            case SyntaxKind.FunctionExpression:
                addReturnTuple(child as FunctionDeclaration);
            default:
                fixAllFuncs(child);
        }
    }
}

function getMethod(v: VariableDeclaration | GetAccessorDeclaration | FunctionDeclaration | VariableDeclaration | MethodDeclaration | ArrowFunction | FunctionExpression) {
    if (v.isKind(SyntaxKind.VariableDeclaration)) {
        return v.getInitializerIfKind(SyntaxKind.FunctionExpression) ?? v.getInitializerIfKind(SyntaxKind.ArrowFunction);
    }
    return v;
}
export function addReturnTuple(prop: GetAccessorDeclaration | FunctionDeclaration | VariableDeclaration) {
    const list = getMethod(prop)?.getBody()?.getChildSyntaxList();
    if (list) {
        const newList: string[] = [];
        for(const child of list.getChildren()){
            switch (child.getKind()) {
                case SyntaxKind.ExpressionStatement:
                    newList.push(child.getText());
                    break;
                case SyntaxKind.IfStatement:
                    const ifEx = child as IfStatement;
                    const truthy = (ifEx.getLastChild() as Block)?.getChildSyntaxList()?.getChildren().map(v => v.getText()).join(',');
                    newList.push(`...((${ifEx.getExpression().getText()}) ? [${truthy}] : [])`);
                    break;
                default:
                    //everything other we break.
                    return prop;
                   // newList.push(child.getText());
            }
        }
        getMethod(prop)?.setBodyText( newList.length == 0 ? '' : newList.length === 1 ? `return ${newList[0]}` : `return [${newList.join(',')}]`);

    }
    return prop;
}
function overloadClass(ctx: ContextImpl, func: Func, tupleReturn?: TupleT[]) {
    //    statementsToTuple(ctx, func);
    const clazz = ctx.getClassOrThrow();
    const member = clazz.getMember(func.name);
    let _overload;
    if (member) {
        _overload = unfunc(member);
        member.remove();
    }
    const { parameters, ...fn } = func;
    const [inline, named] = inTwo(parameters, (v) => v.name === '_');
    let m: MethodDeclaration | PropertyDeclaration = clazz.addMethod({

        ...fn,
        kind: StructureKind.Method,
        parameters: [
            ...inline.map(v => ({ ...v, name: v.internal || '' })),
            ...(named.length ? [{
                name: toDestructureBody(named),
                type: toParamBody(named)
            }] : [])
        ]
    });


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

function tupleSerialize(tupleReturn: TupleT[]) {
    const [hasName, noName] = inTwo(tupleReturn, (v) => typeof v[0] == 'string');
    if (hasName.length) {
        return `[${hasName.map(([name, type]: TupleT) => `[${JSON.stringify(name)}, ${type}]`).join(',')}]`
    }
    return `[${noName.map(([name, type]) => type).join(',')}]`
}

function overloadVar(ctx: ContextImpl, { parameters, ...func }: Func, tupleReturn?: TupleT[]): ContextImpl {

    let f: FunctionDeclaration | VariableStatement = ctx.src.addFunction({
        isExported: true,
        ...func,
    });
    if (tupleReturn) {
        addReturnTuple(f);
    }

    const [named, unnamed] = inTwo(parameters, v => v.name !== '_');
    f.addParameters(unnamed.map(v => ({ ...v, name: v.internal || '' })));
    f.addParameter({
        name: toDestructureBody(named),
        type: toParamBody(named),
    });
    if (tupleReturn?.find(([name])=>name != null)) {
        f.setIsExported(false);
        const name = f.getName() || 'unnamed';
        f.setReturnType('');
        const body = f.getText();
        const pos = f.getChildIndex();
        f.remove();

        ctx.src.insertVariableStatement(pos, {
            isExported: true,
            declarationKind: VariableDeclarationKind.Const,
            declarations: [
                {
                    name,
                    initializer: `${ctx.addBuiltIn('retuple')}(${body}, ${JSON.stringify(tupleReturn.map(([v])=>v).filter(Boolean))})`
                }
            ]
        });

    }
    return ctx.add(...(parameters || []));
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

function wrapTuple(ctx: ContextImpl, f: FunctionDeclaration, tupleReturn: TupleT[]): string {
    f.setIsExported(false);
    const name = f.getName() || 'unnamed';
    f.setReturnType('');
    const body = f.getText();
    const pos = f.getChildIndex();
    f.remove();
    return `${ctx.addBuiltIn('retuple')}(${body}, ${JSON.stringify(tupleReturn.map(([v]) => v))})`;
}
type TupleT = [string | undefined, string | undefined];