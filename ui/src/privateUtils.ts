import { isObject, isObjectWithProp } from "@tswift/util";

export function selfOrParent<T, K extends PropertyKey>(scope: T | undefined, property: K): T extends (null|undefined) ? undefined : K extends keyof T ? T[K] : undefined {
    if (scope == null){
      return undefined as any;
    }
    if (isObjectWithProp(scope, property) && scope[property] != null) {
      return scope[property] as unknown as any;
    }
    if (isObject(scope) && isObjectWithProp(scope, 'parent')) {
      return selfOrParent(scope.parent as T, property);
    }
    return undefined as any;
  }
  