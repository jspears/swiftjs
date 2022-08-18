import { Viewable } from './View';
import type { Content } from './View';
import { swifty } from '@tswift/util';
import type {
  AlignmentKey,
  VerticalAlignmentKey,
  HorizontalAlignmentKey,
} from './Edge';
import type { Num } from '@tswift/util';
import { ColorKey } from './Color';
import { h } from 'preact';

interface StackOptions<T> {
  alignment?: T;
  spacing?: Num;
  content?: Content;
  color?: ColorKey;
}

class StackClass<T> extends Viewable<StackOptions<T>> {
  frame(
    conf: Partial<{
      maxWidth: Num;
      maxHeight: Num;
      height: Num;
      width: Num;
      alignment: T;
    }>
  ) {
    return this;
  }
  render() {
    const descend = super.render();
    return h('div', {}, descend);
  }
}

class VStackClass extends StackClass<VerticalAlignmentKey> {}
export const VStack = swifty(VStackClass);
export const LazyVStack = VStack;

class HStackClass extends StackClass<HorizontalAlignmentKey> {}
export const HStack = swifty(HStackClass);
export const LazyHStack = HStack;

class ZStackClass extends StackClass<AlignmentKey> {}

export const ZStack = swifty(ZStackClass);
export const LazyZStack = ZStack;
