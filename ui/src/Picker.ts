import { Content, View, Viewable } from "./View";
import { swifty } from "@jswift/util";
import { Bindable } from "@jswift/util";


export interface PickerConfig {
    selection: string | Bindable<string>;
    label: View | string | Content;
}

class PickerClass extends Viewable<PickerConfig> {
    selection: PickerConfig['selection'];
    label:PickerConfig['label'];
    constructor({ selection, label }: PickerConfig) {
        super();
        this.selection = selection;
        this.label = label;
    }
}
export const Picker = swifty(PickerClass);

