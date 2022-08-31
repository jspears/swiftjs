import { Dot, fromKey, KeyOf, Num } from '@tswift/util';
import { swifty } from '@tswift/util';
import { ShapeStyle } from './ShapeStyle';

type RGB = { red: number; blue: number; green: number; opacity?: number };
type HSL = {
  hue: number;
  saturation: number;
  brightness: number;
  opacity?: number;
};

export class Color implements ShapeStyle {

  constructor(public readonly value: string | RGB | HSL, public _opacity:number = 1) {}
  static black = new Color('black');
  static blue = new Color('#007AFF');
  static brown = new Color('brown');
  static clear = new Color('unset');
  static cyan = new Color('cyan');
  static gray = new Color('rgb(239, 238, 245)');
  static green = new Color('green');
  static indigo = new Color('indigo');
  static mint = new Color('mint');
  static orange = new Color('orange');
  static pink = new Color('pink');
  static purple = new Color('rgb(175,82,222)');
  static red = new Color('red');
  static teal = new Color('teal');
  static white = new Color('white');
  static yellow = new Color('yellow');
  static accentColor: Color = Color.blue;
  static primary: Color = Color.black;
  static secondary: Color = Color.gray;
  //Not official
  static darkGray = new Color('#D1D1D6');

  toString() {
    return this.value + '';
  }
  opacity(opacity: number) {
    return new Color(this.value, opacity);
  }
  shadow(def: { color: ColorKey; radius: Num; x: Num; y: Num }) {
    return this;
  }
}

export type ColorKey = KeyOf<typeof Color>;
