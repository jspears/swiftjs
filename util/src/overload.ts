import { isObjectWithProp } from "./guards";
import { Constructor, Param } from "./types";

type Fn = (...args: any[]) => any

function isExtendName(name: string, v: unknown): boolean {
    if (!v) return false;
    if (v.constructor.name == name) {
        return true
    }
    if (v.constructor === Object || v.constructor === Function) {
        return false;
    }
    return isExtendName(name, Object.getPrototypeOf(v));
}


export function isOverloadConstructor<T>(param?: unknown, config: Param[] = []): param is T {
    if (config.length == 0 && param == null) {
        return true;
    }

    for (const c of config) {
        if (isObjectWithProp(param, c.name)) {
            if (!isOneOfType(c.type, param[c.name])) {
                return false;
            }
        } else if (!c.optional) {
            return false;
        }
    }
    return true;
}


function isOneOfType(str: string, v?: unknown) {
    for (const type of str.split(/\s*|\s*/)) {
        if (/Array|\[.*\]/.test(type)) {
            if (Array.isArray(v)) {
                return true;
            }
        }
        switch (type) {
            case '|': continue;
            case 'null':
            case 'undefined':
                if (v == null) {
                    return true;
                }
            case "Date":
            case "date":
                if (v instanceof Date) {
                    return true;
                }
                break;
            case "symbol":
            case "bigint":
            case "number":
            case "function":
            case "object":
            case "string":
                if (typeof v === type) {
                    return true;
                }
                break;

            default:
                if (isExtendName(type, v)) {
                    return true;
                }
            //c.constructor.name == c.type maybe?
            // it's hard to say, inheritance and stuff.
            //do not have a way of checking all types    
            //maybe we could do some instanceof checks or something.
        }
    }
    return false;
}


export function overloadParams(...params: Param[][]): string[] {
    const ret: string[] = [];
    for (let i = 0; i < params.length; i++) {
        const param = params[i];
        for (let j = 0; j < params[i].length; i++) {
            const p = param[j];
            ret[i] = ret[i] ? `${ret[i]}|${p.type}` : p.type;
        }
    }
    return ret;
}

function argsToObj(args: any[], params: Param[]): any {
    return params.reduce((ret, param, i) => {
        ret[param.name] = args[i];
        return ret;
    }, {} as any);
}
function processArgOrUndef(args: any[], params: Param[]): any[] | undefined {
    if (isOverloadConstructor(params, args[0])) {
        return args;
    } else {
        const obj = argsToObj(args, params);
        if (isObjectWithProp(args, obj)) {
            return [obj]
        }
    }
    return;
}
function processArgs(idx: number, args: any[], rest: Param[][] = []): [number, ...any[]] {
    const pargs = processArgOrUndef(args, rest[0]);
    if (pargs != null) {
        return [idx, ...pargs];
    }
    return rest.length ? processArgs(idx + 1, args, rest.slice(1)) : [idx, ...args];
}
/**
 * When the class is called the first argument will be the index 
 * of the correct constructor to call.   This should ensure the
 * desired constructor is inited and prevent the same code running multiple times.
 * 
 * @param params 
 * @returns []
 */
export function Overload(params: Param[][]) {
    return <T extends Constructor>(constructor: T) => {
        return class extends constructor {
            constructor(...args: any[]) {
                super(...processArgs(0, args, params));
            }
        }
    }
}
/**
 * Use this for overloaded functions.
 * 
 * @param fa 
 * @param params 
 * @param fb 
 * @returns 
 */

export function overload<FA extends Fn, FB extends Fn, FAArg extends any[] = Parameters<FA>, FBArg extends any[] = Parameters<FB>>(
    fa: FA, params: Param[], fb: FB) {
    return function <T extends any[] = FAArg | FBArg>(this: any, ...args: T): T extends FAArg ? ReturnType<FA> : ReturnType<FB> {
        const arg = processArgOrUndef(args, params);
        return arg ? fa.call(this, ...arg) : fb.call(this, ...args);
    }
}
/**
 * So we are taking the parameters in the Overload decorator and trying
 * to find matches.   When we find a match the constructor will be called
 * with the idx and the object converted.  So we just need to know the index
 * in order to tell if it is the corresponding object.   Next 2 steps are
 * 1 adding KeyPath '.what' property handling and handle unnamed parameters
 * '_'. 
 * 
 * 
 * @param idx 
 * @param check 
 * @param v 
 * @returns 
 */
export function isOverloadConstructorIdx<T>(idx: number, check: any, v: any): v is T {
    return idx == check;
}
