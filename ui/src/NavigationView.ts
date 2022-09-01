import { View, Viewable } from "./View";
import { Bindable, swifty } from "@tswift/util";
import { h, VNode } from "preact";
import { Text } from "./Text";
import { NavigationConfig } from "./NavigationConfig";
import { Font } from "./Font";
import { Color } from "./Color";
import { HStack } from "./Stack";

class NavigationViewClass extends Viewable {
  body = () => [
    HStack({ alignment: ".trailing" }, ...NavigationConfig._toolbar).padding(
      10
    ),
    Text(NavigationConfig.navigationTitle || "")
      .font(Font.title.bold())
      .padding(10)
      .background(".clear"),
    ...this.children,
  ];

  init() {
    this.background(Color.gray);
  }

  get _toolbar(): View[] {
    return NavigationConfig._toolbar || [];
  }

  render(): VNode {
    return h(
      "div",
      {
        style: this.asStyle({ flex: "1", width: "100%" }),
        id: "navigation",
      },
      super.render()
    );
  }
}
export const NavigationView = swifty(NavigationViewClass);
