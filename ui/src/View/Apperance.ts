import type { ColorKey } from '../Color';
import type { AlignmentKey, VerticalEdge, VirticalEdgeSetKey } from '../Edge';
import { Shape } from '../Shape';
import type { Dot, KeyOf, KeyOfTypeWithType, Num } from '@tswift/util';
import { View } from './View';
import type { Content } from './View';
export interface Style {}

export enum ColorScheme {
  light,
  color,
}

export enum Visibility {
  automatic,
  hidden,
  visible,
}

export type VisibilityKey = Visibility | Dot<keyof typeof Visibility>;

export type ColorSchemeKey = ColorScheme | Dot<keyof typeof ColorScheme>;

class ToggleStyleClass {
  static checkbox = new ToggleStyleClass();
  static button = new ToggleStyleClass();
  static switcher = new ToggleStyleClass();
  static automatic = new ToggleStyleClass();
}

export class Apperance<S extends Style = Style> {
  color(c: ColorKey | undefined): this {
    return this;
  }

  accentColor(c: ColorKey): this {
    return this;
  }

  backgroundStyle(s: Style): this {
    return this;
  }

  foregroundStyle(s1: Style, s2: Style): this {
    return this;
  }

  foregroundColor(s?: ColorKey): this {
    return this;
  }

  tint(s: S | ColorKey): this {
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
    return this;
  }

  border(s: S, width?: Num) {
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
    content?: Content | { in: Shape } | View
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
