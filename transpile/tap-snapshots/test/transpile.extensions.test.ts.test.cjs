/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/transpile.extensions.test.ts TAP > must match snapshot 1`] = `
import { print } from "@tswift/util";

export class Number$Extension extends Number implements Number {
    /** @ts-ignore */
    get km() {
        return this as any * 1_000.0
    }

    /** @ts-ignore */
    get m() {
        return this
    }

    /** @ts-ignore */
    get cm() {
        return this as any / 100.0
    }

    /** @ts-ignore */
    get mm() {
        return this as any / 1_000.0
    }

    /** @ts-ignore */
    get ft() {
        return this as any / 3.28084
    }

    constructor();
    constructor(..._args: any[]) {
        super(..._args)
        const { } = _args[1];

        if (_args[0] instanceof Number$Extension) Object.assign(this, _args[0])
    }
}
Object.setPrototypeOf(Number.prototype, Number$Extension.prototype)
const oneInch = 25.4.mm
print(\`One inch is \${oneInch} meters\`)
// Prints "One inch is 0.0254 meters"
const threeFeet = 3..ft

`
