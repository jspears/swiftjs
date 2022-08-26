import type { Bindable } from '@tswift/util';
import { View } from './View';
import type { Content } from './View';

export class NavigationMixin {
  protected _navigationTitle?:string;
  sheet(opts: {
    isPresented: Bindable<boolean>;
    onDismiss(): void;
    content: Content | View;
  }) {
    return this;
  }
  navigationTitle(label: string) {
    this._navigationTitle = label;
    return this;
  }
  navigationBarItems(items: { leading?: View; trailing?: View }) {
    return this;
  }
}
