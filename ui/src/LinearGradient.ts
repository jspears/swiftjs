import { Viewable } from './View';
import { swifty } from '@jswift/util';

export interface LinearGradientConfig {}

class LinearGradientClass extends Viewable<LinearGradientConfig> {}
export const LinearGradient = swifty(LinearGradientClass);
