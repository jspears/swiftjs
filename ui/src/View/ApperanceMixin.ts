import { Color } from "../Color";
import type { ColorKey } from "../Color";
import { Alignment, AlignmentKey, AlignmentType } from "../Edge";
import { fromKey, KeyOf, Num } from "@tswift/util";
import { View } from "./View";
import type { Content } from "./View";
import type { ShapeStyle } from "../ShapeStyle";
import { CSSProperties } from "../types";
import { Inherit } from "../Inherit";
import { ColorScheme } from "./ColorScheme";
import { isAlignmentKey, isColorKey, isView } from "../guards";
import { unitFor } from "../unit";
import { ToggleStyle } from "./ToggleStyle";
import { HasFill } from "./types";

export class Visibility {
  static readonly automatic = new Visibility("automatic");
  static readonly hidden = new Visibility("hidden");
  static readonly visible = new Visibility("visible");
  constructor(public name: string) {}
}

export type VisibilityKey = KeyOf<typeof Visibility>;

export type ColorSchemeKey = KeyOf<typeof ColorScheme>;

export class ApperanceMixin<S extends ShapeStyle = ShapeStyle> {
  _style: CSSProperties = {};
  protected _border?: CSSProperties;
  @Inherit
  _color?: Color;
  @Inherit
  _accentColor?: Color;
  @Inherit
  _foregroundColor?: Color;
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
  _shadow?: { color: ColorKey; radius: string; x: string; y: string };
  _zIndex?: Num;
  _fixedSize?: { horizontal?: boolean; vertical?: boolean };
  _backgroundView?: string | Color | View;
  _backgroundAlignnment?: AlignmentType;
  _opacity?: number;
  _toggleStyle?: ToggleStyle;

  toCSS(): CSSProperties {
    const ret: CSSProperties = {};

    return ret;
  }
  color(c?: ColorKey | undefined): this {
    if (c) {
      this._color = fromKey(Color, c);
    }
    return this;
  }

  accentColor(c?: ColorKey): this {
    if (c) {
      this._accentColor = fromKey(Color, c);
    }
    return this;
  }

  backgroundStyle(fill: HasFill | ColorKey) {
    if (isColorKey(fill)) {
      fill = fromKey(Color, fill);
    }
    if (!this._style) {
      this._style = {};
    }
    this._style.backgroundImage = fill.toFill();
    this._style.backgroundRepeat = "no-repeat";
    this._style.backgroundPosition = "center";

    return this;
  }

  foregroundStyle(fill: HasFill | ColorKey) {
    if (isColorKey(fill)) {
      fill = fromKey(Color, fill);
    }
    if (!this._style) {
      this._style = {};
    }
    this._style.backgroundImage = fill.toFill();
    this._style.backgroundClip = "text";
    this._style["-webkit-background-clip" as keyof CSSProperties] = "text";
    this._style.color = "transparent";
    return this;
  }

  foregroundColor(c?: ColorKey): this {
    this._foregroundColor = fromKey(Color, c);
    return this;
  }

  tint(c: S | ColorKey): this {
    this._tint = typeof c === "string" ? Color[c.slice(1) as keyof typeof Color] : c instanceof Color ? c : undefined;
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
    this._border.boxShadow = `0 0 0 ${unitFor(width)} ${c} inset`;
    return this;
  }

  opacity(num: Num) {
    if (typeof num === "number") {
      this._opacity = num;
    }
    return this;
  }

  background(alignment: AlignmentKey | ColorKey | View, content?: ShapeStyle): this {
    if (isView(alignment)) {
      this._backgroundView = alignment;
    } else if (isAlignmentKey(alignment)) {
      this._backgroundAlignnment = fromKey(Alignment, alignment);
    } else if (isColorKey(alignment)) {
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

  shadow({ color, x, y, radius, ...rest }: { color: ColorKey; radius: Num; x: Num; y: Num }) {
    this._shadow = {
      color: fromKey(Color, color),
      x: x == 0 ? "0rem" : unitFor(x),
      y: y == 0 ? "0rem" : unitFor(y),
      radius: unitFor(radius),
      ...rest,
    };
    return this;
  }

  zIndex(num: Num) {
    this._zIndex = num;
    return this;
  }

  toggleStyle(style: KeyOf<typeof ToggleStyle>) {
    this._toggleStyle = fromKey(ToggleStyle, style);
    return this;
  }

  fixedSize(horizontal?: boolean | ".horizontal" | ".vertical", vertical?: boolean) {
    if (typeof vertical === "boolean" && typeof horizontal === "boolean") {
      this._fixedSize = {
        vertical,
        horizontal,
      };
    }
    if (horizontal != null) {
      if (!this._fixedSize) {
        this._fixedSize = {};
      }
      if (typeof horizontal === "string") {
        Object.assign(this._fixedSize, dotToProp(true, horizontal));
      } else {
        Object.assign(this._fixedSize, dotToProp(horizontal, ".vertical", ".horizontal"));
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
type DotToProp<K extends string[], V> = K extends [infer First extends string, ...infer Rest extends string[]]
  ? First extends `.${infer K extends string}`
    ? { [k in K]: V } & DotToProp<Rest, V>
    : {}
  : {};

const dotToProp = <V, K extends string[] = string[]>(v: V, ...args: K): DotToProp<K, V> => {
  return args.reduce((ret, k) => {
    ret[k.slice(1)] = v;
    return ret;
  }, {} as any);
};
export const v = dotToProp(true, ".vertical", ".horizontal");
