import { Dot } from "@jswift/util";

export enum Axis {
    horizontal,
    vertical
}
export type AxisKey = Axis | Dot<keyof typeof Axis>;