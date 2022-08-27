import {
  Bindable,
  Bool,
  Constructor,
  Dot,
  Identifiable,
  KeyOf,
  KeyPath,
  Listen,
} from './types';
import { v4 as uuidv4 } from 'uuid';

export function swifty<T, A extends any[] = []>(clazz: {
  new (...args: A): T;
}) {
  return Object.assign(
    (...args: A): T => new clazz(...args),
    clazz.constructor
  );
}
const GSet = globalThis.Set;
export type CountSet<T> = InstanceType<typeof GSet<T>> & {
  count: number;
};
export const Set = <T>(
  ...args: ConstructorParameters<typeof GSet<T>>
): CountSet<T> => {
  const ret = new GSet<T>(...args);

  Object.defineProperty(ret, 'count', {
    get() {
      return ret.size;
    },
  });

  return ret as CountSet<T>;
};

export const UUID = (): Identifiable['id'] => {
  return uuidv4();
};

export function watchable<T>(value: T, ...listen: Listen<T>[]): Bindable<T> {
  const listening = Set<Listen<T>>(listen);
  let currentValue: T = value;

  return Object.assign(
    (newValue?: T) => {
      if (newValue !== undefined && newValue !== currentValue) {
        currentValue = newValue;
        listening.forEach((v) => v(currentValue));
      }
      return currentValue;
    },
    {
      clear: listening.clear.bind(listening),
      valueOf() {
        return currentValue;
      },
      on(listen: Listen<T>) {
        listening.add(listen);
        return () => listening.delete(listen);
      },
    }
  );
}

export function has<T, K>(v: unknown, k: PropertyKey): k is keyof T {
  return Object.prototype.hasOwnProperty.call(v, k);
}

export function toEnum<T>(enm: T, property: T | Dot<keyof T> | keyof T): T {
  if (typeof property === 'string') {
    const p = property[0] === '.' ? property.slice(1) : property;
    if (has(enm, p)) {
      return enm[p];
    }
    throw new Error(`not an enum ${property} in ${enm}`);
  }
  return property as T;
}
export function isString(v: unknown): v is string {
  return typeof v === 'string';
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

export const toggle = (v: Bindable<Bool>) => () => v(!v());

export function isBindable<T>(v: unknown): v is Bindable<T> {
  if (typeof v === 'function') {
    if ('on' in v) {
      if (typeof (v as Bindable<T>).on === 'function') {
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
  return has(val, 'length') ? val.length == 0 : false;
};
export function isFunction(v: unknown): v is (...args: any) => any {
  return typeof v === 'function';
}

/**
 * This should work with '.path' and 'path' the same.
 * @param t
 * @param path
 * @returns
 */
export function keyPath<T, K extends string>(obj: T, path: K): KeyPath<T, K> {
  const key: string = path[0] === '.' ? path.slice(1) : path;
  let ret: any = obj;
  let idx: number;
  let from: number = 0;
  while (
    (idx = key.indexOf('.', from)) > -1 &&
    (ret = obj[key.slice(from, idx) as keyof unknown]) != null
  ) {
    from = idx + 1;
  }
  return ret?.[key.slice(from) as keyof unknown];
}

export function keyBind<T, K extends string>(
  t: T,
  path: K
): Bindable<KeyPath<T, K>> {
  return null as any;
}

export function fromKey<T extends Constructor, C extends KeyOf<T> >(type:T, key:C):C extends undefined ? undefined : InstanceType<T> {

  if (typeof key === 'string'){
    const ret =  type[key.slice(1) as keyof T] as InstanceType<T>;
    if (!ret){
      console.warn(`Did not find an instance for '${key}' on '${type?.name}'`)
    }
    return ret
  }
  return key as InstanceType<T>;
}

export function fromEnum<T, C extends Dot<T> = Dot<T>>(e:T, key:C):T{
  if (typeof key === 'string'){
    const akey = key.slice(1);
    if (has(e, akey)){
      return e[akey];
    }
  }
  return e;
}