import { Viewable } from "./View"
import {swifty} from './utilit';
import {KeyOfTypeWithType} from './types';

class AnimationClass {
    static get default(){
        return _default;
    }
}
type Callback = ()=>void;
export const Animation = swifty(AnimationClass);
const _default = Animation();

export type AnimationType = typeof AnimationClass;

export type UseAnimation = KeyOfTypeWithType<typeof AnimationClass, AnimationClass>

export function withAnimation(result:Callback):void;
export function withAnimation(animation:UseAnimation | Callback, result?:Callback):void {
    if (!isAnimation(animation)){
        result = animation;
    }
    if(result){
        setTimeout(result,0);
    }
}

function isAnimation(v:unknown): v is AnimationClass {
    return v instanceof AnimationClass || (typeof v === 'string' && Object.hasOwnProperty.call(AnimationClass, v));
}
