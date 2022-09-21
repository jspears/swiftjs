import { isInstanceOf } from "./guards";
import { Hasher, isHashable } from "./Hasher";
import { Bindable, Hashable, HashI } from "./types";
import { watchable } from "./util";

export class ObservableObject implements Hashable {
  public objectWillChange = watchable(this);
  hash(hasher: HashI) {
    return Object.entries(this).reduce((ret, [key, value]) => {
      ret.combine(key)
      if (isHashable(value)) {
        value.hash(ret);
      } else {
        switch (typeof value) {
          case 'number':
          case 'string':
          case 'boolean':
          case 'bigint':
            ret.combine(value);
        }
      }

      return ret;
    }, hasher)
  }
}

export function isObservableObject(v: unknown): v is ObservableObject {
  return isInstanceOf(v, ObservableObject);
}

export const Published = (target: { objectWillChange: Bindable<any> }, key: PropertyKey) => {
  const opd = Reflect.getOwnPropertyDescriptor(target, key);
  let value = opd?.value;

  Reflect.defineProperty(target, key, {
    set(v) {
      this.objectWillChange(this);
      value = v;
    },
    get() {
      return value;
    },
  });
};
