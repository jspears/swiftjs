import {
  SwiftDoc,
  KindEnum,
  References,
  ReferenceType,
  RelationshipsSection,
} from './types';
import { ClassDeclaration, Project, SourceFile } from 'ts-morph';
import { has, isClosure, split } from './create';
import { Generator } from './Generator';
import { ClosureImpl, Params } from './ParamParse';

const ignore = new Set(['', ',', ':']);

export class SwiftDocImpl {
  public title?: string = '';

  private source: SourceFile;

  private project: Project;

  constructor(private doc: SwiftDoc, private generator: Generator) {
    this.title = this.reference(this.doc.identifier?.url || '')?.title || '';
    this.project = generator.project;
    this.source = this.generator.createSourceFile(this.title);
  }
  generate() {
    const ref: ReferenceType = this.reference(this.doc.identifier?.url);
    if (has(ref, 'fragments')) {
      if (
        ref?.fragments?.find(
          (v) => v?.kind === KindEnum.Keyword && v?.text === 'protocol'
        )
      ) {
        this.addProtocol(ref);
      } else if (
        ref?.fragments?.find(
          (v) => v?.kind === KindEnum.Keyword && v?.text === 'class'
        )
      ) {
        this.addProtocol(ref);
      } else if (
        ref?.fragments?.find(
          (v) => v?.kind === KindEnum.Keyword && v?.text === 'struct'
        )
      ) {
        this.addProtocol(ref);
      } else if (ref?.fragments?.find((v) => v?.kind === KindEnum.Keyword)) {
        console.log('dunno', this.title, ref.fragments[0]);
      }
    }
    return this;
  }

  reference(id: string): ReferenceType {
    return this.doc?.references?.[id as keyof References];
  }
  inherited() {
    const int: string[] =
      this.doc.relationshipsSections?.find(
        ({ type, kind }: RelationshipsSection) =>
          type === 'inheritsFrom' && kind == 'relationships'
      )?.identifiers || [];
    return int.map(this.reference, this);
  }
  get identifier() {
    return this.doc.identifier?.url || '';
  }
  get references(): References {
    return this.doc.references || ({} as References);
  }
  get properties() {
    if (!this.identifier) {
      return [];
    }
    return Object.values(this.references).filter((v: ReferenceType) => {
      return (
        v?.identifier.startsWith(this.identifier + '/') && has(v, 'role') && v?.role === 'symbol'
      );
    });
  }
  get methods() {
    return (
      this.properties?.filter(
        ({ fragments = [] }) =>
          fragments?.[0]?.kind === KindEnum.Keyword &&
          fragments?.[0]?.text === 'func'
      ) || []
    );
  }

  addClass(ref: ReferenceType) {
    console.log('add class ', ref);
    this.addProtocol(ref);
  }
  addStruct(ref: ReferenceType) {
    console.log('add struct ', ref);
    this.addProtocol(ref);
  }
  addProtocol(ref: ReferenceType) {
    const inherited = this.inherited();
    inherited.forEach(({ url }) =>
      this.generator.registerType((url as string)?.replace('/documentation/swiftui/', ''))
    );

    let clz: ClassDeclaration;

    if (inherited.length > 1) {
      this.source.addInterface({
        name: this.title as string,
        isExported: true,
        extends: inherited
          .filter(({ title, role }) => title && role === 'symbol')
          .map((v) => v?.title) as string[],
      });
      clz = this.source.addClass({
        isExported: true,
        name: this.title,
        docs: [ref.identifier],

      });
    } else {
      clz = this.source.addClass({
        isExported: true,
        extends:
          inherited[0]?.role === 'symbol' ? inherited[0]?.title : undefined,
        name: this.title,
        docs: [ref.identifier],
      });
    }
    this.methods.forEach((v) => this.addPropertyTo(clz, v));
  }
  addImport(type: string, moduleSpecifier: string = `/${type}`) {
    try {
      const decl = this.source.getImportDeclarations().find(v => v.getModuleSpecifier().getText().includes(moduleSpecifier));
      if (decl != null) {
        const named = decl.getNamedImports().map(v => v.getText());
        if (!named.includes(type)) {
          decl.addNamedImport(type);
        }
        return this;
      }
      this.source.addImportDeclaration({
        moduleSpecifier: `.${moduleSpecifier}`,
        namedImports: [type]
      });
    } catch (e) {
      console.trace(e);
    }
    return this;
  }
  addType = (type: string, templates: string[] = []) => {
    //remove all array stuff.
    type = type.replaceAll(/\[\]/g, '').replace(/(.+?)\..*$/, '$1');
    console.log('checkType', type);
    if (isClosure(type)) {
      return;
    }
    if (templates.includes(type)) {
      return;
    }
    if (this.generator.ignoreType(type)) {
      this.addImport(type, './types');
      return;
    }
    if (
      !this.source.getClass(type)
    ) {
      this.addImport(type);
      this.generator.registerType(type);
    }
  }
  addPropertyTo(clz: ClassDeclaration, type: ReferenceType): this {
    const orig = type['fragments']?.map(v=>v.text).join('');
    const method = ClosureImpl.parseMethod(orig, this.addType);
    const isSelfReturn = method.returnType === 'Self' || method.returnType.startsWith(`${clz.getName()}<`);

    try {
      const m = clz.addMethod({
        ...method,
        parameters: method.parameters,
        returnType: w => w.write(isSelfReturn ? 'this' : method.returnType.replace(/\?$/, ' | unknown')),

        docs: [type?.abstract?.[0]?.text].filter(Boolean) as string[],
      });
      m.setBodyText(isSelfReturn ? `return this` : method.body);
    } catch (e) {
      console.warn('error adding method', e);
      console.warn(`orig '${orig}'`);
    }
    return this;
  }

}

interface NameType {
  type: string;
  name: string;
}

type Closure = { parameters: NameType[], returnType: string };