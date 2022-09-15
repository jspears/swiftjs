import { Dot, KeyPath } from "./types";
import { keyPath } from "./util";

type CheckFn<T> = (t: T) => T | undefined;

export function isPropertyKey(v: unknown): v is PropertyKey {
  return typeof v === "string" || typeof v === "number" || typeof v === "symbol";
}
/**
 * Convience function for walking over a tree structure
 * @param first
 * @param next
 */
export function* sequence<Leaf extends object>(first: Leaf, next: Dot<keyof Leaf> | string | CheckFn<Leaf>) {
  yield first as Leaf;
  while (true) {
    const resp = isPropertyKey(next) ? keyPath(first, next as any) : next(first);
    if (resp == null) {
      break;
    }
    yield resp as Leaf;
    first = resp as Leaf;
  }
}
export function root<T>(first: T, next: ($0: T) => T | undefined) {
  while (true) {
    const resp = next(first);
    if (resp == null) {
      return first;
    }
    first = resp;
  }
}
