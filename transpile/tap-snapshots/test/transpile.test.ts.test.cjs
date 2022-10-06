/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/transpile.test.ts TAP > must match snapshot 1`] = `
import { cloneable } from "@tswift/util";

interface TestInferredPropConstructor {
    stuff?: number;
}

export class TestInferredProp {
    [cloneable]() {
        return new TestInferredProp(this);
    }

    private readonly stuff: number = 0;

    constructor(param?: TestInferredPropConstructor) {
        //assign params
        if (param && ('stuff' in param) && param.stuff !== undefined) this.stuff = param?.stuff?.[cloneable]?.();
    }
}

`

exports[`test/transpile.test.ts TAP > must match snapshot 10`] = `
const names = [\`Chris\`,\`Alex\`,\`Ewa\`,\`Barry\`,\`Daniella\`]

export function backward(s1: string, s2: string): boolean {
    return s1 > s2
}
let reversedNames = names.sorted({by: backward})

`

exports[`test/transpile.test.ts TAP > must match snapshot 11`] = `
import { cloneable, Array } from "@tswift/util";

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

exports[`test/transpile.test.ts TAP > must match snapshot 12`] = `
import { cloneable, Array } from "@tswift/util";

export class Suit {
    [cloneable]() {
        return new Suit(this.rawValue)
    }

    public static readonly spades = new Suit(\`♠\`);
    public static readonly hearts = new Suit(\`♡\`);
    public static readonly diamonds = new Suit(\`♢\`);
    public static readonly clubs = new Suit(\`♣\`);

    constructor(public readonly rawValue: string) {
    }

    public static readonly allCases = [Suit.spades, Suit.hearts, Suit.diamonds, Suit.clubs] as const;
}

`

exports[`test/transpile.test.ts TAP > must match snapshot 13`] = `
import { cloneable, Array } from "@tswift/util";

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

exports[`test/transpile.test.ts TAP > must match snapshot 2`] = `
import { View, State, Color } from "@tswift/ui";
import { cloneable } from "@tswift/util";

//Animation Demo
interface AnimationDemoConstructor {
    angle?: number;
    color?: Color;
    isBold?: boolean;
    stuff?: number;
    name?: string;
    pi?: number;
    str: string;
    i?: number;
}

export class AnimationDemo extends View {
    [cloneable]() {
        return new AnimationDemo(this);
    }

    static foo: string = "foo-1";
    @State
    private angle: number = 0;
    @State
    private color: Color = Color.blue;
    @State
    private isBold: boolean = false;
    /** a comment here */
    private readonly stuff: number = 0;
    private name: string = "somestring";
    readonly pi: number = 3.1456;
    readonly str: string;
    readonly i: number = 1;

    constructor(param: AnimationDemoConstructor) {
        super()
        if (param && ('angle' in param) && param.angle !== undefined) this.angle = param.angle?.[cloneable]?.();
        if (param && ('color' in param) && param.color !== undefined) this.color = param.color?.[cloneable]?.();
        if (param && ('isBold' in param) && param.isBold !== undefined) this.isBold = param.isBold?.[cloneable]?.();
        if (param && ('stuff' in param) && param.stuff !== undefined) this.stuff = param.stuff?.[cloneable]?.();
        if (param && ('name' in param) && param.name !== undefined) this.name = param.name?.[cloneable]?.();
        if (param && ('pi' in param) && param.pi !== undefined) this.pi = param.pi?.[cloneable]?.();
        this.str = param.str?.[cloneable]?.();
        if (param && ('i' in param) && param.i !== undefined) this.i = param.i?.[cloneable]?.();
    }
}

`

exports[`test/transpile.test.ts TAP > must match snapshot 3`] = `
import { cloneable } from "@tswift/util";
import { any } from "@tswift/ui";

interface PointConstructor {
    x?: number;
    y?: number;
}

export class Point {
    [cloneable]() {
        return new Point(this);
    }

    x: number = 0.0;
    y: number = 0.0;

    constructor(param?: PointConstructor) {
        //assign params
        if (param && ('x' in param) && param.x !== undefined) this.x = param?.x?.[cloneable]?.();
        if (param && ('y' in param) && param.y !== undefined) this.y = param?.y?.[cloneable]?.();
    }
}

interface SizeConstructor {
    width?: number;
    height?: number;
}

interface RectConstructor {
    origin: any;
    size: any;
    center: Point;
}

export class Size {
    [cloneable]() {
        return new Size(this);
    }

    width: number = 0.0;
    height: number = 0.0;

    constructor(param?: SizeConstructor) {
        //assign params
        if (param && ('width' in param) && param.width !== undefined) this.width = param?.width?.[cloneable]?.();
        if (param && ('height' in param) && param.height !== undefined) this.height = param?.height?.[cloneable]?.();
    }
}

export class Rect {
    [cloneable]() {
        return new Rect(this);
    }

    origin;
    size;
    center: Point;

    constructor(param: RectConstructor) {
        //assign params
        this.origin = param.origin?.[cloneable]?.();
        this.size = param.size?.[cloneable]?.();
        this.center = param.center?.[cloneable]?.();
    }
}

`

exports[`test/transpile.test.ts TAP > must match snapshot 4`] = `
import { cloneable } from "@tswift/util";

interface PointConstructor {
    x?: number;
    y?: number;
}

export class Point {
    [cloneable]() {
        return new Point(this);
    }

    x: number = 0.0;
    y: number = 0.0;

    constructor(param?: PointConstructor) {
        //assign params
        if (param && ('x' in param) && param.x !== undefined) this.x = param?.x?.[cloneable]?.();
        if (param && ('y' in param) && param.y !== undefined) this.y = param?.y?.[cloneable]?.();
    }
}
const p = new Point({x:1,y:2})

`

exports[`test/transpile.test.ts TAP > must match snapshot 5`] = `
import { cloneable, initIfMatching } from "@tswift/util";

interface CelsiusConstructor {
    fromFahrenheit: number;
}

interface CelsiusConstructor$0 {
    fromKelvin: number;
}

interface CelsiusConstructor$1 {
    celsius?: number;
}

type CelsiusConstructor = CelsiusConstructor | CelsiusConstructor$0 | CelsiusConstructor$1;

export class Celsius {
    [cloneable]() {
        return new Celsius(this);
    }

    temperatureInCelsius: number;

    private init(fahrenheit: number) {
        this.temperatureInCelsius = ( fahrenheit - 32.0 ) / 1.8
    }

    private init$0(kelvin: number) {
        this.temperatureInCelsius = kelvin - 273.15
    }

    private init$1(celsius?: number) {
        this.temperatureInCelsius = celsius
    }

    constructor(param: CelsiusConstructor) {
        //pick the correct init
        initIfMatching(this, 'init', param, [{"name":"fromFahrenheit","internal":"fahrenheit","type":"number"}] ) || initIfMatching(this, 'init$0', param, [{"name":"fromKelvin","internal":"kelvin","type":"number"}] ) || initIfMatching(this, 'init$1', param, [{"name":"celsius","optional":true,"type":"number"}] )
    }
}
const boilingPointOfWater = new Celsius({fromFahrenheit: 212.0})

`

exports[`test/transpile.test.ts TAP > must match snapshot 6`] = `
import { cloneable, Array } from "@tswift/util";

interface StackConstructor<Element> {
    items?: Array;
}

import { Array } from "@tswift/ui";

export class Stack<Element> {
    [cloneable]() {
        return new Stack(this);
    }

    items: Array<Element> = [];

    push({_:item,}: {_:Element}) {
        ({item})
    }

    pop(): Element {
        return ({})
    }

    constructor(param?: StackConstructor<Element>) {
        //assign params
        if (param && ('items' in param) && param.items !== undefined) this.items = param?.items?.[cloneable]?.();
    }
}

`

exports[`test/transpile.test.ts TAP > must match snapshot 7`] = `
import { cloneable, Cache } from "@tswift/util";

interface CuboidConstructor {
    width?: number;
    height?: number;
    depth?: number;
}

export class Cuboid {
    [cloneable]() {
        return new Cuboid(this);
    }

    width: number = 0.0;
    height: number = 0.0;
    depth: number = 0.0;

    @Cache
    get volume() {
        return this.width * this.height * this.depth
    }

    constructor(param?: CuboidConstructor) {
        //assign params
        if (param && ('width' in param) && param.width !== undefined) this.width = param?.width?.[cloneable]?.();
        if (param && ('height' in param) && param.height !== undefined) this.height = param?.height?.[cloneable]?.();
        if (param && ('depth' in param) && param.depth !== undefined) this.depth = param?.depth?.[cloneable]?.();
    }
}
const fourByFiveByTwo = new Cuboid({width: 4.0,height: 5.0,depth: 2.0})

`

exports[`test/transpile.test.ts TAP > must match snapshot 8`] = `
interface StepCounterConstructor {
    totalSteps: number;
}

export class StepCounter {
    totalSteps: number;

    constructor(param: StepCounterConstructor) {
        //assign params
        this.totalSteps = param.totalSteps?.[cloneable]?.();
    }
}
const stepCounter = new StepCounter({})

`

exports[`test/transpile.test.ts TAP > must match snapshot 9`] = `
import { cloneable } from "@tswift/util";

interface CuboidConstructor {
    volume?: number;
}

export class Cuboid {
    [cloneable]() {
        return new Cuboid(this);
    }

    volume?: number = 0.0;

    constructor(param?: CuboidConstructor) {
        //assign params
        if (param && ('volume' in param) && param.volume !== undefined) this.volume = param?.volume?.[cloneable]?.();
    }
}

`
