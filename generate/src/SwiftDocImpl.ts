import {
  SwiftDoc,
  KindEnum,
  References,
  ReferenceType,
  RelationshipsSection,
} from './types';
import { ClassDeclaration, Project, SourceFile } from 'ts-morph';
import { fragToMethod, has, isClosure } from './create';
import { Generator } from './Generator';

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
        v?.identifier.startsWith(this.identifier + '/') && v?.role === 'symbol'
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
  }
  addStruct(ref: ReferenceType) {}
  addProtocol(ref: ReferenceType) {
    const inherited = this.inherited();
    inherited.forEach(({ url }) =>
      this.generator.registerType(url.replace('`/documentation/swiftui', ''))
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
        name: `${this.title}`,
        docs: [`${ref.identifier}`],
      });
    } else {
      clz = this.source.addClass({
        isExported: true,
        extends:
          inherited[0]?.role === 'symbol' ? inherited[0]?.title : undefined,
        name: `${this.title}`,
        docs: [`${ref.identifier}`],
      });
    }
    this.methods.forEach((v) => this.addPropertyTo(clz, v));
  }
  addType(type: string) {
    if (isClosure(type)) {
      return;
    }
    if (this.generator.ignoreType(type)) {
      return;
    }
    if (
      !this.source.getClass(type) &&
      !this.source.getImportDeclaration(`./${type}`)
    ) {
      this.source.addImportDeclaration({
        moduleSpecifier: `./${type}`,
        namedImports: [type],
      });
    }
    this.generator.registerType(type);
  }
  addPropertyTo(clz: ClassDeclaration, type: ReferenceType): this {
    const {
      returnType = 'this',
      returnTypeParameters = [],
      imports,
      ...method
    } = fragToMethod(type['fragments']);
    if (returnType && !returnTypeParameters.includes(returnType)) {
      this.addType(returnType);
    }

    method.parameters?.forEach(
      (v) =>
        v && !returnTypeParameters.includes(v.type) && this.addType(v?.type)
    );

    imports?.forEach((v) => this.addType(v.text));

    const m = clz.addMethod({
      ...method,
      docs: [type?.abstract?.[0]?.text].filter(Boxrolean) as string[],
      returnType: (writer) => {
        writer.write(returnType);
        if (returnTypeParameters.length) {
          writer.write(
            `<${returnTypeParameters
              .map((v) => (v == 'Self' ? 'this' : v.trim()))
              .join(',')}>`
          );
        }
      },
    });
    m.setBodyText(`return ${returnType === 'this' ? 'this' : null}`);
    return this;
  }
}
