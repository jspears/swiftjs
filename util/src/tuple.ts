/**
 * Adding properties to array's to emulate swift's named tuples.
 * 
 */

import { cloneable } from "./types";


type TupleArg = [ string, any] | [undefined, unknown];
type Tuples = readonly TupleArg[];
type TupleVal<T> = T extends [[infer K, infer V], ...infer Rest ] ? [V, ...TupleVal<Rest>] : [];
type TupleObj<T> = T extends [[infer K extends string, infer V], ...infer Rest] ? {[k in K]:V} & TupleObj<Rest> : {};
type _TupleRet<T, K> = T extends [infer V, ...infer RestV] ? K extends [infer Key extends string, ...infer RestT] ? { [k in Key]: V } & _TupleRet<RestT, RestV> : {} : {};
type TupleRet<T, K> = _TupleRet<T, K> & T;
    
export type Tuple<T> = TupleVal<T> & TupleObj<T>;

export function retuple<T extends any[], A extends any[], Keys extends readonly string[]>(fn: (this:any, ...args: A) => T, keys: Keys): (this:any, ...args:A)=>TupleRet<T, Keys> {
    return function (this:any, ...args: A) {
        return keys.reduce((ret, key, i) => {
            ret[key] = ret[i];
            return ret;
        }, fn.call(this, ...args) as any) as any;
    }
}


export function tuple<T extends readonly any[]>(...all: T):T extends Tuples ?  Tuple<T> : never {
    const ret: any = all.reduce((ret, [k,v]) => {
        ret.push(v);
        if (k != null) {
            ret[k] = v;
        }
        return ret;
    }, []);

    ret[cloneable] = () => Object.assign([], ret);
    
    return ret as any;
}

type ToTuple<K extends readonly string[], F extends readonly any[]> = K extends [infer Key extends string, ...infer Rest extends string[]] ? F extends [infer Val, ...infer Vals] ? { [k in Key]: Val } & ToTuple<Rest, Vals> : {} : { };
export function tupleWrap<K extends readonly string[], F extends (...args: any[]) => any>(keys: K, fn:F): (...args:Parameters<F>)=>ReturnType<F> & ToTuple<K, ReturnType<F>> {
    return function (this:any, ...args: Parameters<F>) {
        const ret = fn.call(this, ...args);
        for (let i = 0; i < keys.length; i++){
            ret[keys[i]] = ret[i];
        }        
        return ret as any;
    }
}
export function TupleRet(keys: string[]) {
    return function (target: unknown, propertyKey: PropertyKey, descriptor:TypedPropertyDescriptor<Function>) {
        descriptor.value = tupleWrap(keys, descriptor.value as any);
    }
}