import { Viewable } from "./View";
import { swifty } from "@tswift/util";

export interface DatePickerConfig {}

class DatePickerClass extends Viewable<DatePickerConfig> {}
export const DatePicker = swifty(DatePickerClass);
