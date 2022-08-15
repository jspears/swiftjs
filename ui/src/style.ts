import { Dot } from "./types";

export enum RoundedCornerStyle {
    circular,
    continuous
}
export type RoundedCornerStyleKey = RoundedCornerStyle | Dot<keyof typeof RoundedCornerStyle>