import { Viewable } from "./View";
import { swifty } from "./utilit";

export interface PickerConfig {
    seletion:string;
    label:Viewable<unknown>;
}

class PickerClass extends Viewable<PickerConfig> {

}
export const Picker = swifty(PickerClass);    
    
