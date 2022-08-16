
export class View {

    children?:View[];

    render?():HTMLElement | DocumentFragment | Text | undefined {
        const frag = document.createDocumentFragment();
        if(this.children){
            this.children?.forEach(v=>{
                const child = v.render?.();
                child && frag.appendChild(child);
            });
            return frag
        }        
    }
}
export type Content = ()=>View;