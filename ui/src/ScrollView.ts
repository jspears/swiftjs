import { Content, Viewable, ViewableClass } from "./View";
import { swifty } from "@jswift/util";
import { AxisKey } from "./Axis";
import { AlignmentKey } from "./Edge";

export interface ScrollViewConfig {
    axis?:AxisKey
    showsIndicators?:boolean;
    content:Content;
    alignment?:AlignmentKey;
}

export class ScrollViewClass extends Viewable<ScrollViewConfig> {

}

export const ScrollView = swifty(ScrollViewClass);
