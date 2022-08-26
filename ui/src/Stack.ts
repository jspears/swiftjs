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
import { CSSProperties } from './types';

interface StackOptions<T> {
  alignment?: T;
  spacing?: Num;
  content?: Content;
  color?: ColorKey;
}

class StackClass<T> extends Viewable<StackOptions<T>> {
  style:CSSProperties = {
    display:'flex',
  }
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
    return h('div', {style:this.style}, super.render());
  }
}
class VStackClass extends StackClass<VerticalAlignmentKey> {
  style = {
    display:'flex',
    flexDirection:'column',
    flex:'1',
    justifyContent:'center',
    width: 'fit-content',
    height: 'fit-content',
  }
}
export const VStack = swifty(VStackClass);
export const LazyVStack = VStack;

class HStackClass extends StackClass<HorizontalAlignmentKey> {
  style = {
    display:'flex',
    flexDirection:'row',
    flex:'1'
  }
}
export const HStack = swifty(HStackClass);
export const LazyHStack = HStack;

class ZStackClass extends StackClass<AlignmentKey> {}

export const ZStack = swifty(ZStackClass);
export const LazyZStack = ZStack;
