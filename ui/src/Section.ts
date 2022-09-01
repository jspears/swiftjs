import { View, Viewable } from "./View";
import { swifty } from "@tswift/util";
import {Text} from './Text';

type SectionConfig = {
  header?: View | string;
};
class SectionClass extends Viewable<SectionConfig> {
  constructor(config:string, ...views:View[]);
  constructor(config:SectionConfig| string, ...views:View[]){
    super(typeof config == 'string' ? Text(config).font('.title2') : 
    config.header instanceof View ? config.header :
    Text(config?.header || '').font('.title'), ...views);
  }

}

export const Section = swifty(SectionClass);
