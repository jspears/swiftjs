

export function inTwo<T>(arr: T[], f: (a: T) => boolean):[T[],T[]] {
    const ret: [T[], T[]] = [[],[]];

    for (const o of arr) {
        ret[f(o) ? 0 : 1].push(o)
    }

    return ret;

}