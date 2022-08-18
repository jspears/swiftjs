import { Bindable, Bool, swifty, Viewable } from '@tswift/ui';

export interface ToggleConfig {
  isOn?: boolean;
  $isOn?: Bindable<boolean>;
}
class ToggleClass extends Viewable<ToggleConfig> {
  toggle(v?: Bool) {
    return this;
  }
}
export const Toggle = swifty(ToggleClass);
