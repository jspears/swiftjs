/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/transpile.test.ts TAP > snapshots 1`] = `
interface TestInferredPropConstructor {
}

export class TestInferredProp {
    private readonly stuff: number = 0;

    constructor(param?: TestInferredPropConstructor) {
        //assign params
        Object.assign(this, param);
    }
}

`

exports[`test/transpile.test.ts TAP > snapshots 2`] = `
import { View, State, Color, boolean, string } from "@tswift/ui";
//Animation Demo
interface AnimationDemoConstructor {
    angle?: number;
    color?: Color;
    isBold?: boolean;
    name?: string;
}

export class AnimationDemo extends View {
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
    readonly pi: string = 3.1456;
    readonly str: string;
    readonly i: number = 1;

    constructor(param?: AnimationDemoConstructor) {
        super()
        Object.assign(this, param);
    }
}

`

exports[`test/transpile.test.ts TAP > snapshots 3`] = `
interface PointConstructor {
    x?: string;
    y?: string;
}

import { string } from "@tswift/ui";

export class Point {
    x: string = 0.0;
    y: string = 0.0;

    constructor(param?: PointConstructor) {
        //assign params
        Object.assign(this, param);
    }
}

interface SizeConstructor {
    width?: string;
    height?: string;
}

export class Size {
    width: string = 0.0;
    height: string = 0.0;

    constructor(param?: SizeConstructor) {
        //assign params
        Object.assign(this, param);
    }
}

interface RectConstructor {
    origin?: Point;
    size?: Size;
}

export class Rect {
    origin = new Point( );
    size = new Size( );

    get center(): Point {
        const centerX = this.origin.x + ( this.size.width / 2 )
        const centerY = this.origin.y + ( this.size.height / 2 )
        return new Point( x : centerX , y : centerY )
    }

    set center(newCenter: Point): void {
        this.origin.x = newCenter.x - ( this.size.width / 2 )
        this.origin.y = newCenter.y - ( this.size.height / 2 )
    }

    constructor(param?: RectConstructor) {
        //assign params
        Object.assign(this, param);
    }
}

`

exports[`test/transpile.test.ts TAP > snapshots 4`] = `
interface PointConstructor {
    x?: string;
    y?: string;
}

import { string } from "@tswift/ui";

export class Point {
    x: string = 0.0;
    y: string = 0.0;

    constructor(param?: PointConstructor) {
        //assign params
        Object.assign(this, param);
    }
}
const p = new Point({x:1,y:2})

`

exports[`test/transpile.test.ts TAP > snapshots 5`] = `
import { initIfMatching } from "@tswift/util";

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

exports[`test/transpile.test.ts TAP > snapshots 6`] = `
import { Array } from "@tswift/util";

interface StackConstructor<Element> {
    items?: Array;
}

import { Array } from "@tswift/ui";

export class Stack<Element> {
    items: Array<Element> = [];

    push({_:item}: {_:Element}) {
        this.items.append( item )
    }

    pop(): Element {
        return this.items.removeLast( )
    }

    constructor(param?: StackConstructor<Element>) {
        //assign params
        Object.assign(this, param);
    }
}

`

exports[`test/transpile.test.ts TAP > snapshots 7`] = `
interface CuboidConstructor {
    width?: string;
    height?: string;
    depth?: string;
}

import { string } from "@tswift/ui";

export class Cuboid {
    width: string = 0.0;
    height: string = 0.0;
    depth: string = 0.0;

    get volume() {
        return this.width * this.height * this.depth
    }

    constructor(param?: CuboidConstructor) {
        //assign params
        Object.assign(this, param);
    }
}
const fourByFiveByTwo = new Cuboid({width: 4.0,height: 5.0,depth: 2.0})

`

exports[`test/transpile.test.ts TAP > snapshots 8`] = `
import { willSet, didSet } from "@tswift/ui";

interface StepCounterConstructor {
    totalSteps?: number;
}

export class StepCounter {
    @willSet(function( newTotalSteps ) { print( \`About to set totalSteps to (newTotalSteps)\` ) })
    @didSet(function(oldValue){ if ( this.totalSteps > oldValue ){ print( \`Added (totalSteps - oldValue) steps\` ) } })
    totalSteps: number = 0;

    constructor(param?: StepCounterConstructor) {
        //assign params
        Object.assign(this, param);
    }
}
const stepCounter = new StepCounter({})

`

exports[`test/transpile.test.ts TAP > snapshots 9`] = `
interface CuboidConstructor {
    volume?: string;
}

import { string } from "@tswift/ui";

export class Cuboid {
    volume?: string = 0.0;

    constructor(param?: CuboidConstructor) {
        //assign params
        Object.assign(this, param);
    }
}

`
