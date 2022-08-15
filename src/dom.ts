import { View } from "./View";


export const toNode = (view?:View, ...views:View[])=>{
    if (views.length == 0){
        return view?.render?.();
    }
    const frag = document.createDocumentFragment();
    [view, ...views].forEach(v=>{
        const node = v?.render?.();
        if (node){
            frag.appendChild(node);
        }
    })
    return frag;
}