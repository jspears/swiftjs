import { Viewable } from "./View";
import { swifty } from "./utilit";
import { Dot } from "./types";

export enum RoundedCornerStyle {
    circular,
    continuous
}
type RoundedCornerStyleType = keyof typeof RoundedCornerStyle;

class CapsuleClass extends Viewable<RoundedCornerStyle> {
    constructor(opts:RoundedCornerStyle | Dot<RoundedCornerStyleType>, ...views:readonly Viewable<unknown>[]){
        super(typeof opts === 'string' ? RoundedCornerStyle[opts.slice(1) as RoundedCornerStyleType] : opts, ...views);
    }
}
export const Capsule = swifty(CapsuleClass);    
    
