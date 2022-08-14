import { Bindable, Dot, KeyOfTypeWithType, Listen } from "./types";


export function swifty<T, A extends any[] = []>(clazz: { new (...args:A): T }) {
    return Object.assign(((...args:A):T=>new clazz(...args)), clazz.constructor) ;
}

export function watchable<T>(value:T, ...listen:Listen<T>[]):Bindable<T>{
    const listening = new Set<Listen<T>>(listen);
    let currentValue:T = value;
   
    return Object.assign((newValue?:T)=>{
        if (newValue !== undefined &&  newValue !== currentValue){
            currentValue = newValue;
            listening.forEach(v=>v(currentValue));
        }
        return currentValue;
    }, {
        clear:listening.clear.bind(listening),
        on(listen:Listen<T>) {
            listening.add(listen);
            return ()=> listening.delete(listen);
        }
    }) ;
}

export function has<T, K>(v:unknown, k:PropertyKey): k is keyof T {
    return Object.prototype.hasOwnProperty.call(v, k);
}

export function toEnum<T>(enm:T, property:T | Dot<keyof T> | keyof T):T{
    if (typeof property === 'string'){   
        const p = property[0] === '.' ? property.slice(1) : property;
        if (has(enm, p)){
            return enm[p];
        }
        throw new Error(`not an enum ${property} in ${enm}`);
    }
    return property as T;
}

export function toValue<T>(clazz:T, property?:KeyOfTypeWithType<T, T>){
    const fn = function(prop:KeyOfTypeWithType<T, T>){
        if (typeof prop === 'string' ){
            return clazz[prop.slice(1) as (keyof T)];
        }
        return prop;
    }
    if (property == null){
        return fn;
    }
    return fn(property);
}
type Constructor = new (...args:any)=>any;

type Mix<T extends Constructor[]> = T extends [infer First extends Constructor, ...infer Rest extends Constructor[]] ?  InstanceType<First> & Mix<Rest> : {} ;

export function applyMixins<T extends Constructor>(derivedCtor:T, ...constructors:Constructor[]):T{
    constructors.forEach((baseCtor) => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
        console.log('name', name)
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