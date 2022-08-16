import { Viewable } from "./View";
import { swifty } from "@jswift/util";

class SpacerClass extends Viewable<any> {}
export const Spacer = swifty(SpacerClass);
