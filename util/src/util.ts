import {
  Bindable,
  Constructor,
  Dot,
  Identifiable,
  KeyOf,
  KeyPath,
  KeyValue,
  Listen,
} from "./types";
import { v4 as uuidv4 } from "uuid";

export function swifty<
  A extends Constructor,
  Arg extends any[] = ConstructorParameters<A>
>(clazz: A): (...args: Arg) => InstanceType<A> & Pick<A, Exclude<keyof A, 'prototype'>> {
  return Object.assign((...args: Arg) => new clazz(...args), clazz.constructor);
}

export const OrigSet = globalThis.Set;

export const Set = <T>(...args: ConstructorParameters<typeof OrigSet<T>>) =>
  new CountSet(...args);

export class CountSet<T> extends OrigSet<T> {
  get count() {
    return this.size;
  }
}
export const UUID = (): Identifiable["id"] => {
  return uuidv4();
};

export function watchable<T>(value: T, ...listen: Listen<T>[]): Bindable<T> {
  const listening = Set<Listen<T>>(listen);
  let currentValue: T = value;

  return Object.assign(
    (...args: any[]) => {
      if (args.length > 0) {
        currentValue = args[0];
        listening.forEach((v) => v(currentValue));
      }
      return currentValue;
    },
    {
      clear: listening.clear.bind(listening),
      valueOf() {
        return currentValue;
      },
      sink(listen: Listen<T>) {
        listening.add(listen);
        return () => listening.delete(listen);
      },
    }
  );
}

export function has<T, K>(v: unknown, k: PropertyKey): k is keyof T {

  return v != null && k != null && Object.prototype.hasOwnProperty.call(v, k);
}

export function toEnum<T>(enm: T, property: T | Dot<keyof T> | keyof T): T {
  if (typeof property === "string") {
    const p = property[0] === "." ? property.slice(1) : property;
    if (has(enm, p)) {
      return enm[p];
    }
    throw new Error(`not an enum ${property} in ${enm}`);
  }
  return property as T;
}
export function isString(v: unknown): v is string {
  return typeof v === "string";
}

export function toValue<T extends Constructor, K extends KeyOf<T> = KeyOf<T>>(
  clazz: T
): (
  property: K
) => K extends `.${infer R extends keyof T & string}`
  ? T[R]
  : K extends T
  ? K
  : never;

//export function toValue<T extends Constructor, K extends KeyOf<T> = KeyOf<T>>(clazz:T, property:K)=>K extends `.${infer R extends keyof T & string}` ? K extends T ? K : never;

export function toValue<T extends Constructor>(clazz: T, property?: KeyOf<T>) {
  const fn = function (prop: KeyOf<T>) {
    if (isString(prop)) {
      return clazz[prop.slice(1) as keyof T];
    }
    return prop;
  };
  if (property == null) {
    return fn;
  }
  return fn(property);
}

export function applyMixins<T extends Constructor>(
  derivedCtor: T,
  ...constructors: Constructor[]
): T {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      );
    });
  });
  return derivedCtor;
}

export function isBindable<T>(v: unknown): v is Bindable<T> {
  if (typeof v === "function") {
    if ("sink" in v) {
      if (typeof (v as Bindable<T>).sink === "function") {
        return true;
      }
    }
  }
  return false;
}

type HasLength = { length: number };
export const isEmpty = (v?: HasLength | Bindable<HasLength>): boolean => {
  if (v == null) {
    return true;
  }
  const val = isBindable<{ length: number }>(v) ? v() : v;
  return has(val, "length") ? val.length == 0 : false;
};
export function isFunction(v: unknown): v is (...args: any) => any {
  return typeof v === "function";
}

/**
 * This should work with '.path' and 'path' the same.
 * @param t
 * @param path
 * @returns
 */
export function keyPath<T extends object, K extends KeyPath<T> & string>(
  obj: T,
  path: K
): T extends undefined | null
  ? undefined
  : K extends undefined | null | ""
  ? T
  : KeyValue<T, K> {
  if (obj == null) {
    return undefined as any;
  }
  if (!path) {
    return obj as any;
  }
  const key: string = path[0] === "." ? path.slice(1) : path;
  let ret: any = obj;
  let idx: number;
  let from: number = 0;
  while (
    (idx = key.indexOf(".", from)) > -1 &&
    (ret = obj[key.slice(from, idx) as keyof unknown]) != null
  ) {
    from = idx + 1;
  }
  return ret?.[key.slice(from) as keyof unknown];
}

export function fromKey<
  T,
  K extends
    | Dot<keyof T>
    | (T extends Constructor ? InstanceType<T> : never) = Dot<keyof T>
>(
  type: T,
  key: K
): K extends `.${infer P extends keyof T & string}`
  ? T[P]
  : K extends string
  ? undefined
  : K {
  if (typeof key == "string") {
    const ret = (type as any)[key.slice(1)];
    if (ret == null) {
      console.warn(`Did not find an instance for '${key}' on '${type}'`);
      return undefined as any;
    }

    return ret;
  }
  return key as any;
}
