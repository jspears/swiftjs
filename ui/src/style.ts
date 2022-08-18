import { Dot } from '@tswift/util';

export enum RoundedCornerStyle {
  circular,
  continuous,
}
export type RoundedCornerStyleKey =
  | RoundedCornerStyle
  | Dot<keyof typeof RoundedCornerStyle>;
