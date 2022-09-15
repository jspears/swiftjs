import { Bounds, has, KeyOf, ObservableObject } from "@tswift/util";
import { Color, ColorKey } from "./Color";
import { Alignment, AlignmentKey } from "./Edge";
import { View, ViewableClass } from "./View";
import { isInstanceOf, isKeyOf } from "@tswift/util";

export function isView(v: unknown): v is View {
  return isInstanceOf(v, View);
}

export function isAlignmentKey(v: unknown): v is AlignmentKey {
  return isKeyOf(v, Alignment);
}

export function isColorKey(v: unknown): v is ColorKey {
  return isKeyOf(v, Color);
}

export function isViewable(v: unknown): v is ViewableClass<unknown> {
  return isInstanceOf(v, ViewableClass<unknown>);
}

export function isBounds(v: unknown): v is Bounds {
  return (
    has(v, "width") ||
    has(v, "width") ||
    has("v", "maxHeight") ||
    has(v, "maxWidth")
  );
}
