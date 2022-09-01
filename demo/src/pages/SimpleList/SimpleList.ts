//https://developer.apple.com/documentation/swiftui/list/

import {
  Bound,
  EditButton,
  ID,
  Hashable,
  Identifiable,
  List,
  NavigationView,
  Set,
  State,
  swifty,
  Text,
  UUID,
  Viewable,
  CountSet,
} from "@tswift/ui";
import { run } from "../../run";
import Png from "./SimpleList.png";

const Ocean = swifty(
  class implements Identifiable, Hashable {
    constructor(public name: string, public id = UUID()) {}
  }
);

type OceanType = ReturnType<typeof Ocean>;

export class SimpleList extends Viewable {
  oceans: OceanType[] = [
    Ocean("Pacific"),
    Ocean("Atlantic"),
    Ocean("Indian"),
    Ocean("Southern"),
    Ocean("Arctic"),
  ];

  @State multiSelection: CountSet<string> = Set<string>();

  body = (_, { oceans }: this) => List(oceans, ($0) => Text($0.name));
}
