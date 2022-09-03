import { has } from "@tswift/util";
import { Color, ColorKey } from "./Color";
import { Alignment, AlignmentKey } from "./Edge";
import { View, ViewableClass } from "./View";

export function isView(v: unknown): v is View {
    if (v == null) {
        return false;
    }    
    if (typeof v === 'function') {
        return v instanceof View;
    }
    return false
}

export function isInstanceOf<T>(v: unknown, of: new (...args: any[]) => T): v is T {
    if (v == null) {
        return false;
    }    
    if (typeof v === 'function'|| typeof v.constructor === 'function') {
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
export function isViewable(v: unknown): v is ViewableClass {
    return isInstanceOf(v, ViewableClass);
}