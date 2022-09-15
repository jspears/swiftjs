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
  VStack,
  main,
  SelectionType,
  Bindable,
  HasSelection,
  ListConfig,
} from "@tswift/ui";

class OceanClass implements Identifiable, Hashable {
  public id = UUID();
  constructor(public name: string) {}
}

const Ocean = swifty(OceanClass);
@main
export class OceanList extends Viewable {
  oceans: OceanClass[] = [
    Ocean("Pacific"),
    Ocean("Atlantic"),
    Ocean("Indian"),
    Ocean("Southern"),
    Ocean("Arctic"),
  ];

  @State multiSelection = Set<string>();

  body = ({ $multiSelection, oceans, multiSelection }: Bound<this>) => [
    NavigationView(
      List({
        data: oceans,
        selection: $multiSelection,
        content: ($0) => Text($0.name),
      } as ListConfig<OceanClass>)
        .navigationTitle("Oceans")
        .toolbar(EditButton())
    ),
    Text(`${multiSelection.count} selections`),
  ];
}
