import { Num, Size } from "@tswift/util";
import { swifty } from "@tswift/util";
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

export const Circle = swifty(Shape);
export const Ellipse = swifty(Shape);
export const Capsule = swifty(Shape<RoundedRectangleConfig>);

export const Rectangle = swifty(Shape);
export const RoundedRectangle = swifty(Shape<RoundedRectangleConfig>);
