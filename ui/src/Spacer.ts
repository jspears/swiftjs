import { Viewable } from "./View";
import { swifty } from "@tswift/util";
import { h } from "preact";

class SpacerClass extends Viewable {
    render(){

        return h('span', {style:{display:'inline-block', width:'-webkit-fill-available'}});
    }
}
export const Spacer = swifty(SpacerClass);
