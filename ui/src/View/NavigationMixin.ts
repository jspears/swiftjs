import type { Bindable } from "@tswift/util";
import type { Content, View } from "./View";
import { NavigationConfig } from "../NavigationConfig";

export class NavigationMixin {
  sheet(opts: {
    isPresented: Bindable<boolean>;
    onDismiss(): void;
    content: Content;
  }) {
    return this;
  }
  navigationTitle(label: string) {
    NavigationConfig.navigationTitle = label;
    return this;
  }
  // toolbar(id: string, content?: Content): this;
  // toolbar(content?: Content): this;
  // toolbar(id?: string | Content, content?: Content) {
  //   return this;
  // }
  toolbar(...views: View[]) {
    NavigationConfig.toolbar(...views);
    return this;
  }
  navigationBarItems(items: { leading?: View; trailing?: View }) {
    return this;
  }
}
