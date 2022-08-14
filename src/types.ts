type FilterConditionally<Source, Condition> = Pick<Source, {[K in keyof Source]: Source[K] extends Condition ? K : never}[keyof Source]>;

export type Dot<T> = T extends string ? `.${T}` : never;
//This is to support `.property` notation from swift.   
export type KeyOfTypeWithType<F,T = F> = T | Dot<Exclude<keyof FilterConditionally<F, T>, 'prototype'>>;


export type EnumOrString<T> = T | Dot<keyof T>;

export type Listen<T> = (e:T)=>unknown;
export type Bindable<T> = ((t?:T)=>T) & { 
    on(listen:Listen<T>):()=>void;
    clear():void;
}
export type Num = number | '.infinity';

export type Size = {width:Num, height:Num};

export type KeyOf<T> = Dot<Exclude<keyof T, 'prototype'>>;


// Tuplify code from:
//https://stackoverflow.com/questions/55127004/how-to-transform-union-type-to-tuple-type

// oh boy don't do this
type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type LastOf<T> =
  UnionToIntersection<T extends any ? () => T : never> extends () => (infer R) ? R : never

// TS4.1+
type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> =
  true extends N ? [] : [...TuplifyUnion<Exclude<T, L>>, L]


/**
 * Sometimes you want to be able to take named parameters,
 * and or 
 * 
 * Should put optional parameters last.
 */
export type NamedParameters<T> = TuplifyUnion<T[keyof T]>  | [T] ;

type Defined<T> = T extends undefined ? never : T;


export type Bound<T> = T & {
  [K in keyof T as K extends string ? `$${K}` : never]-?:Defined<Bindable<T[K]>>;
}

export type Int = number;

export interface Bounds {
  height:Num;
  width:Num;
  maxWidth:Num;
  maxHeight:Num;
}
export type Bool = boolean;