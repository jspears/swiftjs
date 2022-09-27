import { ClassDeclaration, Scope, SourceFile } from "ts-morph";
import Parser from "web-tree-sitter";

export function replaceStart(prefix: string, v: string) {
    if (v.startsWith(prefix)) {
        return v.slice(prefix.length)
    }
    return v;
}
export function replaceEnd(postfix: string, v: string) {
    if (v.endsWith(postfix)) {
        return v.slice(0, -postfix.length);
    }
    return;
}

export function toScope(text: string): Scope | undefined {
    switch (text) {
        case 'public': return Scope.Public;
        case 'private': return Scope.Private;
        case 'protected': return Scope.Protected;
        case 'mutating':
            return;
    }
    console.log('unknown scope', text);
}

export interface Param {
    name: string;
    internal?: string;
    type?: string;
    optional?: boolean; 
}
export type Context = ClassDeclaration | SourceFile;

export interface ToType {
    (name: string): string;
}
export function toParameter(node: Parser.SyntaxNode, asType:ToType): Param {
    let key: keyof Param = 'name';
    const param: Param = {name:'__unknown__'};
    node.children.forEach(p => {
        switch (p.type) {
            case ':':
                break;
            case 'optional_type':
                param.optional = true;
                param.type = asType(p.children[0].text)
                break;

            case 'user_type': {
                param.type = asType(p.text);
                break;
            }
            case 'simple_identifier':
                if (key !== 'optional') {
                    param[key] = p.text;
                    key = 'internal';
                }
                break;
        }
    });
    return param;
}