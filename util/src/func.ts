import { has } from './guards';

type TupleToArgs<T, K> = K extends [`${infer Key extends keyof T & string}`, ...infer Rest] ? [T[Key], ...TupleToArgs<T, Rest>] : [];

export function func<F extends (a: any) => any, T extends Parameters<F>[0], Keys extends (keyof T)[],
Tuples extends any[] = [T] | TupleToArgs<T,Keys> 
>(fn: F, ...keys: Keys) {
    return (...args: Tuples): ReturnType<F> => {
        if (args.length == 1) {
            if (keys.some(v => has(args[0], v))) {
                return fn.call(null, args[0]);
            }
        }
        return fn.call(null, keys.reduce((ret, k, i) => {
            ret[k] = args[i];
            return ret;

        }, {} as T));

    }
}