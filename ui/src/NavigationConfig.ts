import type { View } from './View';

class NavigationConfigClass {
  _toolbar: any[] = [];
  public navigationTitle?: string;
  toolbar(...views: View[]) {
    this._toolbar = views;
  }
}

export const NavigationConfig = new NavigationConfigClass();
