import { Viewable } from './View';
import { swifty } from '@jswift/util';

export interface DatePickerConfig {}

class DatePickerClass extends Viewable<DatePickerConfig> {}
export const DatePicker = swifty(DatePickerClass);
