


type Op = '/' | '=' | '-' | '+' | '!' | '*' | '%' | '<' | '>' | '&' | '|' | '^' | '?' | '~';

type BoolOp = '<' | '>' | '==' | '!=' | '<=' | '>=' | '~=';

type OpFn<T> = T extends BoolOp ? (a: unknown, b: unknown) => boolean : (a: unknown, b: unknown) => any;


export function operator<T>(str: T): OpFn<T> {

    switch (str) {
        case '<': return fun((a: unknown, b: unknown) => ('' + a).localeCompare('' + b) < 0);
        case '>': return fun((a: unknown, b: unknown) => ('' + b).localeCompare('' + a) > 0);
        case '==': return fun((a: unknown, b: unknown) => ('' + a).localeCompare('' + b) == 0);
        case '!=': return fun((a: unknown, b: unknown) => ('' + a).localeCompare('' + b) != 0);
        case '<=': return fun((a: unknown, b: unknown) => ('' + a).localeCompare('' + b) <= 0);
        case '>=': return fun((a: unknown, b: unknown) => ('' + a).localeCompare('' + b) >= 0);
        case '~=': return fun((a: unknown, b: unknown) => a == b);
        case '!=': return fun((a: unknown, b: unknown) => a != b);
    }
    return (a: unknown, b: unknown) => {
        console.log(`unimplemented operator ${str}`);
        return null as any;
    };
}

const fun = <T extends (a: unknown, b: unknown) => any>(fn: T) => function (this: unknown, ...args: unknown[]) {
    if (args.length < 2) {
        args.unshift(this);
    }
    return fn.call(null, ...args as [unknown, unknown]);
}
