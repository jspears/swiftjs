import { fromKey, Num, ReverseMap, Size } from "@tswift/util";
import { swifty } from "@tswift/util";
import { h, VNode } from "preact";
import { FillStyle, isGradient } from "./Gradient";
import { RoundedCornerStyleKey } from "./style";
import { View, Viewable } from "./View";
import render from "preact-render-to-string";
import { url } from "inspector";
import { CSSProperties } from "./types";
import { isNum, unitFor } from "./unit";
import { Color, ColorKey } from "./Color";
import { isColorKey } from "./guards";

export type RoundedRectangleConfig =
  | { style: RoundedCornerStyleKey }
  | (
      | {
          cornerRadius: Num;
        }
      | {
          cornerSize: Size;
        }
    );

type CGLineCap = "butt" | "round" | "square";
type CGLineJoin = "miter" | "round" | "bevel";
interface StrokeStyle {
  lineWidth?: Num;
  lineCap?: CGLineCap;
  lineJoin?: CGLineJoin;
  miterLimit?: Num;
  dash?: Num[];
  dashPhase?: Num;
}
const StrokeStyleMap = {
  lineWidth: "stroke-width",
  lineCap: "stroke-linecap",
  lineJoin: "stroke-linejoin",
  miterLimit: "stroke-miterlimit",
  dash: "stroke-dasharray",
  dashPhase: "stroke-dashoffset",
} as const;
type StrokeKeys = keyof ReverseMap<typeof StrokeStyleMap> | "stroke";

const strikeMap = (v: keyof StrokeStyle): StrokeKeys => {
  return StrokeStyleMap[v];
};
export class Shape<T = unknown> extends Viewable<T> implements FillStyle {
  _fill?: FillStyle;
  _stroke: Partial<{ [k in StrokeKeys]: string }> = {};
  constructor(t?: T) {
    super(t);
  }
  fill(fillStyle: FillStyle) {
    this._fill = fillStyle;
    return this;
  }
  stroke(v: Num | StrokeStyle | ColorKey, style?: StrokeStyle | Num) {
    if (isColorKey(v)) {
      this._stroke.stroke = fromKey(Color, v)?.toString();
    } else {
      style = v;
    }
    if (isNum(style)) {
      this._stroke["stroke-width"] = unitFor(style);
    } else if (style) {
      Object.assign(
        this._stroke,
        Object.entries(style).reduce((ret, [k, val]) => {
          ret[strikeMap(k as any)] = val + "";
          return ret;
        }, {} as any)
      );
    }
    return this;
  }
  toDataURI() {
    const svg = render(this.render());
    return `data:image/svg+xml;utf-8,${escape(svg)}`;
  }

  toFill() {
    return `url('${this.toDataURI()}')`;
  }
}

export const Circle = swifty(
  class Circle extends Shape {
    render() {
      let fill = this._fill?.toFill();
      let defs: VNode<any> | undefined;
      if (isGradient(this._fill)) {
        fill = `url(#${this._fill.id})`;
        defs = h("defs", {}, this._fill.toSVGGradient());
      }

      return h(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          version: "1.1",
          viewBox: "0 0 100 100",
          style: this.asStyle({ width: "100%" }),
        },
        defs,
        h("circle", { cx: 50, cy: 50, r: 50, fill, ...this._stroke }, [])
      );
    }
  }
);
export const Ellipse = swifty(Shape);
export const Capsule = swifty(Shape<RoundedRectangleConfig>);

export const Rectangle = swifty(
  class Rectangle extends Shape {
    render() {
      let fill = this._fill?.toFill();
      let defs: VNode<any> | undefined;
      if (isGradient(this._fill)) {
        fill = `url(#${this._fill.id})`;
        defs = h("defs", {}, this._fill.toSVGGradient());
      }

      return h(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          version: "1.1",
          viewBox: "0 0 100 100",
          style: this.asStyle({ width: "100%" }),
        },
        defs,
        h("rect", { height: 100, width: 100, fill, ...this._stroke }, [])
      );
    }
  }
);

interface ViewableClass {
  Rectangle: typeof Rectangle;
}

export const RoundedRectangle = swifty(Shape<RoundedRectangleConfig>);
