import { isObjectWithProp } from "./guards";
import { Predicate } from "./types";


export class SwiftString extends String {

    get isEmpty() {
        return this.length == 0;
    }
    get count() {
        return this.length;
    }
    hasPrefix(str: string): boolean {
        return this.startsWith(str);
    }
    hasSuffix(str: string): boolean {
        return this.endsWith(str);
    }
    contains(str: string|Predicate<string>): boolean {
        if (typeof str === 'function') {
            for (let i = 0; i < this.length; i++){
                if (!str(this[i])) {
                    return false;
                }
            }
            return true;
        }
        return this.includes(str);
    }
    allSatisfy(fn: Predicate<string>): boolean {
        for (let i = 0; i < this.length; i++){
            if (!fn(this[i])) {
                return false;
            }
        }
        return true;
    }

    index(idx: { of: string } | { before: number } | { after: number }| number, conf:{offsetBy:number, limitedBy:number}) {
        if (isObjectWithProp(idx, 'before')) {
            return idx.before - 1;
        } else if (isObjectWithProp(idx, 'after')) {
            return idx.after + 1;
        } else if (isObjectWithProp(idx, 'of')) {
            return this.indexOf(idx.of);
        }
        if (typeof idx === 'number') {
            if (isObjectWithProp(conf, 'limitedBy')) {
                return Math.min(idx + conf.offsetBy, conf.limitedBy)
            }
         
            return idx;
        }

    }

}