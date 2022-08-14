import { Viewable } from "./View";
import { swifty } from "./utilit";
import { Bindable, Bound } from "./types";

export interface TextFieldConfig {
    label:string;
    text:Bindable<string> | string
}

class TextFieldClass extends Viewable<TextFieldConfig> {
    focused(focus?:boolean|Bindable<boolean>):this{
        return this;
    }
    submitLabel(key:string){
        return this
    }
    onSubmit(fn:()=>unknown) {
        return this;
    }
}
export const TextField = swifty(TextFieldClass);    
    
