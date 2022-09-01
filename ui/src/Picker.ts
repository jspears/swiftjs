import { View, Viewable } from "./View";
import type { Content } from "./View";
import { swifty } from "@tswift/util";
import type { Bindable } from "@tswift/util";

export interface PickerConfig {
  selection: string | Bindable<string>;
  label: View | string | Content;
}

class PickerClass extends Viewable<PickerConfig> {
  selection: PickerConfig["selection"];
  label: PickerConfig["label"];
  constructor({ selection, label }: PickerConfig) {
    super();
    this.selection = selection;
    this.label = label;
  }
}
export const Picker = swifty(PickerClass);
