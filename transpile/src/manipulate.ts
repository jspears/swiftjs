import { Node, MethodDeclaration, PropertyDeclaration,ClassMemberTypes, Expression } from "ts-morph";



export function unfunc(v: MethodDeclaration | ClassMemberTypes | PropertyDeclaration | Expression | undefined): string {
    if (!v) {
        return '';
    }
    if (v instanceof PropertyDeclaration) {
        const init = v.getInitializer();
        if (init) {
            return init.getText();
        }
    } 
    const children = v.getChildren();
    const first = children[0], last = children[children.length - 1];
    if (Node.isIdentifier(first) && last.getText() != ')' ) {
        first.replaceWithText('function');
    }
    const txt = v.getText();
//    v.forget();
    return txt;
}