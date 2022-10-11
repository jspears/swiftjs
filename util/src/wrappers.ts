

export function todo(reason: string) {
    
    
    return (target: any, property?: PropertyKey) => {
        console.warn('todo:[%s] %s->%s', reason, target?.constructor?.name, property);
    }
    
}

export function willSet<V extends object, K extends keyof V>(fn: (this: V, t: V[K]) => void) {
    return function (target: V, property: K) {
        let value = Reflect.getOwnPropertyDescriptor(target, property)?.value;
        Reflect.defineProperty(target, property, {
            get() {
                return value;
            },
            set(v) {
                fn.call(target, v);
                value = v;
            }
        })

    }

}

export function didSet<V extends object, K extends keyof V>(fn: (this: V, t: V[K]) => void) {
    return function (target: V, property: K) {
        let value = Reflect.getOwnPropertyDescriptor(target, property)?.value;
        Reflect.defineProperty(target, property, {
            get() {
                return value;
            },
            set(v) {
                let tmpValue = value;
                value = v;
                fn.call(target, tmpValue);
            }
        })

    }

}
