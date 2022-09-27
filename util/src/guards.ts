import { KeyOf } from "./types";

export function has<T>(v: T, k: PropertyKey): k is keyof T {
  return v != null && k != null && Object.prototype.hasOwnProperty.call(v, k);
}

export function isObjectWithProp<K extends PropertyKey, T extends {[k in K]:unknown}>(v:unknown, k:K): v is T {
  return isObject(v) ? k in v : false;
}


export type Guard<V> = (v:unknown)=> v is V;

export function isObjectWithPropType<
 K extends PropertyKey,
 V>( isGuard:Guard<V>,  key:K, v:unknown,):v is {[k in K]:V} {
 
  return isObjectWithProp(v,key) && isGuard(v[key]);
 } 
export function isIterable(v:unknown): v is Iterable<unknown>
{
 return isObjectWithPropType(isFunction, Symbol.iterator, v);
}
export function isFunction(v: unknown): v is (...args: any[]) => any {
  return typeof v === "function";
}

type Constructor<T> = new (...args: any[]) => T;
type AbstractConstructor<T> = abstract new (...args: any[]) => T;
type AnyConstructor<T> = Constructor<T> | AbstractConstructor<T>;
export function isObject(v:unknown):v is object {
    if (v == null){
      return false;
    }
    return typeof v === 'object' || isFunction(v) 
}

export function isInstanceOf<T>(v: unknown, of: AnyConstructor<T>): v is T {
  if (isConstructable(v)) {
    return v instanceof of;
  }
  return false;
}
export function isKeyOf<T extends AnyConstructor<any>>(key: unknown, of: T): key is KeyOf<T> {
  if (key == null) {
    return false;
  }
  if (typeof key === "string") {
    return has(of, key.slice(1));
  }
  return isInstanceOf(key, of);
}
export function isEnumOf<T extends object>(key:unknown, ofType:T): key is T[keyof T] {
  if (key == null){
    return false;
  }
  if (typeof key === 'string'){
    return has(ofType, key) || has (ofType, key.slice(1));
  }
  return Object.values(ofType).includes(key);
}

export function isConstructable(v: unknown): v is Constructor<unknown> {
  if (v == null) {
    return false;
  }
  if (typeof v === "object" && isFunction(v.constructor)) {
    return true;
  }
  if (isFunction(v)) {
    return true;
  }
  return false;
}
