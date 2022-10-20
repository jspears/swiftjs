import { Node as TSNode } from 'ts-morph';
import { Param } from "@tswift/util";

import { ContextImpl } from "./context";
import { toParamBody } from "./text";
import { toType } from "./toType";
import { handleOverload } from 'overload';

export function makeConstructor(constructors: [Param[], string][], ctx: ContextImpl) {
    const cls = ctx.getClassOrThrow();
    const className = cls.getName() || 'UNKNOWN';
    const typeParameters = cls.getTypeParameters().map(v => v.getStructure());
    let hasQuestionTokenParam = true;
    //Generate parameters from the optional and uninitalized class properties.   
    //If a constructor is specified than the default constructor is not created.
    const nonStatic: Param[] = (constructors.length != 0 || ctx.isExtension) ? [] : cls.getProperties().filter(v => !v.isStatic() && !TSNode.isCallExpression(v.getInitializer())).map(d => {
        const name = d.getName();
        const type = toType(d);
        const optional = d.hasQuestionToken() || d.hasInitializer();
        hasQuestionTokenParam = hasQuestionTokenParam && optional;
        return { name, type, optional };
    });

    //If constructors are provided use their implementation.
    //otherwise use the implicit constructor.  I dunno if 
    // an extension can add an uninitialzed property.   Not supporting that right now
    const parameters: [Param[], string][] = constructors.length ? constructors : [[
        nonStatic,
        nonStatic.map(({ name, optional, type }) => {
            const paramName = ctx.clone(name, type);
            if (!optional) {
                return `this.${name} = ${paramName};`;
            }
            return `if(${name} !== undefined) this.${name} = ${paramName};`;
        }).join('\n')]
    ]
    type SP = {
        name: string;
        type: string;
    }
    //    const overloadPosParam = parameters.map((p) => (p as Param[]));
    const overloadParams = parameters.reduce((ret, [params]) => {
        const named:Param[] = [], unnamed:Param[] = [];
        params.forEach(p=>{
            if (p.name == '_') {
                unnamed.push(p);
            } else {
                named.push(p);
            }
        })
        const parameters = unnamed.map(v => ({ name: v.internal || 'param', hasQuestionToken: v.optional, type: v.type }));
        if (named.length) {
            parameters.push({ name: 'param', hasQuestionToken: isAllOptional(named), type: toParamBody(named) });
        }
        ret.push(parameters);
        return ret;
    }, [] as {name:string, hasQuestionTokenParam?:boolean, type:string}[][]);
    const defaultClassConstructor = {
        name: 'param',
        hasQuestionToken: true,
        type: className + (typeParameters.length ? `<${typeParameters.map(v => v.name).join(',')}>` : ''),
    };
    
    constructors.forEach(([params, statement]) => handleOverload(ctx, {
        name: 'init',
        params,
        statements: [statement]
    }));

    cls.addConstructor({
        overloads: [
            ...overloadParams.map((p) => ({
                parameters:p
            })),
            ...(ctx.isExtension || hasSameConstructor(constructors, defaultClassConstructor) ? [] : [{
                parameters: [defaultClassConstructor]
            }])

        ],
        parameters: [{
            name: '_args',
            isRestParameter: true,
            type: 'any[]'
        }],
        statements: [
            cls.getExtends() != null ? `super(..._args)` : '',
            ...(constructors.length ? ['this.init(..._args)'] :
                [`const {${nonStatic.map(p => p.internal && p.internal != p.name ? `${p.name}:${p.internal}` : p.name).join(',')}} = _args[1]; `, ...parameters.map(([, b]) => b)]),
            `if (_args[0] instanceof ${className}) Object.assign(this, _args[0])`
        ]
    });

    

}

function hasSameConstructor(params: [Param[], unknown][], ...check: Param[]): boolean {
    return params.some(([param]) => {
        if (params.length !== check.length) {
            return false;
        }
        for (let i = 0; i < param.length; i++) {
            const p = param[i], arg = check[i];
            if (!(p.name === arg.name && (!p.optional === !arg.optional) && p.type === arg.type)) {
                return false;
            }
        }
        return true;

    })
}


function isAllOptional(params: Param[]) {
    
    for (const param of params) {
        if (!param.optional) {
            return false;
        }
    }

    return false;
}