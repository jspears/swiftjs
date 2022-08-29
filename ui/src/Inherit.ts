import type { View } from "./View";


const ClassPropMap = new WeakMap<View, {}>;
/**
 * Stores class configuration data in a weakmap kinda like #private methods.
 * It will look for the corresponding property in a parent.   Until it gets
 * to App where it will complain if its not defined.
 * 
 * @param target 
 * @param key 
 */
export function Inherit(target: object, key: PropertyKey) {

    const opd = Reflect.getOwnPropertyDescriptor(target, key);
    const ovalue = opd?.value;
    Reflect.defineProperty(target, key, {
        set(v) {
            let resp = ClassPropMap.get(this);
            if (!resp) {
                resp = {};
                ClassPropMap.set(this, resp);
            }
            (resp as any)[key] = v;
        },
        get() {
            const r = ClassPropMap.get(this) as any;
            if (r){
                if (key in r) {
                    return r[key];
                }
            }
            if (ovalue !== undefined) {
                return ovalue;
            }
            if (target.parent == null) {
                if (target.constructor.name != 'App') {
                    console.warn(`component[${target.constructor.name}] asked for property ${String(key)} but no parent was available`)
                }
                return (target.parent as any)?.[key];
            }
        }
    });
}