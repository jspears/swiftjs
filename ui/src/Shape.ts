import { Num, Size } from "@tswift/util";
import { swifty } from "@tswift/util";
import { h } from "preact";
import { RoundedCornerStyleKey } from "./style";
import { View, Viewable } from "./View";
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

export class Shape<T = unknown> extends Viewable<T> {
  constructor(t?: T) {
    super(t);
  }
}

export const Circle = swifty(class Circle extends Shape {
  render(){
    //<svg height="100" width="100">
//  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
//  </svg>
    return h('svg', {style:this.asStyle()}, h('circle', {cx:50, cy:50, r:40, fill:'red'}));
  }
});
export const Ellipse = swifty(Shape);
export const Capsule = swifty(Shape<RoundedRectangleConfig>);

export const Rectangle = swifty(Shape);
export const RoundedRectangle = swifty(Shape<RoundedRectangleConfig>);
