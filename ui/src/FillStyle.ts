import { Bool } from '@tswift/util';
import { swifty } from '@tswift/util';

export class FillStyleClass {
  constructor(public isEOFilled: Bool, public isAntialiased: Bool) {}
}
export type FillStyleType = typeof FillStyleClass;
export const FillStyle = swifty(FillStyleClass);
