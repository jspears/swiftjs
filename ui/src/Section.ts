import { View, Viewable } from "./View";
import { swifty } from "@jswift/util";

class SectionClass extends Viewable {
  constructor(...views: View[]) {
    super(...views);
  }
}
export const Section = swifty(SectionClass);
