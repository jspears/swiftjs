import { AnimationKey } from "../Animation";
import { Bindable, Bool } from "../types";

export class AnimationMixin {
    animation<V>(type:AnimationKey, t?:Bindable<V> | V){
        return this;
    }
}