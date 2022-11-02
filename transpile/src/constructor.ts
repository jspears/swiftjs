import { ConstructorDeclarationStructure, Node as TSNode, OptionalKind, Scope } from 'ts-morph';
import { Param } from "./internalTypes";
import { ContextImpl } from "./context";
import { toDestructureBody, toParamBody } from "./paramHelper";
import { toType } from "./toType";
import { handleOverload } from './overload';
import { inTwo } from './group';

export function makeConstructor(constructors: [Param[], string][], ctx: ContextImpl) {
    const cls = ctx.getClassOrThrow();
    const className = cls.getName() || 'UNKNOWN';
    const typeParameters = cls.getTypeParameters().map(v => v.getStructure());
    let hasQuestionTokenParam = true;
    //Generate parameters from the optional and uninitalized class properties.   
    //If a constructor is specified than the default constructor is not created.
    const nonStatic: Param[] = (constructors.length != 0 || ctx.isExtension) ? [] : cls.getProperties()
        .filter(v => {
            if (v.isStatic()) {
                return false;
            }
            if (v.getScope() == Scope.Private || v.getScope() == Scope.Protected) {
                return false;
            }
             return !TSNode.isCallExpression(v.getInitializer()
            )
        }).map(d => {
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
        const overloadParams = parameters.reduce((ret, [params]) => {
        const [named, unnamed] = inTwo(params, p => p.name !== '_');

        const parameters = unnamed.map(v => ({ name: v.internal || 'param', hasQuestionToken: v.optional, type: v.type }));
        if (named.length) {
            parameters.push({ name: 'param', hasQuestionToken: isAllOptional(named), type: toParamBody(named) });
        }
         if (parameters.length)
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
        parameters: params,
        statements: [statement]
    }));

  const constructor:OptionalKind<ConstructorDeclarationStructure> = {
        overloads: [
            ...overloadParams.map((parameters) => ({
                parameters
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
               nonStatic.length ? [`const ${toDestructureBody(nonStatic)} = _args[0]; `, ...parameters.map(([, b]) => b)] : []),
            `if (_args[0] instanceof ${className}) Object.assign(this, _args[0])`
        ]
  }
    
    if (constructor.overloads?.length == 1) {
        constructor.parameters = constructor.overloads.shift()?.parameters ?? [];
        constructor.statements = [];
        if (cls.getExtends()) {
            constructor.statements.push('super()');
        }
        if (ctx.clazz?.getMember('[cloneable]')) {
            constructor.statements.push(`Object.assign(this, param)`);
        }
    }

    cls.addConstructor(constructor);

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