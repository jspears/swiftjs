import { KeyOf } from "./types";

export function has<T, K>(v: unknown, k: PropertyKey): k is keyof T {
  return v != null && k != null && Object.prototype.hasOwnProperty.call(v, k);
}

export function isFunction(v: unknown): v is (...args: any[]) => any {
  return typeof v === "function";
}

type Constructor<T> = new (...args: any[]) => T;
type AbstractConstructor<T> = abstract new (...args: any[]) => T;
type AnyConstructor<T> = Constructor<T> | AbstractConstructor<T>;

export function isInstanceOf<T>(v: unknown, of: AnyConstructor<T>): v is T {
  if (isConstructable(v)) {
    return v instanceof of;
  }
  return false;
}
export function isKeyOf<T>(key: unknown, of: T): key is KeyOf<T> {
  if (key == null) {
    return false;
  }
  if (typeof key === "string") {
    return has(of, key.slice(1));
  }
  if (isConstructable(of)) {
    return isInstanceOf(key, of);
  }
  return false;
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
