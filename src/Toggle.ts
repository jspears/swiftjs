import { Viewable } from "./View";
import { swifty } from "./utilit";

export interface ToggleConfig {
    isOn?:boolean;
}
class ToggleClass extends Viewable<ToggleConfig> {
    public toggle(){}
}
export const Toggle = swifty(ToggleClass);    
    
