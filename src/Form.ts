import { Viewable } from "./View";
import { swifty } from "./utilit";

export interface FormConfig {

}

class FormClass extends Viewable<FormConfig> {
    onSubmit(fn:()=>void):this {
        return this;
    }
}
export const Form = swifty(FormClass);    
    