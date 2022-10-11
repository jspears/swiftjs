import { has } from './guards';

type TupleToArgs<T, K> = K extends [`${infer Key extends keyof T & string}`, ...infer Rest] ? [T[Key], ...TupleToArgs<T, Rest>] : [];

/**
 * Allows a function to be invoked, expecting an object,
 * even if was invoked using positional parameters.   It does
 * not do anything smart, like match on types.   There be dragons.
 * 
 * Perhaps in the future there will be a descriminator function,
 * that will let you build your own object, based on what you
 * know.
 * 
 * It should preserve the scope of the functions execution
 * 
 * @Example
 * ```ts
 * 
 * function hello(v:{name:string}){
 *  console.log('hi', v.name);
 * }
 * 
 * const h = func(hello, "name")
 * h("Bob");
 * //hi Bob 
 * h{name:"Bob"});
 * //hi Bob
 * 
 * 
 * 
 * 
 * ```
 * 
 * @param fn - The function to wrap 
 * @param keys - The keys in order to map arguments to
 * @returns a function that returns the same thing as fn, takes the same thing.
 */
export function func<F extends (a: any) => any, T extends Parameters<F>[0], Keys extends (keyof T)[],
Tuples extends any[] = [T] | TupleToArgs<T,Keys> 
>(fn: F, ...keys: Keys) {
    return function(this:any, ...args: Tuples): ReturnType<F> {
        if (args.length == 1) {
            if (keys.some(v => has(args[0], v))) {
                return fn.call(this, args[0]);
            }
        }
        return fn.call(this, keys.reduce((ret, k, i) => {
            ret[k] = args[i];
            return ret;

        }, {} as T));

    }
}
