import { Viewable } from './View';
import { swifty } from '@tswift/util';

export interface LinearGradientConfig {}

class LinearGradientClass extends Viewable<LinearGradientConfig> {}
export const LinearGradient = swifty(LinearGradientClass);
