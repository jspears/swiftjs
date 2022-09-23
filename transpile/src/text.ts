
export function replaceStart(prefix: string, v: string) {
    if (v.startsWith(prefix)) {
        return v.slice(prefix.length)
    }
    return v;
}
export function replaceEnd(postfix: string, v: string) {
    if (v.endsWith(postfix)) {
        return v.slice(0,  -postfix.length);
    }
    return;
}