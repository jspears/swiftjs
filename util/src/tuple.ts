/**
 * Adding properties to array's to emulate swift's named tuples.
 * 
 */

import { cloneable } from "./types";


type TupleArg = [ string, any] | [undefined, unknown];
type Tuples = readonly TupleArg[];
type TupleObj<T extends Tuples> = T extends [infer First extends TupleArg, ...infer Rest extends Tuples] ? First[0] extends `${infer Key}` ? {[k in Key]:First[1]} & TupleObj<Rest> : {} : {};
type TupleArr<T extends Tuples> = T extends [infer First extends TupleArg, ...infer Rest extends Tuples] ? [First[1], ...TupleArr<Rest>] : [];
type Tuple<T extends Tuples> = TupleObj<T> & TupleArr<T>;


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