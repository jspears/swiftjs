import { Scope, StructureKind, FunctionDeclaration, MethodDeclaration, Node as TSNode, PropertyDeclaration, VariableStatement, VariableDeclarationKind, FunctionDeclarationStructure, OptionalKind, TypeParameterDeclarationStructure, ParameterDeclarationStructure, DecoratableNodeStructure } from "ts-morph";
export type TypeParameter = OptionalKind<TypeParameterDeclarationStructure>;
export type Param = Omit<ParameterDeclarationStructure, 'kind' | 'type'> & { type: string; optional?: boolean; internal?: string; };
//Type 'OptionalKind<FunctionDeclarationOverloadStructure>[] | undefined' is not assignable to type 'OptionalKind<MethodDeclarationOverloadStructure>[] | undefined'.
export type Func = Omit<FunctionDeclarationStructure, 'kind' | 'returnType' | 'statements' | 'overloads' | 'leadingTrivia' | 'trailingTrivia' | 'parameters'> & {
    name: string;
    isAbstract?: boolean;
    scope?: Scope;
    parameters?: Param[];
    overloads?: Func[];
    returnType?: string;
    statements?: string[];
} & DecoratableNodeStructure
//     kind?: StructureKind.Method;
//     scope?: Scope;
//     isAsync?: boolean;
//     name: string;
//     parameters: Param[];
//     statements: string[];
//     returnType?: string;
//     isAbstract?: boolean;
//     typeParameters?: TypeParameter[];
// };