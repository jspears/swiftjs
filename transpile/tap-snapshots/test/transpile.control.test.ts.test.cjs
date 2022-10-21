/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/transpile.control.test.ts TAP > must match snapshot 1`] = `
import { print } from "@tswift/util";

const someCharacter: string = "z"
switch (someCharacter) {
    case "a": case "b": print("The first letter of the alphabet"); break;
    case "z": print("The last letter of the alphabet"); break;
    default: print("Some other character"); break;
}

`

exports[`test/transpile.control.test.ts TAP > must match snapshot 2`] = `
import { cloneable, SwiftArrayT } from "@tswift/util";

export class Rank {
    [cloneable]() {
        return new Rank(this.rawValue)
    }

    /** @ts-ignore */
    get values() {
        switch (this) {
            case Rank.ace: return new Rank_Values({ first: 1, second: 11 }); break;
            case Rank.jack: case Rank.queen: case Rank.king: return new Rank_Values({ first: 10, second: undefined }); break;
            default: return new Rank_Values({ first: this.rawValue, second: undefined }); break;
        }
    }

    public static readonly two = new Rank(2);
    public static readonly three = new Rank(3);
    public static readonly four = new Rank(4);
    public static readonly five = new Rank(5);
    public static readonly six = new Rank(6);
    public static readonly seven = new Rank(7);
    public static readonly eight = new Rank(8);
    public static readonly nine = new Rank(9);
    public static readonly ten = new Rank(10);
    public static readonly jack = new Rank(11);
    public static readonly queen = new Rank(12);
    public static readonly king = new Rank(13);
    public static readonly ace = new Rank(14);

    constructor(public readonly rawValue: number) {
    }

    public static readonly allCases = [Rank.two, Rank.three, Rank.four, Rank.five, Rank.six, Rank.seven, Rank.eight, Rank.nine, Rank.ten, Rank.jack, Rank.queen, Rank.king, Rank.ace] as const;
}

class Rank_Values {
    [cloneable]() {
        return new Rank_Values(this);
    }

    readonly first: number;
    readonly second?: number;

    constructor(param: { first: number, second?: number });
    constructor(param?: Rank_Values);
    constructor(..._args: any[]) {

        const { first, second } = _args[1];
        this.first = first;
        if (second !== undefined) this.second = second;
        if (_args[0] instanceof Rank_Values) Object.assign(this, _args[0])
    }
}

`
