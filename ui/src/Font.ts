import { Dot, isKeyOf, fromKey, KeyOf, PickValue } from "@tswift/util";
import { CSSProperties } from "./types";
import { unitFor } from "./unit";

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
  static system(
    v:
      | number
      | FontConfig["weight"]
      | FontConfig["design"]
      | Partial<FontConfig>
  ) {
    const val =
      typeof v === "number"
        ? { size: v }
        : isKeyOf(v, Design)
        ? { design: v }
        : isKeyOf(v, Weight)
        ? { weight: v }
        : {};

    let ret: Font = Font.body;
    if (val.design) {
      const design = fromKey(Design, val.design);
      switch (design) {
        case Design.monospaced:
          ret = ret.monospaced();
          break;
      }
    }
    if (val.size != null) {
      ret = ret.apply({ fontSize: unitFor(val.size) });
    }
    if (val.weight) {
      ret = ret.weight(val.weight as WeightKey);
    }
    return ret;
  }
}
type FontConfig = {
  size: number;
  weight: WeightKey;
  design: DesignKey;
};
enum Design {
  default = "default",
  monospaced = "monospaced",
  rounded = "rounded",
  serif = "serif",
}
export type DesignKey = typeof Design | Dot<keyof typeof Design>;

export type LeadingKey = Leading | Dot<keyof typeof Leading>;
export type WeightKey = Weight | Dot<keyof typeof Weight>;

export type FontKey = KeyOf<Font>;
