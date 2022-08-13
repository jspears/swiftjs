
export type Bindable<T> = (()=>T) &  {
    set(v:T | null):()=>void;
}