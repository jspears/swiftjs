import { Viewable } from "./View";
import {  Bindable, Bool, swifty } from "@jswift/util";

export interface ToggleConfig {
    isOn?:boolean;
    $isOn?:Bindable<boolean>;
}
class ToggleClass extends Viewable<ToggleConfig> {
    toggle(v?:Bool){
        return this;
    }
}
export const Toggle = swifty(ToggleClass);    
    
