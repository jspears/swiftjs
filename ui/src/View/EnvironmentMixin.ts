import { ObservableObject } from "@tswift/util";
import { View } from "./View";

export class EnvironmentMixin {
    _environmentObject?: ObservableObject;


    environmentObject(v: ObservableObject) {
        this._environmentObject = v;
    }
}
export const StateObject = (target:View, property:PropertyKey)=>{
    let value:ObservableObject | undefined = Reflect.getOwnPropertyDescriptor(target, property)?.value;
    if (value){
        (target as any).watch.set(property, value.objectWillChange);
        return;
    }
    Object.defineProperty(target, property, {
        set(v){
            value = v;
            this.watch.set(property, value?.objectWillChange);
        },
        get(){
            return value;
        }
    })
}
export const EnvironmentObject = (target: View, property: PropertyKey) => {
    let value = Reflect.getOwnPropertyDescriptor(target, property)?.value;
    if (value){
        (target as any).watch.set(property, value.objectWillChange);
    }
    Object.defineProperty(target, property, {
        get() {
            if (value != null){
                return value;
            }
            let v:any = this;
            while (!('_environmentObject' in v) && v._environmentObject != null) {
                v = this.parent;
            }
            value = v._environmentObject;
            this.watch.set(property, value?.objectWillChange);

            return v?._environmentObject;
            
        },
        set(v: ObservableObject) {
            this._environmentObject = v;
        }
    })
}