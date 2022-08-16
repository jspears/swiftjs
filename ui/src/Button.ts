import { Content, View, Viewable } from "./View";
import { swifty } from "@jswift/util";
import { Dot } from "@jswift/util";
export enum ButtonRole {
    cancel,
    destructive,
    none,
}
export interface ButtonConfig {
    role?:ButtonRole | Dot<keyof typeof ButtonRole>;
    action?():void;
    label?:Content | string | View;
    shape?:'.roundedRectangle';

    
}
export class ButtonStyleConfiguration {
    constructor(arg?:ButtonConfig){

    }
}

export const PlainButtonStyle = swifty(ButtonStyleConfiguration);
export const BorderedButtonStyle = swifty(ButtonStyleConfiguration);
export const PrimativeButtonStyle = swifty(ButtonStyleConfiguration);

class ButtonClass extends Viewable<ButtonConfig> {
    buttonStyle(style:ButtonStyleConfiguration){
        return this;
    }
    
}
export const Button = swifty(ButtonClass);    
    
