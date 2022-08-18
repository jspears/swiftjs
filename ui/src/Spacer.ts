import { Viewable } from './View';
import { swifty } from '@tswift/util';

class SpacerClass extends Viewable<any> {}
export const Spacer = swifty(SpacerClass);
