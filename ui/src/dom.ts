import { View } from "./View";


export const toNode = (view?:View, ...views:View[])=>{
    if (views.length == 0){
        return view?.render?.();
    }
    return [view, ...views].map(v=>{
        const node = v?.render?.();
    })
}