import { ContextImpl } from "context";

const TypeMap = {
    Double: 'Number',
    Int: 'Number',
    Float: 'Number',
    String: 'String',
    Character: 'String',
    Bool: 'Boolean',
    Array: 'Array',
} as const;

export function resolveType(name:string, ctx: ContextImpl) {

    return (name in TypeMap) ? TypeMap[name as keyof typeof TypeMap] : name;
}
