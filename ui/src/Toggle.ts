import { Viewable } from './View/Viewable';
import { swifty } from '@jswift/util';
import { Bindable, Bool } from '@jswift/util';

export interface ToggleConfig {
    isOn?:boolean;
    $isOn?:Bindable<boolean>;
}

class ToggleClass extends Viewable<ToggleConfig> {
    
    toggle(v?:Bool):this{
        return this;
    }
}

export const Toggle = swifty(ToggleClass);    
    
