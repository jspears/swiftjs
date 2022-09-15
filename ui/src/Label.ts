import { asArray, isString, swifty, toArray } from "@tswift/util";
import { h } from "preact";
import { HStack } from "./Stack";
import { SystemImageType } from "./types";
import { Viewable, View } from "./View";
import { Text } from "./Text";
import { Image } from "./Image";
import { isView } from "./guards";
export interface LabelConfig {
    label: string | View;
    icon?: View,
    systemImage?: SystemImageType;
}
export const Label = swifty(class LabelClass extends Viewable {
    constructor(conf: LabelConfig | string, 
        systemImage?: SystemImageType,
         ...children:View[]) {
        super(makeBody(conf, systemImage, ...children));
    }
})

const asImage = (v:SystemImageType)=>isString(v) ? Image(v) : v;
const asText = (v:string|View)=>isString(v) ? Text(v) : v;

const makeBody = (c: LabelConfig | string, 
    systemImage?: SystemImageType,
     ...children:View[])=>{
        const conf:LabelConfig = isString(c) ? {label:c} : c;
        const all = [...children];
        if (conf.label){
            all.unshift(asText(conf.label));
        }
        if (isView(systemImage)){
            all.unshift(systemImage);
        }
        if (isString(systemImage)){
            all.unshift(Image(systemImage));
        }else if (conf.systemImage){
            all.unshift(Image(conf.systemImage));
        }else if (conf.icon){
            all.unshift(conf.icon);
        }
        
        return HStack(...all);
     }