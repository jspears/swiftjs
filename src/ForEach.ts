import { Viewable } from "./View";

type ForEachFn<D> = (item:D, idx:number)=>Viewable<unknown>;

export type IndexSet = Set<number>;
export type OnDelete = (v:IndexSet)=>void;

class ForEachClass<I> extends Viewable<{}> {
    constructor(public data:I[], content:ForEachFn<I> ){
        super({},...data.map(content));
    }
    onDelete(fn:OnDelete):this{
        return this;
    }
}

export function ForEach<T>(...args:ConstructorParameters<typeof ForEachClass<T>>){
    return new ForEachClass(...args);
}  

Object.assign(ForEach, ForEach['prototype'])  
    
