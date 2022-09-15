import { isFunction } from "./guards";

export function todo(reason: string) {
  return (target: object, property?: PropertyKey) => {};
}
