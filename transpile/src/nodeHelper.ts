import { isSourceFile } from "./guards";
import { Node, Context } from "./types";

export const assertNodeType = (node: Node, ...type: string[]) => {
    if (!type.includes(node?.type)) {
        console.warn(`Expected a node  of type '${type.join(',')}' got '${node?.type}'`);
        debugger;
    }
};
export const asSrc = (ctx: Context) => {
    if (isSourceFile(ctx)) {
        return ctx;
    }
    return ctx.getSourceFile();
};
export const asClass = (ctx: Context) => {
    if (!isSourceFile(ctx)) {
        return ctx;
    }
    return;
};
export const cname = (n: number, prefix = 'init') => n == 0 ? prefix : `${prefix}$${n - 1}`;
export const asInner = (name: string, ctx: Context) => {
    const clz = asClass(ctx);
    if (!clz) {
        return name;
    }
    return clz.getName() + '_' + name;
};
