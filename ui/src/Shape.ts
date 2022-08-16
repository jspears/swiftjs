import { Num, Size } from "@jswift/util";
import { swifty } from "@jswift/util";
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
export type ShapeType = InstanceType<typeof Shape>;
export const Circle = swifty(Shape);
export const Ellipse = swifty(Shape);
export const Capsule = swifty(Shape<RoundedRectangleConfig>);

export const Rectangle = swifty(Shape);
export const RoundedRectangle = swifty(Shape<RoundedRectangleConfig>);
