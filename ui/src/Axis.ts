import { Dot } from "@tswift/util";

export enum Axis {
  horizontal,
  vertical,
}
export type AxisKey = Axis | Dot<keyof typeof Axis>;
