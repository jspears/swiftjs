import { has, isFunction, isObject, isObjectWithProp, isObjectWithPropType } from "./guards";
import { swifty } from "./swifty";
import { Hashable, HashI } from "./types";

//https://stackoverflow.com/questions/36811284/how-to-get-hash-value-of-an-object-in-typescript
export function hashCode(str: string): number {
    var h: number = 0;
    for (var i = 0; i < str.length; i++) {
        h = 31 * h + str.charCodeAt(i);
    }
    return h & 0xFFFFFFFF
}
class HasherClass implements HashI {
    _hashValue = 0;
    constructor(){}
    combine(val:string|number| Hashable|undefined){
        if (isHashable(val)){
            val.hash(this.combine(':'));
        }else{
            this._hashValue += hashCode(val == null ? ':' : val+':')
        }
        return this;
    }
    finalize(){
        return this._hashValue;
    }
    toString(){
        return this._hashValue.toString(16);
    }
    valueOf(){
        return this._hashValue;
    }
}
export const Hasher = swifty(HasherClass);
export function isHashable(v:unknown):v is Hashable {
     return isObjectWithPropType(isFunction, 'hash', v);
}
