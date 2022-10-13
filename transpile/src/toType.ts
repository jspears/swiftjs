import { GetAccessorDeclaration, MethodDeclaration, Node as TSNode, PropertyDeclaration, SetAccessorDeclaration } from "ts-morph";

export const toType = (prop?:  PropertyDeclaration | GetAccessorDeclaration | SetAccessorDeclaration | MethodDeclaration | undefined):string => {
    if (TSNode.isMethodDeclaration(prop)) {
        const ret = prop.getReturnType()?.getApparentType()?.getSymbol()?.getName() ?? 'unknown';
        return ret;
    }
    const type = prop?.getType();
    if (!type) {
        return 'unknown';
    }
    if (type.isArray()) {
        return type.getText();
    }
    const ret =type.getSymbol()?.getName() ?? type.getText() ??  type.getApparentType()?.getSymbol()?.getName() ?? 'unknown';
    return ret;
}

