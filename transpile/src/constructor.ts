import { ContextImpl } from "./context";
import { Node as TSNode } from 'ts-morph';
import { Param } from "@tswift/util";
import { toParamBody } from "./text";
import { toType } from "./toType";
export function makeConstructor(parameters: [Param[], string][], ctx: ContextImpl) {
    const cls = ctx.getClassOrThrow();
    const className = cls.getName() || 'UNKNOWN';
    const typeParameters = cls.getTypeParameters().map(v => v.getStructure());
    let hasQuestionTokenParam = true;
    //Generate parameters from the optional and uninitalized class properties.   
    const nonStatic: Param[] = cls.getProperties().filter(v => !v.isStatic() && !TSNode.isCallExpression(v.getInitializer())).map(d => {
        const name = d.getName();
        const type = toType(d);
        const optional = d.hasQuestionToken() || d.hasInitializer();
        hasQuestionTokenParam = hasQuestionTokenParam && optional;
        return ({ name, type, optional })
    });
    if (nonStatic.length) {
        parameters = [...parameters, [
            nonStatic,
            nonStatic.map(({ name, optional, type }) => {
                const paramName = ctx.clone(name, type);
                if (!optional) {
                    return `this.${name} = ${paramName};`;
                }
                return `if(${name} !== undefined) this.${name} = ${paramName};`;
            }).join('\n')
        ]];
    }

    if (parameters.length) {
        ctx.addImport('Overload', '@tswift/util');
        ctx.addImport('isOverloadConstructorIdx', '@tswift/util');
    }

    const overloadPosParam = parameters.map(([p]) => (p as Param[]));
    const overloadParams = overloadPosParam.map(v => toParamBody(v as Param[]));
    cls.addDecorator({
        name: 'Overload',
        arguments: [JSON.stringify(overloadPosParam)]
    })

    cls.addConstructor({
        overloads: [
            ...overloadParams.map((type) => ({
                parameters: [{ name: 'param', type }]
            })),
            ...overloadPosParam.map(parameters => ({ parameters })),
            {
                parameters: [{
                    name: 'param',
                    hasQuestionToken: true,
                    type: className + (typeParameters.length ? `<${typeParameters.map(v => v.name).join(',')}>` : ''),
                }]
            }

        ],
        parameters: [{
            name: '_args',
            isRestParameter: true,
            type: 'any[]'
        }],
        statements: [
            ctx.getClassOrThrow().getExtends() ? `super(..._args)` : '',
            ...parameters.map(([config, logic], i) => `if (isOverloadConstructorIdx<${overloadParams[i]}>(${i}, _args[0], _args[1])){
                                    const {${config.map(p => p.internal && p.internal != p.name ? `${p.name}:${p.internal}` : p.name).join(',')}} = _args[1];
                                    ${logic}
                                    return this;
                                }`),
            `if (_args[0] instanceof ${className}) Object.assign(this,_args[0])`
        ]
    });

    return overloadPosParam;
}