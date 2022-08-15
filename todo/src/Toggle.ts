import { Viewable } from "./View";
import { swifty } from "./utilit";
import { Bindable, Bool } from "./types";

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
    
