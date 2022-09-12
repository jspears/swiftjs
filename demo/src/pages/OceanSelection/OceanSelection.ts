import {
  Hashable,
  Identifiable,
  Viewable,
  UUID,
  swifty,
  ID,
  State,
  NavigationView,
  List,
  ForEach,
  Section,
  Bound,
  Text,
} from "@tswift/ui";
const Sea = swifty(
  class implements Hashable, Identifiable {
    constructor(public name: string, public id = UUID()) {}
  }
);

const OceanRegion = swifty(
  class implements Identifiable {
    constructor(
      public name: string,
      public seas: ReturnType<typeof Sea>[],
      public id = UUID()
    ) {}
  }
);

export class OceanSelection extends Viewable<{}> {
  oceanRegions = [
    OceanRegion("Pacific", [
      Sea("Australasian Mediterranean"),
      Sea("Philippine"),
      Sea("Coral"),
      Sea("South China"),
    ]),
    OceanRegion("Atlantic", [
      Sea("American Mediterranean"),
      Sea("Sargasso"),
      Sea("Caribbean"),
    ]),
    OceanRegion("Indian", [Sea("Bay of Bengal")]),
    OceanRegion("Southern", [Sea("Weddell")]),
    OceanRegion("Arctic", [Sea("Greenland")]),
  ];

  @State singleSelection: string = "";

  body = ({ $singleSelection, oceanRegions }: Bound<this>) =>
    NavigationView(
      List(
        { selection: $singleSelection },
        ForEach(oceanRegions, (region) =>
          Section(
            { header: Text(`Major ${region.name} Ocean Seas`) },
            ForEach(region.seas, (sea) => Text(sea.name))
          )
        )
      )
    ).navigationTitle("Oceans and Seas");
}
