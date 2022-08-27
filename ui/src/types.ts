type CSS = Omit<
  CSSStyleDeclaration,
  | 'item'
  | 'setProperty'
  | 'removeProperty'
  | 'getPropertyValue'
  | 'getPropertyPriority'
  | 'parentRule'
  | number
  | 'length'
  | keyof { [Symbol.iterator](): unknown }
>;

export type CSSProperties = Partial<CSS>;
