import { ClassDeclaration, CodeBlockWriter, OptionalKind, ParameterDeclarationStructure, ParameteredNodeStructure, Scope, SourceFile, Writers } from "ts-morph";
import { Param } from '@tswift/util';
import { SyntaxNode } from "web-tree-sitter";

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
export function writeDestructure(params: Param[]) {
    let current: string[] = [];
    for (const entry of params) {
        current.push((entry.internal && entry.name != entry.internal) ? `${entry.name}:${entry.internal}` : entry.name);
    }

    return `{${current.join(',')}}`
}

export function writeType(params: Param[]) {
    return (write: CodeBlockWriter) => write.write(`{${params.map(({ name, optional, type }) => `${name}${optional ? '?' : ''}:${type}`).join(';')}}`);
}
export function unkind<T extends { kind?: any }>({ kind, ...rest }: T): Omit<T, 'kind'> {
    return rest
}

type ParamDecl = OptionalKind<ParameterDeclarationStructure>;

function asParamDecl(p: Param[]): ParamDecl {
    return {
        name: writeDestructure(p),
        type: writeType(p),
    }
}

export function toParams(params: Param[]): ParamDecl[] {
    const ret: ParamDecl[] = [];
    let combine: Param[] = []
    for (const p of params) {
        if (p.name === '_') {
            if (combine.length) {
                ret.push(asParamDecl(combine))
                combine = [];
            }
            ret.push({
                name: p.internal || p.name,
                type: p.type,
                hasQuestionToken: p.optional || false,
            })
        } else {
            combine.push(p);
        }
    }
    if (combine.length) {
        ret.push(asParamDecl(combine));
    }
    return ret;

}
export function toScope(text: string): Scope | undefined {
    switch (text) {
        case 'public': return Scope.Public;
        case 'private': return Scope.Private;
        case 'protected': return Scope.Protected;
        case 'open':
        case 'mutating':
            return;
    }
    console.log('unknown scope', text);
}


export type Context = ClassDeclaration | SourceFile;

export interface ToType {
    (name: string): string;
}

export function mapSpecialLiteral(n: SyntaxNode) {
    switch (n.type) {
        case '#file': return '__filename';
        case '#filePath':
        case '#fileId':
            return '__dirname + \'/\' + __filename'
        case '#column':
        case '#line':
            return '0';
        case '#dsohandle':
        case '#function':
            return 'null';
    }
}

export function lambdaReturn(statements: string[]): string {
    if (statements.length == 1) {
        return statements[0].replace(/^\s*return\s+?/, '')
    }
    if (statements.length > 1 || statements.find(v => /(?:^|\s)return($|\s)/.test(v))) {
        return `{${statements.join('\n')}}`;
    }
    return statements[0];
}
export function toParamStr(params: Param[]): string {
    return params?.map(p => `${p.name}${p.optional ? '?' : ''}${p.type ? `:${p.type}` : ''}`).join('; ')
}
export function toDestructure(params: Param[]): string {
    return params.map(p => (p.internal && p.internal != p.name ? `${p.name}:${p.internal}` : p.name) + (p.initializer ? `= ${p.initializer}` : '')).join(',')

}
export function toDestructureBody(params: Param[]) {
    return params.length ? `{${toDestructure(params)}}` : '';
}
export function toParamBody(params: Param[]): string {
    return params.length ? `{${toParamStr(params)}}` : ''
}