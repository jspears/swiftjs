import { Bool } from "./types";
import { swifty } from "./utilit";

export class FillStyleClass {
    constructor(public isEOFilled:Bool, public  isAntialiased: Bool){

    }
}
export type FillStyleType = typeof FillStyleClass;
export const FillStyle = swifty(FillStyleClass);