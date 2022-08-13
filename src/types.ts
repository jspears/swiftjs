type FilterConditionally<Source, Condition> = Pick<Source, {[K in keyof Source]: Source[K] extends Condition ? K : never}[keyof Source]>;

export type Dot<T> = T extends string ? `.${T}` : never;
//This is to support `.property` notation from swift.   
export type KeyOfTypeWithType<F,T = F> = T | Dot<Exclude<keyof FilterConditionally<F, T>, 'prototype'>>;


export type EnumOrString<T> = T | Dot<keyof T>;