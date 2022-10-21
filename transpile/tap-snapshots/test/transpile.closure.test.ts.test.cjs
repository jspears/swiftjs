/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/transpile.closure.test.ts TAP > must match snapshot 1`] = `
import { SwiftArrayT } from "@tswift/util";
const names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
let reversedNames = names.sorted({ by: (s1: string, s2: string) => s1 > s2 })

`

exports[`test/transpile.closure.test.ts TAP > must match snapshot 2`] = `
import { SwiftArrayT } from "@tswift/util";
const names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
const reversedNames = names.sorted({ by: (s1, s2) => s1 > s2 })

`
