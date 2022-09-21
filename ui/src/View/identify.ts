import { View } from "./View";

export const idFor = (view:View, idx:number = 0)=>{
    if (!view.parent){
        if (view.constructor?.name != 'App'){
            console.warn('there was no parent and it wasn not top level');
        }
    }
    return `${view.parent?._id||'root'}:${idx.toString(16)}`
}
