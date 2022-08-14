import { Content, Viewable, ViewableClass } from "./View";
import { swifty } from "./utilit";
import { AxisKey } from "./Axis";

export interface ScrollViewConfig {
    axis:AxisKey
    showsIndicators:boolean;
    content:Content;
}

export class ScrollViewClass extends Viewable<ScrollViewConfig> {

}

export const ScrollView = swifty(ScrollViewClass);
