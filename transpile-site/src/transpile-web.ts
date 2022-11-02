import { Transpile, TranspileConfig, ParserConfig} from "@tswift/transpile";
import { ScriptTarget, FileSystemHost, InMemoryFileSystemHost, Project, ts, RuntimeDirEntry } from 'ts-morph';
import swift from '@tswift/transpile/wasm/tree-sitter-swift.wasm?url';
import treesitter from 'web-tree-sitter/tree-sitter.wasm?url';

ParserConfig.swift = swift;
ParserConfig['tree-sitter'] = treesitter;

//@ts-ignore
const util = import.meta.glob('../../util/**/*', {as:'raw'});

// class TSwiftMemoryFileSystem extends InMemoryFileSystemHost {
//    readFile(filePath: string, encoding?: string | undefined): Promise<string> {
//        if (util[filePath]) {
//            return util[filePath]();
//        }
//        return super.readFile(filePath, encoding);
//    }
//     globSync(patterns: readonly string[]): string[] {
//         return [];
//     }
//     // implement it

// }



export const createTranspile = (conf: Partial<TranspileConfig> = {}) => new Transpile({
    ...conf,
    srcDir:'.',
    project: new Project({
        manipulationSettings: {
            insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
            useTrailingCommas: true,

        },
       // fileSystem: new TSwiftMemoryFileSystem,
        skipLoadingLibFiles:false,
        compilerOptions: {
            "allowJs": true,
            "experimentalDecorators": true,
            "skipLibCheck": true,
            "moduleResolution": ts.ModuleResolutionKind.NodeJs,
            "target": ScriptTarget.ES2020,
            
            "paths": {
//                "@tswift/ui": [relTo('@tswift/ui', 'src'), relTo('@tswift/ui')],
                "@tswift/util": [
                   '../../util'
                ],
            }
        },
               useInMemoryFileSystem: true
    })
});

export async function transpile(content: string, filename = 'unknown') {
    const trans = createTranspile();
    const project = trans.config.project;
    const src = (await trans.transpile((filename || './test/test') + '.swift', content))
    const text = src.getText();
    
    const preEmit = project.getPreEmitDiagnostics();
    const emit = (await project.emitToMemory()).getDiagnostics();
    return {
        text,
        preEmit,
        emit,
    }
}

