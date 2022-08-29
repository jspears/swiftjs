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
} from '@tswift/ui';
import { run } from '../run';
import Png from './SimpleList.png';

class OceanClass implements Identifiable, Hashable {
  constructor(public name: string, public id = UUID()) {}
}

const Ocean = swifty(OceanClass);

export class OceanList extends Viewable {
  oceans = [
    Ocean('Pacific'),
    Ocean('Atlantic'),
    Ocean('Indian'),
    Ocean('Southern'),
    Ocean('Arctic'),
  ];

  @State multiSelection: CountSet<ID> = Set<ID>();

  body = (
    { $multiSelection }: Bound<this>,
    { oceans, multiSelection }: this
  ) => [
    NavigationView (
      List(oceans,  $multiSelection, 
        $0=>Text($0.name)
      )
      .navigationTitle("Oceans")
      .toolbar (EditButton() )
    ),
    Text(`${multiSelection.count} selections`),
  ];
}

run(new OceanList());