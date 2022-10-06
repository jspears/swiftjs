import { Transpile, } from "../src/transpile";
import { TranspileConfig } from '../src/types';
import { ScriptTarget, Project, ts } from 'ts-morph';
import { matchSnapshot } from 'tap';
import { join } from 'path';
export const relTo = (name: string, ...paths: string[]) => join(require.resolve(`${name}/package.json`), '..', ...paths);
export const tt = (strs: TemplateStringsArray) => () => runTranspile(strs[0] || '', { throwOnError: true });

const createTranspile = (conf: Partial<TranspileConfig> = {}) => new Transpile({
    ...conf,
    project: new Project({
        manipulationSettings: {
            insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
         useTrailingCommas:true, 
       },
        compilerOptions: {
            "allowJs": true,
            "experimentalDecorators": true,
            "skipLibCheck": true,
            "moduleResolution": ts.ModuleResolutionKind.NodeJs,
            "target": ScriptTarget.ES2020,
            "paths": {
                "@tswift/ui": [relTo('@tswift/ui', 'src'), relTo('@tswift/ui')],
                "@tswift/util": [
                    relTo('@tswift/util', 'src')
                ],
            }
        },
//        useInMemoryFileSystem: true
    })
})

export const testTranspile = (str: string) => () => runTranspile(str);

export const runTranspile = async (content: string, conf: Partial<TranspileConfig & { throwOnError?: boolean }> = {}) => {
    let resp;
    try {
        const { throwOnError, ...tconf } = conf;
        const transpiler = createTranspile(tconf);
        const project = transpiler.config.project;

        resp = (await transpiler.transpile((currentTitle || './test/test')+'.swift', content)).getText();
        const diagnostics = project.getPreEmitDiagnostics();
        if (throwOnError && diagnostics?.length) {
            throw project.formatDiagnosticsWithColorAndContext(diagnostics);
        } else {
            console.log(project.formatDiagnosticsWithColorAndContext(diagnostics));
        }
        const emitDiagnostics = (await project.emitToMemory()).getDiagnostics();
        if (throwOnError && emitDiagnostics.length) {
            throw project.formatDiagnosticsWithColorAndContext(emitDiagnostics);
        } else {
            console.log(project.formatDiagnosticsWithColorAndContext(emitDiagnostics));
        }

    } catch (e) {
        console.log(e);
    }
    if (/mocha/.test(process.argv[1])) {
        console.log(resp);
    } else {
        matchSnapshot(resp);
    }
    return 'done';
}
let currentTitle:string|undefined = '';
beforeEach(function () {
    currentTitle = this?.currentTest?.title;
 })