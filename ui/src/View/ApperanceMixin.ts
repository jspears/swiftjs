import { Color } from '../Color';
import type { ColorKey } from '../Color';
import type {
  AlignmentKey,
  EdgeSet,
  VerticalEdge,
  VirticalEdgeSetKey,
} from '../Edge';
import {
  fromKey,
  KeyOf,
  Num,
} from '@tswift/util';
import { View } from './View';
import type { Content } from './View';
import type { ShapeStyle } from '../ShapeStyle';
import { CSSProperties } from '../types';
import { Inherit } from '../Inherit';

export class ColorScheme {
  static readonly light = new ColorScheme('light');
  static readonly color = new ColorScheme('color');
  constructor(public name: string) { }
}

export class Visibility {
  static readonly automatic = new Visibility('automatic');
  static readonly hidden = new Visibility('hidden');
  static readonly visible = new Visibility('visible');
  constructor(public name: string) { }
}

export type VisibilityKey = KeyOf<typeof Visibility>;

export type ColorSchemeKey = KeyOf<typeof ColorScheme>;

class ToggleStyleClass {
  static checkbox = new ToggleStyleClass('checkbox');
  static button = new ToggleStyleClass('button');
  static switcher = new ToggleStyleClass('switcher');
  static automatic = new ToggleStyleClass('automatic');
  constructor(protected name: string) { }
}

export class ApperanceMixin<S extends ShapeStyle = ShapeStyle> {
  protected _border?: CSSProperties;
  @Inherit
  _color?: Color;
  @Inherit
  _accentColor?: Color;
  @Inherit
  _foregroundColor?: Color;
  @Inherit
  _listRowTint?: [Color, EdgeSet?];
  @Inherit
  _listSectionSeperatorTint?: {color:Color, edges?:VirticalEdgeSetKey};
  @Inherit
  _tint?: Color;
  @Inherit
  _colorScheme?: ColorScheme;
  @Inherit
  _backgroundColor?: Color;
  @Inherit
  _hidden?: boolean;
  @Inherit
  _labelsHidden?: boolean;
  _shadow?: { color: ColorKey; radius: Num; x: Num; y: Num; };
  _zIndex?: Num;
  @Inherit
  _listRowSeparator?: { visibility: Visibility; edges: VerticalEdge[] | undefined; };
  _fixedSize?: { horizontal?: boolean; vertical?: boolean; } 
 
  toCSS():CSSProperties {
    const ret:CSSProperties = {};

    return ret;
  }
  color(c?: ColorKey | undefined): this {
    if (c){
      this._color = fromKey(Color, c);
    }
    return this;
  }

  accentColor(c?: ColorKey): this {
    if(c){
    this._accentColor = fromKey(Color, c);
    }
    return this;
  }

  backgroundStyle(s: S): this {
    return this;
  }

  foregroundStyle(s1: S, s2: S): this {
    return this;
  }

  foregroundColor(c?: ColorKey): this {
    this._foregroundColor =
      typeof c === 'string' ? Color[c.slice(1) as keyof typeof Color] : c;
    return this;
  }

  tint(c: S | ColorKey): this {
    this._tint =
      typeof c === 'string'
        ? Color[c.slice(1) as keyof typeof Color]
        : c instanceof Color
          ? c
          : undefined;
    return this;
  }

  listRowSeperatorTint(color: ColorKey, edges?: VirticalEdgeSetKey): this {
    return this;
  }

  listSectionSeperatorTint(color?: ColorKey, edges?: VirticalEdgeSetKey): this {
    return this;
  }

  listItemTint(color?: ColorKey): this {
    return this;
  }

  preferredColorScheme(scheme?: ColorSchemeKey) {
    this._colorScheme = scheme ? fromKey(ColorScheme, scheme) : undefined;

    return this;
  }

  border(s: ColorKey, width?: Num) {
    const c = fromKey(Color, s);
    if (!this._border) {
      this._border = {};
    }
    this._border.boxShadow = `0 0 0 ${width}px ${c} inset`;
    return this;
  }

  opacity(num: Num) {
    return this;
  }

  overlay(alignment: AlignmentKey, content: Content | View) {
    return this;
  }

  background(
    alignment: AlignmentKey | ColorKey | View,
    content?: ShapeStyle
  ): this {
    if (typeof alignment === 'function' && alignment instanceof View){

    }else{
      this._backgroundColor = fromKey(Color, alignment);
    }
    return this;
  }

  hidden() {
    this._hidden = true;
    return this;
  }

  labelsHidden() {
    this._labelsHidden = true;
    return this;
  }

  shadow(def: { color: ColorKey; radius: Num; x: Num; y: Num }) {
    this._shadow = def;
    return this;
  }

  zIndex(num: Num) {
    this._zIndex = num;
    return this;
  }

  listRowSeparator(visibility: VisibilityKey, edges?: VerticalEdge[]) {
    this._listRowSeparator = { visibility: fromKey(Visibility, visibility), edges };
    return this;
  }

  toggleStyle(style: KeyOf<typeof ToggleStyleClass>) {
    return this;
  }


  fixedSize(fixed?: boolean | '.horizontal' | '.vertical') {
    if (fixed != null) {
      if (!this._fixedSize){
        this._fixedSize = {}
      }
      if (typeof fixed === 'string'){
        Object.assign(this._fixedSize, dotToProp(true, fixed));
      }else{
        Object.assign(this._fixedSize, dotToProp(fixed, '.vertical', '.horizontal'));
      }
    }
    return this;
  }
}

// const dotToProp = <T, K extends keyof T & string= keyof T & string, V extends T[K] = T[K]>( v:V, ...t:`.${K}`[]):{[B in K]:T[B]} => {
//   return t.reduce((ret, k)=>{
//     ret[k.slice(1)] = v;
//     return ret;
//   }, {} as any);
// }
type DotToProp<K extends string[], V> = K extends [infer First extends string, ...infer Rest extends string[] ] ? 
  First extends `.${infer K extends string}` ? {[k in K]:V} & DotToProp<Rest, V> : {} : {};

const dotToProp = <V, K extends string[] = string[]>(v:V, ...args:K):DotToProp<K,V>=>{
    return args.reduce((ret, k)=>{
    ret[k.slice(1)] = v;
    return ret;
  }, {} as any);
}
export const v = dotToProp(true, '.vertical', '.horizontal');
