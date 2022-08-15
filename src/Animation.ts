import {swifty} from './utilit';
import {Dot, KeyOfTypeWithType} from './types';

class AnimationClass {
    static get default(){
        return _default;
    }
    static get easeInOut(){
        return easeInOut;
    }
    static get easeIn(){
        return easeIn;
    }
    static get easeOut(){
        return easeOut;
    }
    static get linear(){
        return linear;
    }
}
export const Animation = swifty(AnimationClass);

const _default = Animation();
const easeInOut = Animation();
const linear = Animation();
const easeIn = Animation();
const easeOut = Animation();

export type AnimationType = typeof AnimationClass;

export type AnimationKey = AnimationType | Dot<Exclude<keyof AnimationType, 'prototype'>>;

type Callback = ()=>void;


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
