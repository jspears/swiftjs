import { isFunction, isObjectWithPropType } from "./guards";
import { Compare } from "./types";



type Op = '/' | '=' | '-' | '+' | '!' | '*' | '%' | '<' | '>' | '&' | '|' | '^' | '?' | '~';

type BoolOp = '<' | '>' | '==' | '!=' | '<=' | '>=' | '~=';

type OpFn<T> = T extends BoolOp ? Compare<unknown> : (a: unknown, b: unknown) => any;

/**
 * Crates an operator function.  If called on a type it will use that types, operator.  
 * 
 * @param str [Op] -- 
 * @returns 
 */
export function operator<T extends Op>(str: T): OpFn<T> {

    switch (str) {
        case '<': return fun(str, (a: unknown, b: unknown) => ('' + a).localeCompare('' + b) < 0);
        case '>': return fun(str, (a: unknown, b: unknown) => ('' + b).localeCompare('' + a) > 0);
        case '==': return fun(str, (a: unknown, b: unknown) => ('' + a).localeCompare('' + b) == 0);
        case '!=': return fun(str, (a: unknown, b: unknown) => ('' + a).localeCompare('' + b) != 0);
        case '<=': return fun(str, (a: unknown, b: unknown) => ('' + a).localeCompare('' + b) <= 0);
        case '>=': return fun(str, (a: unknown, b: unknown) => ('' + a).localeCompare('' + b) >= 0);
        case '~=': return fun(str, (a: unknown, b: unknown) => a == b);
        case '!=': return fun(str, (a: unknown, b: unknown) => a != b);
    }
    return fun(str, (a: unknown, b: unknown) => {
        if (isObjectWithPropType(isFunction, str, a)) {
            return a[str](b);
        }

        console.log(`unimplemented operator ${str}`);
        return false;
    });
}

const fun = <T extends (a: unknown, b: unknown) => any>(op:Op, fn: T) => function (this: unknown, ...args: unknown[]) {
    if (args.length < 2) {
        args.unshift(this);
    }
    if (isObjectWithPropType(isFunction, op, this)) {
       return this[op](...args);
    }
    return fn.call(null, ...args as [unknown, unknown]);
}
