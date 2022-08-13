import { swifty } from "./utilit"


export class Viewable<T=any> {
    constructor(opts?:T | Viewable<any>, ...views:Viewable<any>[]){
    }
    protected $ = <K extends keyof typeof this>(key:K):Binding<K>=>{
        console.log(key);
    
    }
}

class ViewClass extends Viewable<{}>{
    body?: ViewClass
   
}
export type Content = ()=>Viewable<unknown>;

export const View = swifty(ViewClass);