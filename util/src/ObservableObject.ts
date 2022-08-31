import { Bindable } from "./types";
import { watchable } from "./util";


export class ObservableObject {
    public objectWillChange = watchable(this);

}

export const Published = (target:{objectWillChange:Bindable<any>}, key: PropertyKey)=>{
    
    const opd = Reflect.getOwnPropertyDescriptor(target, key);
    let value = opd?.value;

    Reflect.defineProperty(target, key, {
        set(v) {
            this.objectWillChange(this);
            value = v;
        },
        get() {
            return value;
        }
    });
}