import { SwiftDoc, KindEnum, ReferenceType } from './types';
import { Project } from 'ts-morph';
import { SwiftDocImpl } from './SwiftDocImpl';
import { createProject,  has } from './create';
import { join } from 'path';
import { isBuiltin } from './util';
import { rmSync } from 'fs';

export class Generator {
  visited = new Map<string, SwiftDocImpl | undefined | Promise<SwiftDocImpl | undefined>>();
  public project: Project;
  constructor(
    private readDoc: (v: string) => Promise<SwiftDoc | undefined>,
    public projectDir: string = `${__dirname}/../out/project`,
    typesSource:string =  `
    export class Bool {
      static True = new Bool(true);
      static False =  new Bool(false);
      private constructor(private value:boolean){
    
      }
      toggle(){
        this.value = !this.value;
      }
      valueOf(){
        return this.value;
      }
    };
    export type Int = number;
    export class Optional<T> {
         static none = new Optional<any>(null);
         static some<T>(v:T){ return new Optional<T>(v)}
         constructor(public value:T){
    
         }
    }
    export type Float = number;
    export type Character = string;
    export type Double = number;
    //unknown is more accurate than typescript void which should be avoided almost all the time.
    export type Void = unknown;
       
   `
  ) {
    rmSync(`${projectDir}/src`, {recursive:true});
    this.project = createProject(projectDir);
    console.log('creating in ', projectDir);
    this.createSourceFile('types',typesSource);
  }

  ignoreType(type: string) {
    if (isBuiltin(type)) {
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
    const doc = this.readDoc(docId).then(v=>v && this.create(v));
    
    this.visited.set(docId, doc);
    return doc;
  }
  createSourceFile(name: string, content: string = '') {
    const source = join(this.projectDir, 'src', name + '.ts');
    const sourceFile = this.project.createSourceFile(source, content, {
      overwrite: true,
    });
    console.log('created source', source);
    return sourceFile;
  }
  getSourceFile(name: string) {
    return this.project.getSourceFile(
      join(this.projectDir, 'src', name + '.ts')
    );
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
