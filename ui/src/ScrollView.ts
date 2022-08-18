import { Viewable } from './View';
import type { Content } from './View';
import { swifty } from '@tswift/util';
import type { AxisKey } from './Axis';
import type { AlignmentKey } from './Edge';

export interface ScrollViewConfig {
  axis?: AxisKey;
  showsIndicators?: boolean;
  content: Content;
  alignment?: AlignmentKey;
}

export class ScrollViewClass extends Viewable<ScrollViewConfig> {}

export const ScrollView = swifty(ScrollViewClass);
