//https://developer.apple.com/documentation/swiftui/list/

import {
  Hashable,
  Identifiable,
  List,
  swifty,
  Text,
  UUID,
  Viewable,
  CountSet,
  ListConfig,
} from "@tswift/ui";

const Ocean = swifty(
  class implements Identifiable, Hashable {
    constructor(public name: string, public id = UUID()) {}
  }
);

export class SimpleList extends Viewable {
  oceans = [
    Ocean("Pacific"),
    Ocean("Atlantic"),
    Ocean("Indian"),
    Ocean("Southern"),
    Ocean("Arctic"),
  ];

  body = List({
    data: this.oceans,
    content: ($0) => Text($0.name),
  } as ListConfig<ReturnType<typeof Ocean>>);
}
