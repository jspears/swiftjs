import { swifty } from '@jswift/util';

class MenuPickerStyleClass {}
export const MenuPickerStyle = swifty(MenuPickerStyleClass);

class DatePickerStyleClass {}
export const DatePickerStyle = swifty(DatePickerStyleClass);

export class PickerMixin {
  pickerStyle(style: MenuPickerStyleClass) {
    return this;
  }
  datePickerStyle(style: DatePickerStyleClass) {
    return this;
  }
}
