import { Bool } from "@jswift/util";
import { swifty } from "@jswift/util";

export class FillStyleClass {
    constructor(public isEOFilled:Bool, public  isAntialiased: Bool){

    }
}
export type FillStyleType = typeof FillStyleClass;
export const FillStyle = swifty(FillStyleClass);