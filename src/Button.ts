import { Content, View, Viewable } from "./View";
import { swifty } from "./utilit";
export enum ButtonRole {
    cancel,
    destructive,

}
export interface ButtonConfig {
    role?:ButtonRole;
    action?():void;
    label?:Content | string | View;

    
}
export class ButtonStyleConfiguration {

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
    
