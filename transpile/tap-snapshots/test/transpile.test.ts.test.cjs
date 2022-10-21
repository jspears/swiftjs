/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/transpile.test.ts TAP > must match snapshot 1`] = `
import { cloneable } from "@tswift/util";

export class TestInferredProp {
    [cloneable]() {
        return new TestInferredProp(this);
    }

    private readonly stuff: number = 0;

    constructor(param: { stuff?: number });
    constructor(param?: TestInferredProp);
    constructor(..._args: any[]) {

        const { stuff } = _args[1];
        if (stuff !== undefined) this.stuff = stuff;
        if (_args[0] instanceof TestInferredProp) Object.assign(this, _args[0])
    }
}

`

exports[`test/transpile.test.ts TAP > must match snapshot 10`] = `
import { canThrowAnError } from "@tswift/util";

export function canThrowAnError() {
}
try {
    canThrowAnError()
    // no error was thrown
} catch (e) {// an error was thrown
}

`

exports[`test/transpile.test.ts TAP > must match snapshot 2`] = `
import { SwiftArrayT, func } from "@tswift/util";
const names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
export const backward = func(function backward(): boolean {
    return s1 > s2
}, "_", "_");
let reversedNames = names.sorted({ by: backward })

`

exports[`test/transpile.test.ts TAP > must match snapshot 3`] = `
import { cloneable, SwiftArrayT } from "@tswift/util";

export class CompassPoint {
    [cloneable]() {
        return new CompassPoint(this.rawValue)
    }

    public static readonly north = new CompassPoint("north");
    public static readonly south = new CompassPoint("south");
    public static readonly east = new CompassPoint("east");
    public static readonly west = new CompassPoint("west");

    constructor(public readonly rawValue: string) {
    }

    public static readonly allCases = [CompassPoint.north, CompassPoint.south, CompassPoint.east, CompassPoint.west] as const;
}

`

exports[`test/transpile.test.ts TAP > must match snapshot 4`] = `
import { cloneable, SwiftArrayT } from "@tswift/util";

export class Suit {
    [cloneable]() {
        return new Suit(this.rawValue)
    }

    public static readonly spades = new Suit("♠");
    public static readonly hearts = new Suit("♡");
    public static readonly diamonds = new Suit("♢");
    public static readonly clubs = new Suit("♣");

    constructor(public readonly rawValue: string) {
    }

    public static readonly allCases = [Suit.spades, Suit.hearts, Suit.diamonds, Suit.clubs] as const;
}

`

exports[`test/transpile.test.ts TAP > must match snapshot 5`] = `
import { cloneable, SwiftArrayT } from "@tswift/util";

export class Month {
    [cloneable]() {
        return new Month(this.rawValue)
    }

    public static readonly January = new Month(1);
    public static readonly February = new Month(2);
    public static readonly March = new Month(3);
    public static readonly April = new Month(4);
    public static readonly May = new Month(5);
    public static readonly June = new Month(6);
    public static readonly July = new Month(7);
    public static readonly August = new Month(8);
    public static readonly September = new Month(9);
    public static readonly October = new Month(10);
    public static readonly November = new Month(11);
    public static readonly December = new Month(12);

    constructor(public readonly rawValue: number) {
    }

    public static readonly allCases = [Month.January, Month.February, Month.March, Month.April, Month.May, Month.June, Month.July, Month.August, Month.September, Month.October, Month.November, Month.December] as const;
}

`

exports[`test/transpile.test.ts TAP > must match snapshot 6`] = `
import { cloneable, SwiftArrayT } from "@tswift/util";

export class BlackjackCard {
    [cloneable]() {
        return new BlackjackCard(this);
    }

    /**  BlackjackCard properties and methods */
    readonly rank: BlackjackCard_Rank;
    /** @ts-ignore */
    readonly suit: BlackjackCard_Suit;

    /** @ts-ignore */
    get description() {
        let output = \`suit is \${this.suit.rawValue},\`
        output += \` value is \${this.rank.values.first}\`
        let second;
        if ((second = this.rank.values.second) != null) {
            output += \` or \${second}\`
        }

        return output
    }

    constructor(param: { rank: BlackjackCard_Rank, suit: BlackjackCard_Suit });
    constructor(param?: BlackjackCard);
    constructor(..._args: any[]) {

        const { rank, suit } = _args[1];
        this.rank = rank?.[cloneable]?.() ?? rank;
        this.suit = suit?.[cloneable]?.() ?? suit;
        if (_args[0] instanceof BlackjackCard) Object.assign(this, _args[0])
    }
}

class BlackjackCard_Suit {
    [cloneable]() {
        return new BlackjackCard_Suit(this.rawValue)
    }

    public static readonly spades = new BlackjackCard_Suit("♠");
    public static readonly hearts = new BlackjackCard_Suit("♡");
    public static readonly diamonds = new BlackjackCard_Suit("♢");
    public static readonly clubs = new BlackjackCard_Suit("♣");

    constructor(public readonly rawValue: string) {
    }

    public static readonly allCases = [BlackjackCard_Suit.spades, BlackjackCard_Suit.hearts, BlackjackCard_Suit.diamonds, BlackjackCard_Suit.clubs] as const;
}

class BlackjackCard_Rank {
    [cloneable]() {
        return new BlackjackCard_Rank(this.rawValue)
    }

    /** @ts-ignore */
    get values() {
        switch (this) {
            case BlackjackCard_Rank.ace: return new BlackjackCard_Rank_Values({ first: 1, second: 11 }); break;
            case BlackjackCard_Rank.jack: case BlackjackCard_Rank.queen: case BlackjackCard_Rank.king: return new BlackjackCard_Rank_Values({ first: 10, second: undefined }); break;
            default: return new BlackjackCard_Rank_Values({ first: this.rawValue, second: undefined }); break;
        }
    }

    public static readonly two = new BlackjackCard_Rank(2);
    public static readonly three = new BlackjackCard_Rank(3);
    public static readonly four = new BlackjackCard_Rank(4);
    public static readonly five = new BlackjackCard_Rank(5);
    public static readonly six = new BlackjackCard_Rank(6);
    public static readonly seven = new BlackjackCard_Rank(7);
    public static readonly eight = new BlackjackCard_Rank(8);
    public static readonly nine = new BlackjackCard_Rank(9);
    public static readonly ten = new BlackjackCard_Rank(10);
    public static readonly jack = new BlackjackCard_Rank(11);
    public static readonly queen = new BlackjackCard_Rank(12);
    public static readonly king = new BlackjackCard_Rank(13);
    public static readonly ace = new BlackjackCard_Rank(14);

    constructor(public readonly rawValue: number) {
    }

    public static readonly allCases = [BlackjackCard_Rank.two, BlackjackCard_Rank.three, BlackjackCard_Rank.four, BlackjackCard_Rank.five, BlackjackCard_Rank.six, BlackjackCard_Rank.seven, BlackjackCard_Rank.eight, BlackjackCard_Rank.nine, BlackjackCard_Rank.ten, BlackjackCard_Rank.jack, BlackjackCard_Rank.queen, BlackjackCard_Rank.king, BlackjackCard_Rank.ace] as const;
}

class BlackjackCard_Rank_Values {
    [cloneable]() {
        return new BlackjackCard_Rank_Values(this);
    }

    readonly first: number;
    readonly second?: number;

    constructor(param: { first: number, second?: number });
    constructor(param?: BlackjackCard_Rank_Values);
    constructor(..._args: any[]) {

        const { first, second } = _args[1];
        this.first = first;
        if (second !== undefined) this.second = second;
        if (_args[0] instanceof BlackjackCard_Rank_Values) Object.assign(this, _args[0])
    }
}

`

exports[`test/transpile.test.ts TAP > must match snapshot 7`] = `
let output = "suit"
let second;
if ((second = rank.values.second) != null) {
    output += \` or \${second}\`
}

`

exports[`test/transpile.test.ts TAP > must match snapshot 8`] = `
const decimalInteger = 17
const binaryInteger = 0b10001
// 17 in binary notation
const octalInteger = 0o21
// 17 in octal notation
const hexadecimalInteger = 0x11

`

exports[`test/transpile.test.ts TAP > must match snapshot 9`] = `
import { tuple } from "@tswift/util";
const http200Status = tuple(["statusCode", 200], ["description", "OK"])
const http404Error = tuple([undefined, 404], [undefined, "Not Found"])
const (statusCode, statusMessage) = http404Error

`
