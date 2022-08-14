import { Viewable } from "./View";
import { swifty } from "./utilit";
import { Bindable } from "./types";

export interface ToggleConfig {
    isOn?:boolean;
    $isOn?:Bindable<boolean>;
}
class ToggleClass extends Viewable<ToggleConfig> {
    public toggle(){}
}
export const Toggle = swifty(ToggleClass);    
    
