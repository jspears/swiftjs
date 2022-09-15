import { Dot, fromKey, KeyOf } from "@tswift/util";
import { Angle } from "../unit";
import { swiftyKey } from "@tswift/util";
import { CSSProperties } from "../types";
class UnitPointClass {
  static zero = new UnitPointClass(0, 0);

  //middle points
  static leading = new UnitPointClass("left", "center");
  static center = new UnitPointClass("center", "center");
  static trailing = new UnitPointClass("right", "center");

  //top points
  static topLeading = new UnitPointClass("top", "left");
  static top = new UnitPointClass("top", "center");
  static topTrailing = new UnitPointClass("top", "right");

  //bottom
  static bottomLeading = new UnitPointClass("bottom", "left");
  static bottom = new UnitPointClass("bottom", "center");
  static bottomTrailing = new UnitPointClass("bottom", "right");

  toDeg(other: UnitPointClass) {
    const x1 = deg(this.x),
      y1 = deg(this.y),
      x2 = deg(other.x),
      y2 = deg(other.y);

    return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI + "deg";
  }
  toTranslate() {
    return `translate(${this.x}, ${this.y})`;
  }
  constructor(public x?: number | string, public y?: number | string) {}
}
const deg = (v: number | string | undefined): number => {
  if (typeof v === "number") {
    return v;
  }
  // to top, to bottom, to left, and to right
  //  0deg, 180deg, 270deg, and 90deg
  switch (v) {
    case "top":
      return 0;
    case "right":
      return 1;
    case "bottom":
      return 1;
    case "left":
      return 0;
    case "center":
      return 0.5;
  }
  return 0;
};
export const UnitPoint = swiftyKey(UnitPointClass);
export type UnitPointType = ReturnType<typeof UnitPoint>;

export type UnitPointKey = KeyOf<typeof UnitPointClass>;

export class TransformMixin {
 // _transforms: CSSProperties = {};
  _rotate?: [angle:Angle, point:UnitPointType];
  _scale?: number;

  get _transforms():CSSProperties{
    if (!this._rotate && !this._scale){
      return {};
    }
    const ret:CSSProperties = {};
    if(this._rotate){
      ret['transformOrigin'] = this._rotate[1].toTranslate();
      ret['transform'] = `rotate(${this._rotate[0]})`;
    }
    if (this._scale != null){
      ret['transform'] = `${ret['transform']||''} scale(${this._scale})`;

    }
    return ret;

  }
  rotationEffect(angle: Angle, point: UnitPointKey = UnitPoint.zero) {
    this._rotate = [angle, UnitPoint.fromKey(point)]
    return this;
  }

  scaleEffect(num: number) {
    this._scale = num;
    return this;
  }
}
