import { KeyOfTypeWithType } from "./types";

type CType<T, A extends any[] = []> = (...args:A)=>T;

export function swifty<T, A extends any[] = []>(clazz: { new (...args:A): T }) {
    return Object.assign(((...args:A):T=>new clazz(...args)), clazz.constructor) ;
}

type VoidFn = ()=>{};
type ListenerFn<T> = (t?:T)=> unknown;

export type Watchable<T> = (t?:T)=>T | undefined & { add(on:ListenerFn<T>):VoidFn };

export function watchable<T>(t?:T):Watchable<T>{
    const listening = new Set<ListenerFn<T>>();
    let currentValue:T|undefined = t;
    return Object.assign((newValue?: T | undefined)=>{
        if (newValue !== undefined &&  newValue !== currentValue){
            currentValue = newValue;
            listening.forEach(v=>v(currentValue));
        }
        return currentValue;
    }, {
        on(listen:ListenerFn<T>) {
            listening.add(listen);
            return ()=> listening.delete(listen);
        }
    }) as any;
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