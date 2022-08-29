import { Bindable } from "./types";
import { watchable } from "./util";

export const True = ()=>Bool(true);

export const False = ()=>Bool(false);

export type BoolType = Bindable <boolean> & {
    toggle():boolean;
    valueOf():boolean;
    readonly wrappedValue:boolean;
    random():boolean;
}   

export const Bool=((def:boolean | 'true' | 'false'):BoolType =>{
    const ret = watchable(typeof def === 'string' ? def === 'true' : def);
   
    return Object.assign(ret, {
        toggle(){
            return ret(!ret());
        },
        valueOf:ret,
        get wrappedValue(){
            return ret();
        },
        random(){
            return ret(Math.random() > .5);
        }
    }) as BoolType ;
});
