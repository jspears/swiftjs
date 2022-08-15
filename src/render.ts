import { toNode } from "./dom";
import { View } from "./View";


export function render(node:HTMLElement | string, view:View):void {
   const root = typeof node === 'string' ? document.querySelector(node) : node;
    const viewNode = toNode(view);
    if (viewNode){
        root?.appendChild(viewNode);
    }    
}
