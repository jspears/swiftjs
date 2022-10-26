

const weak = new WeakMap<object, Map<PropertyKey, unknown>>;
/**
 * does the work for lazy functions, scoping a ma
 * 
 * @param scope 
 * @param prop 
 * @param val 
 * @returns 
 */
export function lazy<T extends object, P extends keyof T = keyof T>(scope: T, prop: P, val?:T[P]): T[P]  {
    if (val === undefined) {
      return  getScopeMap(scope)?.get(prop) as any;
    }
    getScopeMap(scope)?.set(prop, val);
    return val;
}

const getScopeMap = (scope: any)=>{
  
    if (weak.has(scope)) {
        return weak.get(scope);
    }
    const map = new Map<PropertyKey, unknown>;
    weak.set(scope, map);
    return map;
} 