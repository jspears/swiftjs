import { Identifiable } from "@tswift/util";
import type { View } from "../View";


export function dataToView<T extends Identifiable>(data: T[], content: (v: T) => View, parent?:View){
    return data.map( (datum) => {
        const v = content(datum);
        v.id = datum.id;
        v.parent = parent;
        return v;
    });
}