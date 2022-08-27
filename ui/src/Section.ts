import { View, Viewable } from './View';
import { swifty } from '@tswift/util';

type SectionConfig = {
  header?: View | string;
};
class SectionClass extends Viewable<SectionConfig> {

}

export const Section = swifty(SectionClass);
