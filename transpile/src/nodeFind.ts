import { SyntaxNode } from "web-tree-sitter";
type NodeFilter = (n: SyntaxNode) => boolean;
type NodeType = string | NodeFilter;
// ..[name] -- walk parent
// .[name] - direct parent 
// *[name] - direct sibling
// **[name] - nested sibling
// [name,name,name] - pattern
export function findParent(n: SyntaxNode, nodeType: NodeType): SyntaxNode | undefined {
    const check = typeof nodeType === 'string' ? (n: SyntaxNode) => n.type == nodeType : nodeType;
    let p: SyntaxNode | null = n;
    while (p != null) {
        if (check(p)) {
            return p;
        }
        p = p.parent;
    }
}

export const findSib = (type: NodeType, n: SyntaxNode | null | undefined): SyntaxNode | undefined => {
    if (n==null)
        return;
    const fn = typeof type === 'string' ? ((v:SyntaxNode)=>v.type == type) : type;
    if (fn(n)) {
        return n;
    }
    return findSib(fn, n.nextSibling);
};

export function findDescendant(n: SyntaxNode, type: NodeType):SyntaxNode | undefined{
    const fn = typeof type === 'string' ? ((v:SyntaxNode)=>v.type == type) : type;
    if (fn(n)) {
        return n;
    }
    for (const o of n.children) {
        const ret = findDescendant(o, fn);
        if (ret) {
            return ret;
        }
    }
}