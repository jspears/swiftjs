import { Constructor } from "./types";


export function staticKey<T extends Constructor, K extends keyof T>(c:InstanceType<T>, key:K):T[K]{
    return c.constructor[key];
}
export function name<T extends Constructor>(c: InstanceType<T>): T['name'] {
    return c.constructor.name;
}

type KeyOf<T, K extends string> = K extends `.${infer Key extends keyof T & string}` ? T[Key] : never;
type CKeyOf<T extends Constructor, K extends string> = KeyOf<T, K> extends never ? KeyOf<InstanceType<T>, K> : KeyOf<T,K> extends never ? KeyOf<T,K> : undefined;

export function key<T extends Constructor, K extends string>(c: InstanceType<T>, key: K):CKeyOf<T, K> {

    return null as any;
}