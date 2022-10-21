/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/transpile.func.test.ts TAP > must match snapshot 1`] = `
export function sayHelloWorld(): string {
    return "hello, world"
}

`

exports[`test/transpile.func.test.ts TAP > must match snapshot 2`] = `
import { func } from "@tswift/util";

export const greet = func(function greet(): string {
    const greeting = "Hello, " + person + "!"
    return greeting
}, "person");
greet({ person: "Sam" })

`

exports[`test/transpile.func.test.ts TAP > must match snapshot 3`] = `
import { func } from "@tswift/util";

export const greet = func(function greet(): string {
    if (alreadyGreeted) {
        return "Hello again"
    } else {
        return "Hello " + person
    }
}, "person", "alreadyGreeted");
greet({ person: "Tim", alreadyGreeted: true })

`

exports[`test/transpile.func.test.ts TAP > must match snapshot 4`] = `
import { tuple, func } from "@tswift/util";

export const minMax = func(function minMax(): [number, number] {
    let currentMin = array(0)
    let currentMax = array(0)
    for (const value of array(1..< array.count)) {
        if (value < currentMin) {
            currentMin = value
        } else if (value > currentMax) {
            currentMax = value
        }
    }

    return tuple([undefined, currentMin], [undefined, currentMax])
}, "array");

`
