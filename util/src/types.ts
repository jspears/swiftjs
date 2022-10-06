import { Hasher } from "./Hasher";

export type Dot<T> = T extends 'prototype' ? never : T extends string ? `.${T}` : never;
//This is to support `.property` notation from swift.

export type EnumOrString<T> = T | Dot<keyof T>;
export type Listen<T> = (e: T) => unknown;
export type Bindable<T> = ((t?: T) => T) & {
  value: T;
  sink(listen: Listen<T>): () => void;
  clear(): void;
};
export type Num = number | ".infinity";

export interface Size {
  width: Num;
  height: Num;
}

// Tuplify code from:
//https://stackoverflow.com/questions/55127004/how-to-transform-union-type-to-tuple-type

// oh boy don't do this
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never;

// TS4.1+
type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N
  ? []
  : [...TuplifyUnion<Exclude<T, L>>, L];

/**
 * Sometimes you want to be able to take named parameters,
 * and or
 *
 * Should put optional parameters last.
 */
export type NamedParameters<T> = TuplifyUnion<T[keyof T]> | [T];

type Defined<T> = T extends undefined ? never : T;

export type Bound<T> = T & {
  readonly [K in keyof T as K extends string ? `$${K}` : never]-?: Defined<Bindable<T[K]>>;
};

export type Int = number;

export interface Bounds {
  height: Num;
  width: Num;
  maxWidth: Num;
  maxHeight: Num;
}

export type PickValue<T, V = T> = {
  [K in keyof T as T[K] extends V ? (K extends "prototype" ? never : K) : never]: T[K];
};

export type KeyOfTypeWithType<T extends Constructor> = KeyOf<T>;

export type AbstractConstructor = abstract new (...args: any) => any;
export type Constructor = new (...args: any) => any;
export type AnyConstructor = AbstractConstructor | Constructor;


export type KeyOf<T extends AnyConstructor> =
  | Dot<KeysOfTypeBest<T, InstanceType<T>>>
  | InstanceType<T>;

export interface Identifiable {
  id: string;
}

export type ID = Identifiable["id"];
export type HashI = {
  combine(v:undefined|number|boolean|bigint|string|Hashable):HashI;
}
export interface Hashable {
  hash(hasher:HashI):HashI;
}

type D = "." | "";
export type KeyValue<T, S> = S extends `${D}${infer P extends keyof T & string}.${infer Rest}`
  ? KeyValue<T[P], Rest>
  : S extends keyof T
  ? T[S]
  : never;

export type KeyPath<T extends object, Key extends keyof T & string = keyof T & string> = Key extends string
  ? T[Key] extends object
    ? `.${Key}` | `.${Key}${KeyPath<T[Key]>}`
    : `.${Key}`
  : never;

export class Optional<T> {
  static none = new Optional<any>(null);
  static some<T>(v: T) {
    return new Optional<T>(v);
  }
  constructor(public value: T) {}
}
export type Float = number;
export type Character = string;
export type Double = number;
//unknown is more accurate than typescript void which should be avoided almost all the time.
export type Void = unknown | void;

export interface Subscriber<T> {}
export interface Publisher<T> {
  send(t: T): void;
  recieve(s: Subscriber<T>): Void;
  subscribe(s: Subscriber<T>): {
    cancel(): void;
  };
}
export function map<T, R>(value: (T | undefined) | (T | undefined)[], transform: (t: T) => R): R[] {
  if (Array.isArray(value)) {
    return value.map((v) => (v == null ? null : transform(v))).filter(Boolean) as R[];
  }
  if (value != null) {
    return [transform(value)];
  }
  return [];
}

export type ReverseMap<T extends Record<keyof T, keyof any>> = {
  [P in T[keyof T]]: {
    [K in keyof T]: T[K] extends P ? K : never;
  }[keyof T];
};
//https://github.com/microsoft/TypeScript/issues/37079

type ConstructorOverloads<T> = T extends {
  new (...args: infer A1): infer R1;
  new (...args: infer A2): infer R2;
  new (...args: infer A3): infer R3;
  new (...args: infer A4): infer R4;
}
  ? readonly [new (...args: A1) => R1, new (...args: A2) => R2, new (...args: A3) => R3, new (...args: A4) => R4]
  : T extends {
      new (...args: infer A1): infer R1;
      new (...args: infer A2): infer R2;
      new (...args: infer A3): infer R3;
    }
  ? readonly [new (...args: A1) => R1, new (...args: A2) => R2, new (...args: A3) => R3]
  : T extends {
      new (...args: infer A1): infer R1;
      new (...args: infer A2): infer R2;
    }
  ? readonly [new (...args: A1) => R1, new (...args: A2) => R2]
  : T extends {
      new (...args: infer A1): infer R1;
    }
  ? readonly [new (...args: A1) => R1]
  : never;

export type OverloadedConstructorParameters<T> = ConstructorOverloads<T> extends infer O
  ? {
      [K in keyof O]: ConstructorParameters<Extract<O[K], new (...args: any) => any>>;
    }
  : never;

export type OverloadedInstanceType<T> = ConstructorOverloads<T> extends infer O
  ? { [K in keyof O]: InstanceType<Extract<O[K], new (...args: any) => any>> }
  : never;
/**
 * Tries to find the type and return the value of
 * a static property. It does not do this deeply, although
 * maybe in the future.
 *
 * @param type
 * @param key
 * @returns
 */

 type KeysOfType<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never;
}[keyof T];

type PickByType<T, U> = Pick<T, KeysOfType<T, U>>;

type KeysOfTypeStrict<T, U> = {
    [P in keyof T]: T[P] extends U ? (U extends T[P] ? P : never) : never;
}[keyof T];
type PickByTypeStrict<T, U> = Pick<T, KeysOfTypeStrict<T, U>>;

/**
 * https://stackoverflow.com/questions/46583883/typescript-pick-properties-with-a-defined-type
 * Returns an interface stripped of all keys that don't resolve to U, defaulting 
 * to a non-strict comparison of T[key] extends U. Setting B to true performs
 * a strict type comparison of T[key] extends U & U extends T[key]
 */
export type KeysOfTypeBest<T, U, B = false> = {
  [P in keyof T]: B extends true 
    ? T[P] extends U 
      ? (U extends T[P] 
        ? P 
        : never)
      : never
    : T[P] extends U 
      ? P 
      : never;
}[keyof T];
//type PickByTypeBest<T, U, B = false> = Pick<T, KeysOfTypeBest<T, U, B>>;

export interface Range {
  from:number;
  to:number;
}

export interface Predicate<S> {
  (v: S):boolean;
}

export type Compare<T> = (a: T, b: T) => boolean;


//Swift supports value object like things.
// like struct enum, that are copied on reference or pass.
// this is how we are gonna implement them.
export const cloneable = Symbol('cloneable');

declare global {
    interface Object {
        [cloneable]?:()=> this;
    }
}
