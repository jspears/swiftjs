import { ClassDeclaration, Project, PropertyDeclaration, SourceFile } from "ts-morph";
import Parser from "web-tree-sitter";
import {readFile} from 'fs/promises'
export type ComputedPropDecl = [Node, PropertyDeclaration];
export type CParam = Partial<{
    name: string;
    internal: string;
    type: string;
    optional?: boolean;
}>;

export type Context = SourceFile | ClassDeclaration;
export type Node = Parser.SyntaxNode;

export interface TranspileConfig {
    project: Project
    srcDir: string;
    readFile: typeof readFile,
    basedir(path: string): string,
    overwrite: boolean,
    importMap: Record<string, string>,
    builtInTypeMap: Record<string, string>,
}
export const cloneable = Symbol('cloneable');

declare global {
    interface Object {
        [cloneable]?:()=> this;
    }
}

