import { has } from "@tswift/util";
import { Color, ColorKey } from "./Color";
import { Alignment, AlignmentKey } from "./Edge";
import { View, ViewableClass } from "./View";

export function isView(v: unknown): v is View {
   return isInstanceOf(v, View);
}

export function isFunction(v:unknown): v is (...args:any[])=>any {
    return typeof v === 'function';
}

export function isInstanceOf<T>(v: unknown, of: new (...args: any[]) => T): v is T {
    if (v == null) {
        return false;
    }    
    if (typeof v === 'object' && isFunction(v.constructor)){
        return v instanceof of;
    }
    if (isFunction(v)) {
        return v instanceof of;
    }
    return false;
}

export function isAlignmentKey(v: unknown): v is AlignmentKey {
    return isKeyOf(v, Alignment);
}

export function isColorKey(v: unknown): v is ColorKey {
    return isKeyOf(v, Color);
}

export function isKeyOf<T>(key: unknown, of: new (...args: any[]) => T): key is T {
    if (key == null) {
        return false;
    }
    if (typeof key === 'string') {
        return has(of, key.slice(1));
    }
    return isInstanceOf(key, of);
}
export function isViewable(v: unknown): v is ViewableClass<unknown> {
    return isInstanceOf(v, ViewableClass<unknown>);
}