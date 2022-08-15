import { Dot } from "./types";

export enum Weight {
    black,bold, heavy, light, medium, regular, semibold, thin, ultralight
}

export enum Leading {
    standard,
    loose, 
    tight,
}

export class Font {
    public constructor() {

    }
    static $(key:Dot<keyof typeof Font>){

    }
    static get largeTitle() { return largeTitle }
    static get title() { return title }
    static get title2() { return title2 }
    static get title3() { return title3 }
    static get headline() { return headline }
    static get subheadline() { return subheadline }
    static get body() { return body }
    static get callout() { return callout }
    static get caption() { return caption }
    static get caption2() { return caption2 }
    static get footnote() { return footnote }
    bold():this {
        return this;
    }
    italic(): this {
        return this;
    }
    monospaced(): this {
        return this;
    }
    smallCaps(): this {
        return this;
    }
    lowercaseSmallCaps():this {
        return this;
    }
    uppercaseSmallCaps():this {
        return this;
    }

    weight(weight:WeightKey):this {
        return this;
    }
    leading(leading:LeadingKey):this {
        return this;
    }
}

export type LeadingKey = Leading| Dot<keyof typeof Leading>;
export type WeightKey = Weight | Dot<keyof typeof Weight>;
const largeTitle = new Font();
const title = new Font()
const title2 =new Font() 
const title3 =new Font()
const headline =new Font()
const subheadline = new Font()
const body = new Font()
const callout = new Font()
const caption = new Font()
const caption2 = new Font()
const footnote = new Font()

export type FontKey = Font | Dot<keyof typeof Font>;