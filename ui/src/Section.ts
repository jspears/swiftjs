import { View, Viewable } from "./View";
import { swifty } from "./utilit";


class SectionClass extends Viewable {
    constructor(...views:View[]){
        super(...views);
    }
}
export const Section = swifty(SectionClass);    
    
