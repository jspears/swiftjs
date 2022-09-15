import { SwiftDoc, KindEnum, ReferenceType } from "./types";
import { Project, ScriptTarget } from "ts-morph";
import { SwiftDocImpl } from "./SwiftDocImpl";
import { createProject, has } from "./create";
import { join } from "path";
import { isBuiltin } from "./util";
import { existsSync, mkdirSync, rmdir, rmdirSync, rmSync } from "fs";
const refreshDir = (dir: string) => {
  if (dir && dir.length < 5) {
    return;
  }
  if (existsSync(dir)) {
    rmdirSync(dir, { recursive: true });
  }
  mkdirSync(dir, { recursive: true });
};
export class Generator {
  visited = new Map<string, SwiftDocImpl | undefined | Promise<SwiftDocImpl | undefined>>();
  public project: Project;
  constructor(
    private readDoc: (v: string) => Promise<SwiftDoc | undefined>,
    public projectDir: string = `${__dirname}/../out/project`,
    private srcDir: string = `${projectDir}/src`,
    typesSource: string = `
export {Bool, Int, Float, Character, Double, Void, Optional} from '@tswift/util';    
   `,
  ) {
    refreshDir(srcDir);
    this.project = createProject(projectDir, {
      compilerOptions: {
        rootDir: "src",
        outDir: "lib",
        lib: ["DOM", "ES2021"],
        target: ScriptTarget.ES2021,
        noEmit: true,
      },
    });
    console.log("creating in ", projectDir);
    this.createSourceFile("types", typesSource);
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
    console.log("registerType ", clz);
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
    const doc = this.readDoc(docId).then((v) => v && this.create(v));

    this.visited.set(docId, doc);
    return doc;
  }
  createSourceFile(name: string, content: string = "") {
    const source = join(this.srcDir, name + ".ts");
    const sourceFile = this.project.createSourceFile(source, content, {
      overwrite: true,
    });
    console.log("created source", source);
    return sourceFile;
  }
  getSourceFile(name: string) {
    return this.project.getSourceFile(join(this.srcDir, name + ".ts"));
  }
  create = async (doc: SwiftDoc) => {
    if (!doc) {
      throw new Error(`Doc is required`);
    }
    if (!doc.identifier?.url) {
      throw new Error("no identifier for doc " + doc);
    }
    if (doc.identifier?.interfaceLanguage != "swift") {
      throw new Error(`not an interface language we understand`);
    }
    return new SwiftDocImpl(doc, this).generate();
  };
}
