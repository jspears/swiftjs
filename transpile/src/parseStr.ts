
interface StringParts {
    literals: string[];
    values: string[];
}

export function parseStr(str: string): StringParts {
    const ret: StringParts = { values: [], literals: [] };

    let depth = 0, literal = [], value = [];
    
    for (let i = 0; i < str.length; i++) {
        const c = str[i];
        switch (c) {
            case '(':
                if (depth == 0){
                        ret.literals.push(literal.join(''));
                        literal = [];
                }
                depth++;
                break;
            case ')': {
                depth--;
                if (depth == 0){
                   if (value.length)
                       ret.values.push(value.join(''));
                   value = [];
                   literal = [];
               }
                break;
            }
            default:
                if (depth > 0) {
                    value.push(c);
                } else {
                    literal.push(c);
                }
        }
    }
    if (literal.length){
        ret.literals.push(literal.join(''));
    }
    return ret;
}
export function toStringLit({ literals, values }: StringParts): string {
    let ret = "`";
    for (let i = 0, m = Math.max(literals.length, values.length); i < m; i++) {
        if (i < literals.length) {
            ret += literals[i];
        }
        if (i < values.length) {
            ret += `\${${values[i]}}`
        }
    }
    return ret + '`';
}