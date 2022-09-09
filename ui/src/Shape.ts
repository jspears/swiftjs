import { Num, Size } from "@tswift/util";
import { swifty } from "@tswift/util";
import { h, VNode } from "preact";
import { FillStyle, isGradient } from "./Gradient";
import { RoundedCornerStyleKey } from "./style";
import { View, Viewable } from "./View";
import render from "preact-render-to-string";
import { url } from "inspector";

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

export class Shape<T = unknown> extends Viewable<T> implements FillStyle {
  _fill?: FillStyle;
  constructor(t?: T) {
    super(t);
  }
  fill(fillStyle: FillStyle) {
    this._fill = fillStyle;
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
        h("circle", { cx: 50, cy: 50, r: 50, fill }, [])
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
        h("rect", { height: 100, width: 100, fill }, [])
      );
    }
  }
);

interface ViewableClass {
  Rectangle: typeof Rectangle;
}

export const RoundedRectangle = swifty(Shape<RoundedRectangleConfig>);
