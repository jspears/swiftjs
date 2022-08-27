import { Color } from '../Color';
import type { ColorKey } from '../Color';
import type {
  AlignmentKey,
  EdgeKey,
  VerticalEdge,
  VirticalEdgeSetKey,
} from '../Edge';
import { Shape } from '../Shape';
import {
  Dot,
  fromEnum,
  fromKey,
  KeyOf,
  KeyOfTypeWithType,
  Num,
} from '@tswift/util';
import { View } from './View';
import type { Content } from './View';
import type { ShapeStyle } from '../ShapeStyle';
import { CSSProperties } from '../types';

export class ColorScheme {
  static readonly light = new ColorScheme('light');
  static readonly color = new ColorScheme('color');
  constructor(public name: string) {}
}

export class Visibility {
  static readonly automatic = new Visibility('automatic');
  static readonly hidden = new Visibility('hidden');
  static readonly visible = new Visibility('visible');
  constructor(public name: string) {}
}

export type VisibilityKey = KeyOf<typeof Visibility>;

export type ColorSchemeKey = KeyOf<typeof ColorScheme>;

class ToggleStyleClass {
  static checkbox = new ToggleStyleClass('checkbox');
  static button = new ToggleStyleClass('button');
  static switcher = new ToggleStyleClass('switcher');
  static automatic = new ToggleStyleClass('automatic');
  constructor(protected name: string) {}
}

export class ApperanceMixin<S extends ShapeStyle = ShapeStyle> {
  protected _border?: CSSProperties;
  protected _color?: Color;
  protected _accentColor?: Color;
  protected _foregroundColor?: Color;
  protected _listRowTint?: [Color, VirticalEdgeSetKey?];
  protected _listSectionSeperatorTint?: [Color, VirticalEdgeSetKey?];
  protected _tint?: Color;
  protected _colorScheme?: ColorScheme;

  color(c?: ColorKey | undefined): this {
    this._color =
      typeof c === 'string' ? Color[c.slice(1) as keyof typeof Color] : c;
    return this;
  }

  accentColor(c?: ColorKey): this {
    this._accentColor =
      typeof c === 'string' ? Color[c.slice(1) as keyof typeof Color] : c;
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
    alignment: AlignmentKey | ColorKey | string | View,
    content?: ShapeStyle
  ): this {
    return this;
  }

  hidden() {
    return this;
  }

  labelsHidden() {
    return this;
  }

  shadow(def: { color: ColorKey; radius: Num; x: Num; y: Num }) {
    return this;
  }

  zIndex(num: Num) {
    return this;
  }

  listRowSeparator(visibility: VisibilityKey, edges?: VerticalEdge[]) {
    return this;
  }

  toggleStyle(style: KeyOf<typeof ToggleStyleClass>) {
    return this;
  }

  fixedSize(e?: Partial<Fixed>): this;

  fixedSize(fixed?: boolean | Partial<Fixed>) {
    return this;
  }
}

interface Fixed {
  horizontal: boolean;
  vertical: boolean;
}
