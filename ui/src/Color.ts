import { Dot, Num } from "@jswift/util";
import { swifty } from "@jswift/util";

type RGB = { red: number; blue: number; green: number; opacity?: number };
type HSL = {
  hue: number;
  saturation: number;
  brightness: number;
  opacity?: number;
};

export class Color {
  constructor(name: string | RGB | HSL) {}
  static get black() {
    return black;
  }
  static get blue() {
    return blue;
  }
  static get brown() {
    return brown;
  }
  static get clear() {
    return clear;
  }
  static get cyan() {
    return cyan;
  }
  static get gray() {
    return gray;
  }
  static get green() {
    return green;
  }
  static get indigo() {
    return indigo;
  }
  static get mint() {
    return mint;
  }
  static get orange() {
    return orange;
  }
  static get pink() {
    return pink;
  }
  static get purple() {
    return purple;
  }
  static get red() {
    return red;
  }
  static get teal() {
    return teal;
  }
  static get white() {
    return white;
  }
  static get yellow() {
    return yellow;
  }
  static get accentColor() {
    return blue;
  }
  static get primary() {
    return black;
  }
  static get secondary() {
    return gray;
  }
  opacity(opacity: number): this {
    return this;
  }
  shadow(def: { color: ColorKey; radius: Num; x: Num; y: Num }) {
    return this;
  }
}

const black = new Color("black");
const blue = new Color("blue");
const brown = new Color("brown");
const clear = new Color("clear");
const cyan = new Color("cyan");
const gray = new Color("gray");
const green = new Color("green");
const indigo = new Color("indigo");
const mint = new Color("mint");
const orange = new Color("orange");
const pink = new Color("pink");
const purple = new Color("purple");
const red = new Color("red");
const teal = new Color("teal");
const white = new Color("white");
const yellow = new Color("yellow");

export type ColorKey = Color | Dot<keyof typeof Color>;
