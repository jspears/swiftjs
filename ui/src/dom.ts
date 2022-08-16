import { View } from "./View";


export const toNode = (view?:View, ...views:View[]):HTMLElement | Text | DocumentFragment | undefined =>{
    if (views.length == 0){
        if (view){
            return view.render?.();
        }       
    }else{
        const frag = document.createDocumentFragment();
        [view, ...views].forEach(v=>{
            const child = v?.render?.();
            if(child){
                frag.appendChild(child);
            }
        })

        return frag;
    }


}