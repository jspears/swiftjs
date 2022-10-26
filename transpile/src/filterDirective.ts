import { SyntaxNode } from "web-tree-sitter";

export function filterDirective(nodes: SyntaxNode[]): SyntaxNode[] {
    let directiveDepth = 0;
    return nodes.filter(v => {
        if (v.type === 'directive') {
            if (v.text == '#endif') {
                directiveDepth--;
            } else if (v.text.startsWith('#if ')) {
                directiveDepth++;
            }
            return false;
        }
        return directiveDepth === 0;
    })
}