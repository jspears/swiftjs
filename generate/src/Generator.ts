import { SwiftDoc, KindEnum, ReferenceType } from "./types";
import { Project } from "ts-morph";
import { SwiftDocImpl } from "./SwiftDocImpl";
import { createProject, BUILT_IN, has } from "./create";
import {join} from 'path';

export class Generator {
    visited = new Map<string, SwiftDocImpl | Promise<SwiftDocImpl>>();
    public project:Project
    constructor(private readDoc: (v: string) => Promise<SwiftDoc>, public projectDir:string = `${__dirname}/../out/project`) {
        this.project = createProject(projectDir);
        console.log('creating in ', projectDir);
    }

    ignoreType(type: string) {
        if (BUILT_IN.has(type)) {
            return this;
        }
        if (/^CG/.test(type)) {
            return this;
        }
    }
    registerType(clz: string): this {
        if (this.ignoreType(clz)) {
            return this;
        }
        console.log('registerType ', clz);
        if (!this.getSourceFile(clz)) {
            this.visit(clz);
        }

        return this;
    }

    async save() {
        await Promise.all(this.visited.values());
        await this.project.save();
    }

    async visit(docId: string) {
        if (this.visited.has(docId)) {
            return this.visited.get(docId);
        }
        const doc = this.readDoc(docId).then(this.create);
        this.visited.set(docId, doc);
        return doc;
    }
    createSourceFile(name:string, content:string = ''){
        const source = join(this.projectDir, 'src', name+'.ts');
        const sourceFile = this.project.createSourceFile(source, content, {overwrite:true});
        console.log('created source', source)
        return sourceFile;
    }
    getSourceFile(name:string){
        return this.project.getSourceFile(join(this.projectDir, 'src', name+'.ts'))        
    }
    create = async (doc: SwiftDoc) => {
        if (!doc) {
            throw new Error(`Doc is required`);
        }
        if (!doc.identifier?.url) {
            throw new Error('no identifier for doc ' + doc);
        }
        if (doc.identifier?.interfaceLanguage != 'swift') {
            throw new Error(`not an interface language we understand`);
        }
        return new SwiftDocImpl(doc, this).generate();
       
    };

}
