/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/transpile.class.test.ts TAP > must match snapshot 1`] = `
import { overload } from "@tswift/util";

export class Counter {
    count: number = 0;
    public increment = overload(function() {
        this.count += 1
    }, [{ "name": "by", "internal": "amount", "type": "number" }], function(this: Counter, { by: amount }: { by: number }) {
        this.count += amount
    });

    reset() {
        this.count = 0
    }

    constructor(param: { count?: number });
    constructor(param?: Counter);
    constructor(..._args: any[]) {

        const { count } = _args[1];
        if (count !== undefined) this.count = count;
        if (_args[0] instanceof Counter) Object.assign(this, _args[0])
    }
}
const c = new Counter()
c.increment()
c.increment(3)
c.increment({ by: 4 })

`
