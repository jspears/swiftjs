import { ClassDeclaration, SourceFile } from "ts-morph";
export function isClassDecl(v:unknown): v is ClassDeclaration {
    return v != null && v instanceof ClassDeclaration;
}
export function isSourceFile(v:unknown): v is SourceFile {
    return v != null && v instanceof SourceFile;
}