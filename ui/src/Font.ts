import { Dot, KeyOf, PickValue } from "@tswift/util";
import { CSSProperties } from "./types";
import { unitFor } from "./unit";
/*
font-family: -apple-system-body
font-family: -apple-system-headline
font-family: -apple-system-subheadline
font-family: -apple-system-caption1
font-family: -apple-system-caption2
font-family: -apple-system-footnote
font-family: -apple-system-short-body
font-family: -apple-system-short-headline
font-family: -apple-system-short-subheadline
font-family: -apple-system-short-caption1
font-family: -apple-system-short-footnote
font-family: -apple-system-tall-body
*/
export enum Weight {
  black = "900",
  bold = "700",
  heavy = "600",
  light = "300",
  medium = "500",
  regular = "400",
  semibold = "600",
  thin = "100",
  ultralight = "200",
}

export enum Leading {
  standard = "1",
  loose = "1.5",
  tight = ".75",
}

export type TextStyle = keyof PickValue<typeof Font, Font>;

export class Font {
  public readonly style: CSSProperties = {
    fontFamily: "system-ui",
    fontSize: unitFor(18),
    lineHeight: "1.2",
  };

  constructor(font?: Font | CSSProperties, css?: CSSProperties) {
    Object.assign(this.style, font instanceof Font ? font.style : font, css);
  }

  static largeTitle = new Font({ fontSize: unitFor(30), lineHeight: "1.2" });
  static title = new Font({ fontSize: unitFor(26) });
  static title2 = new Font({ fontSize: unitFor(18), lineHeight: "1.6" });
  static title3 = new Font({ fontSize: unitFor(18) });
  static headline = new Font({ fontSize: unitFor(16), lineHeight: "1.6" });
  static subheadline = new Font({ fontSize: unitFor(14) });
  static body = new Font({ fontSize: unitFor(16), lineHeight: "1.2" });
  static callout = new Font({ fontSize: unitFor(16) });
  static caption = new Font({ fontSize: unitFor(12) });
  static caption2 = new Font({ fontSize: unitFor(20) });
  static footnote = new Font({ fontSize: unitFor(20) });
  private apply(css: CSSProperties) {
    return new Font(this, css);
  }
  bold() {
    return this.apply({ fontWeight: "600" });
  }
  italic() {
    return this.apply({ fontStyle: "italic" });
  }
  monospaced() {
    return this.apply({ fontFamily: "ui-monospace" });
  }
  smallCaps() {
    return this.apply({ fontVariant: "small-caps" });
  }
  lowercaseSmallCaps() {
    return this.apply({
      fontVariantCaps: "all-small-caps",
      textTransform: "lowercase",
    });
  }
  uppercaseSmallCaps() {
    return this.apply({
      fontVariantCaps: "all-small-caps",
      textTransform: "uppercase",
    });
  }
  strikethrough() {
    return this.apply({ fontStyle: "strikethrough" });
  }
  weight(weight: WeightKey) {
    return this.apply({
      fontWeight: Weight[weight.slice(1) as keyof typeof Weight] || weight,
    });
  }
  leading(leading: LeadingKey) {
    return this.apply({
      lineHeight: Leading[leading.slice(1) as keyof typeof Leading] || leading,
    });
  }
  underline() {
    return this.apply({
      textDecoration: "underline",
    });
  }
}

export type LeadingKey = Leading | Dot<keyof typeof Leading>;
export type WeightKey = Weight | Dot<keyof typeof Weight>;

export type FontKey = KeyOf<typeof Font>;
