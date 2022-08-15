define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isEmpty = exports.isBindable = exports.toggle = exports.applyMixins = exports.toValue = exports.isString = exports.toEnum = exports.has = exports.watchable = exports.swifty = void 0;
    function swifty(clazz) {
        return Object.assign(((...args) => new clazz(...args)), clazz.constructor);
    }
    exports.swifty = swifty;
    function watchable(value, ...listen) {
        const listening = new Set(listen);
        let currentValue = value;
        return Object.assign((newValue) => {
            if (newValue !== undefined && newValue !== currentValue) {
                currentValue = newValue;
                listening.forEach(v => v(currentValue));
            }
            return currentValue;
        }, {
            clear: listening.clear.bind(listening),
            valueOf() {
                return currentValue;
            },
            on(listen) {
                listening.add(listen);
                return () => listening.delete(listen);
            }
        });
    }
    exports.watchable = watchable;
    function has(v, k) {
        return Object.prototype.hasOwnProperty.call(v, k);
    }
    exports.has = has;
    function toEnum(enm, property) {
        if (typeof property === 'string') {
            const p = property[0] === '.' ? property.slice(1) : property;
            if (has(enm, p)) {
                return enm[p];
            }
            throw new Error(`not an enum ${property} in ${enm}`);
        }
        return property;
    }
    exports.toEnum = toEnum;
    function isString(v) {
        return typeof v === 'string';
    }
    exports.isString = isString;
    //export function toValue<T extends Constructor, K extends KeyOf<T> = KeyOf<T>>(clazz:T, property:K)=>K extends `.${infer R extends keyof T & string}` ? K extends T ? K : never;
    function toValue(clazz, property) {
        const fn = function (prop) {
            if (isString(prop)) {
                return clazz[prop.slice(1)];
            }
            return prop;
        };
        if (property == null) {
            return fn;
        }
        return fn(property);
    }
    exports.toValue = toValue;
    function applyMixins(derivedCtor, ...constructors) {
        constructors.forEach((baseCtor) => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
                console.log('name', name);
                Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                    Object.create(null));
            });
        });
        return derivedCtor;
    }
    exports.applyMixins = applyMixins;
    const toggle = (v) => () => v(!v());
    exports.toggle = toggle;
    function isBindable(v) {
        return typeof v === 'function' && has(v, 'on');
    }
    exports.isBindable = isBindable;
    const isEmpty = (v) => {
        if (v == null) {
            return true;
        }
        const val = isBindable(v) ? v() : v;
        return has(val, 'length') ? val.length == 0 : false;
    };
    exports.isEmpty = isEmpty;
});
