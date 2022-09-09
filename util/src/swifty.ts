import { Constructor } from "./types";

export function swifty<
  A extends Constructor,
  Args extends any[] = ConstructorParameters<A>
>(clazz: A) {
  return Object.assign((...args: Args) => new clazz(...args), clazz);
}
