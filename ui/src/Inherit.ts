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
            if (r && key in r && r[key] !== undefined) {
                return r[key];
            }
            if (ovalue !== undefined) {
                return ovalue;
            }
            const self = this as View;
            if (self._parent == null) {
                if (this.constructor.name != 'App') {
                    console.warn(`component[${this.constructor.name}] asked for property ${String(key)} but no parent was available`)
                }
                return;
            }
            return (self._parent as any)?.[key];

        }
    });
}