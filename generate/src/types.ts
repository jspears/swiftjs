export interface SwiftDoc {
  schemaVersion: SchemaVersion;
  abstract: AvailabilityPrefixElement[];
  hierarchy: Hierarchy;
  variants: SwiftDocVariant[];
  topicSections: Section[];
  kind: RoleEnum;
  seeAlsoSections: Section[];
  sections: any[];
  identifier: Identifier;
  relationshipsSections: RelationshipsSection[];
  primaryContentSections: PrimaryContentSection[];
  metadata: Metadata;
  references: References;
  diffAvailability: DiffAvailability;
  legalNotices: LegalNotices;
}

export interface AvailabilityPrefixElement {
  text: string;
  type: KindEnum;
}

export enum KindEnum {
  ExternalParam = 'externalParam',
  GenericParameter = 'genericParameter',
  Identifier = 'identifier',
  Keyword = 'keyword',
  Text = 'text',
  TypeIdentifier = 'typeIdentifier',
  Symbol = 'symbol',
  Technologies = 'technologies',
}

export interface DiffAvailability {
  minor: Beta;
  beta?: Beta;
  major: Beta;
}

export interface Beta {
  change: Change;
  platform: PlatformEnum;
  versions: Version[];
}

export enum Change {
  Modified = 'modified',
}

export enum PlatformEnum {
  Xcode = 'Xcode',
}

export enum Version {
  The130 = '13.0',
  The134 = '13.4',
  The140Beta4 = '14.0 beta 4',
  The140Beta5 = '14.0 beta 5',
}

export interface Hierarchy {
  paths: Array<string[]>;
}

export interface Identifier {
  interfaceLanguage: string;
  url: string;
}

export enum RoleEnum {
  Article = 'article',
  CollectionGroup = 'collectionGroup',
  Symbol = 'symbol',
}

export interface LegalNotices {
  copyright: string;
  termsOfUse: string;
  privacyPolicy: string;
}

export interface Metadata {
  fragments: NavigatorTitleElement[];
  role: RoleEnum;
  modules: Module[];
  roleHeading: string;
  platforms: PlatformElement[];
  navigatorTitle: NavigatorTitleElement[];
  externalID: string;
  title: string;
  symbolKind: string;
}

export interface NavigatorTitleElement {
  text: string;
  kind: KindEnum;
}

export interface Module {
  name: string;
}

export interface PlatformElement {
  beta: boolean;
  name: string;
  deprecated: boolean;
  unavailable: boolean;
  introducedAt: string;
}

export interface PrimaryContentSection {
  kind: string;
  declarations?: Declaration[];
  content?: Content[];
}

export interface Content {
  text?: string;
  anchor?: Role;
  level?: number;
  type: ContentType;
  inlineContent?: InlineContentElement[];
  syntax?: string;
  code?: string[];
}

export enum Role {
  Overview = 'overview',
  Symbol = 'symbol',
}

export interface InlineContentElement {
  text?: string;
  type: TypeEnum;
  code?: string;
  identifier?: string;
  isActive?: boolean;
}

export enum ContentType {
  CodeListing = 'codeListing',
  Heading = 'heading',
  Paragraph = 'paragraph',
}

export interface Declaration {
  platforms: string[];
  tokens: Token[];
  languages: string[];
}

export interface Token {
  kind: KindEnum;
  text: string;
  preciseIdentifier?: string;
  identifier?: string;
}

export type ReferenceType = {
  url?: string;
  role?: RoleEnum;
  title?: string;
  fragments?: Fragment[];
  abstract?: InlineContentElement[];
} & (
  | DocCOMAppleSwiftUIDocumentationSwiftUIAccessibilityRotorContentClass
  | DocCOM
  | DocCOMApple
  | DocCOMAppleSwiftUIDocumentationSwiftUI
  | SwiftUIForEachFontsPNG
);

export interface References extends Record<string, ReferenceType> {}
export enum TypeEnum {
  Topic = 'topic',
  CodeVoice = 'codeVoice',
  Image = 'image',
  Reference = 'reference',
  Text = 'text',
}

export interface DocCOMApple {
  identifier: string;
  kind: RoleEnum;
  url: string;
  type: TypeEnum;
  navigatorTitle?: NavigatorTitleElement[];
  abstract: InlineContentElement[];
  title: string;
  beta?: boolean;
  role: RoleEnum;
  fragments?: Fragment[];
  conformance?: Conformance;
  deprecated?: boolean;
  required?: boolean;
  defaultImplementations?: number;
}

export interface Conformance {
  constraints: ConstraintElement[];
  availabilityPrefix: AvailabilityPrefixElement[];
  conformancePrefix: AvailabilityPrefixElement[];
}

export interface ConstraintElement {
  type: TypeEnum;
  code?: string;
  text?: string;
}

export interface Fragment {
  text: string;
  kind: KindEnum;
  preciseIdentifier?: string;
}

export interface DocCOM {
  conformance?: Conformance;
  title: string;
  fragments?: Fragment[];
  role: Role;
  type: TypeEnum;
  identifier: string;
  url: string;
  kind: TypeEnum;
  abstract: ConstraintElement[];
  beta?: boolean;
}

export interface DocCOMAppleSwiftUIDocumentationSwiftUI {
  identifier: string;
  abstract: AvailabilityPrefixElement[];
  kind: RoleEnum;
  url: string;
  type: TypeEnum;
  role: string;
  title: string;
  fragments?: NavigatorTitleElement[];
  navigatorTitle?: NavigatorTitleElement[];
}

export interface DocCOMAppleSwiftUIDocumentationSwiftUIAccessibilityRotorContentClass {
  abstract: AvailabilityPrefixElement[];
  url: string;
  type: TypeEnum;
  identifier: string;
  title: string;
  role: RoleEnum;
  fragments?: Fragment[];
  navigatorTitle?: NavigatorTitleElement[];
  kind: RoleEnum;
  conformance?: Conformance;
  beta?: boolean;
  required?: boolean;
  deprecated?: boolean;
}

export interface DocCOMAppleSwiftUIDocumentationSwiftUISwiftStruct {
  identifier: string;
  role: RoleEnum;
  fragments: NavigatorTitleElement[];
  kind: RoleEnum;
  abstract: ConstraintElement[];
  navigatorTitle: NavigatorTitleElement[];
  type: TypeEnum;
  title: string;
  url: string;
  beta?: boolean;
}

export interface SwiftUIForEachFontsPNG {
  identifier: string;
  type: TypeEnum;
  variants: SwiftUIForEachFontsPNGVariant[];
  alt: string;
}

export interface SwiftUIForEachFontsPNGVariant {
  url: string;
  traits: string[];
}

export interface RelationshipsSection {
  kind: string;
  title: string;
  type: string;
  identifiers: string[];
}

export interface SchemaVersion {
  major: number;
  minor: number;
  patch: number;
}

export interface Section {
  title: string;
  generated?: boolean;
  identifiers: string[];
}

export interface SwiftDocVariant {
  paths: string[];
  traits: Trait[];
}

export interface Trait {
  interfaceLanguage: string;
}
