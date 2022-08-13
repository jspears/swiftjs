import { Viewable } from "./View";
import { swifty } from "./utilit";

export interface ButtonConfig {

}

class ButtonClass extends Viewable<ButtonConfig> {

}
export const Button = swifty(ButtonClass);    
    
