import { isSourceFile } from "./guards";
import { Node, Context } from "./types";

export const assertNodeType = (node: Node, ...type: string[]) => {
    if (!type.includes(node?.type)) {
        throw new Error(`Expected a node  of type '${type.join(',')}' got '${node?.type}'`);
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
export const findSib = (type: string | ((v: Node) => boolean), n: Node | null | undefined): Node | undefined => {
    if (!n)
        return;
    const fn = typeof type === 'string' ? ((v:Node)=>v.type == type) : type;
    if (fn(n)) {
        return n;
    }
    return findSib(fn, n.nextSibling);
};
export const cname = (n: number, prefix = 'init') => n == 0 ? prefix : `${prefix}$${n - 1}`;
export const asInner = (name: string, ctx: Context) => {
    const clz = asClass(ctx);
    if (!clz) {
        return name;
    }
    return clz.getName() + '_' + name;
};
