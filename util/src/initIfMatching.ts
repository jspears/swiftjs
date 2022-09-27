import { isObject, isObjectWithProp } from "./guards";
import { AnyConstructor } from "./types";

export function initIfMatching<T extends AnyConstructor,
    V extends InstanceType<T> = InstanceType<T>,
    K extends keyof V & string = keyof V & string
>(v: V,
    k: K,
    param: ConstructorParameters<T>[0] & object,
    config: { name: string, optional?: boolean, type: string }[]
): boolean {
    if (!isObject(param)) {
        return false;
    }
    const args = [];
    for (const c of config) {

        if (isObjectWithProp(param, c.name)) {
            const v = param[c.name]
            if (v != null) {
                switch (c.type) {
                    case "Date":
                    case "date":
                        if (!(v instanceof Date)){
                            return false;
                        }
                        break;
                    case "symbol":    
                    case "bigint":
                    case "number":
                    case "function":
                    case "object":
                    case "string":
                        if (typeof v !== c.type) {
                            return false;
                        }
                        break;
                    default:
                        //c.constructor.name == c.type maybe?
                        // it's hard to say, inheritance and stuff.
                        //do not have a way of checking all types    
                        //maybe we could do some instanceof checks or something.
                }
            } else if (c.type != 'null') {
                return false;
            }
        } else if (!c.optional) {
            return false;
        } 
        args.push(v);        
    }

    v[k](...args);
    return true;
}