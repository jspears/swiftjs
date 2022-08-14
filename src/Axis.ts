import { Dot } from "./types";

export enum Axis {
    horizontal,
    vertical
}
export type AxisKey = Axis | Dot<keyof typeof Axis>;