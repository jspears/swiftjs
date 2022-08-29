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
  constructor(public readonly value: string | RGB | HSL) {}
  static black = new Color('black');
  static blue = new Color('blue');
  static brown = new Color('brown');
  static clear = new Color('clear');
  static cyan = new Color('cyan');
  static gray = new Color('gray');
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

  toString() {
    return this.value + '';
  }
  opacity(opacity: number): this {
    return this;
  }
  shadow(def: { color: ColorKey; radius: Num; x: Num; y: Num }) {
    return this;
  }
}

export type ColorKey = KeyOf<typeof Color>;
