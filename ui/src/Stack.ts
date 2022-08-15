import { Content, View, Viewable } from "./View";
import { swifty } from "./utilit";
import { AlignmentKey, VerticalAlignmentKey, HorizontalAlignmentKey } from "./Edge";
import { Num } from './types';
import { ColorKey } from "./Color";

interface StackOptions<T> {
    alignment?: T;
    spacing?: Num;
    content?: Content;
    color?: ColorKey;
}

class StackClass<T> extends Viewable<StackOptions<T>>{
    frame(conf: Partial<{ maxWidth: Num, maxHeight: Num, height: Num, width: Num, alignment: T }>) {
        return this;
    }
    render(): HTMLElement | DocumentFragment | Text | undefined {
        const descend = super.render();
        if (descend != null) {
            const div = document.createElement('div');
            div.appendChild(descend);
            return div;
        }
        return;
    }
}

class VStackClass extends StackClass<VerticalAlignmentKey> {

}
export const VStack = swifty(VStackClass);
export const LazyVStack = VStack;

class HStackClass extends StackClass<HorizontalAlignmentKey> {

}
export const HStack = swifty(HStackClass);
export const LazyHStack = HStack;

class ZStackClass extends StackClass<AlignmentKey> {

}

export const ZStack = swifty(ZStackClass);
export const LazyZStack = ZStack;
