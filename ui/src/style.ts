import { Dot } from "@jswift/util";

export enum RoundedCornerStyle {
    circular,
    continuous
}
export type RoundedCornerStyleKey = RoundedCornerStyle | Dot<keyof typeof RoundedCornerStyle>