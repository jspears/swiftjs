import { Content, View, Viewable } from "./View";
import { swifty } from "./utilit";
import { VerticalAlignment, HorizontalAlignment, AlignmentKey } from "./Edge";
import { KeyOfTypeWithType, Num } from './types';
import { ColorKey } from "./Color";

interface StackOptions {
    spacing?: number;
    content?: Content;
    color?:ColorKey;
}

class StackClass<T extends {alignment?:unknown}> extends Viewable<StackOptions & T> {
    
    conf:Partial<T>;
    
    constructor(opts?:(T | View), ...views:View[]){
        super(...(opts instanceof Viewable ? [opts, ...views] : views));
        this.conf = opts instanceof Viewable ? {} : opts || {};
    }

    frame(conf: Partial<{ maxWidth:Num, maxHeight:Num, height: Num, width: Num, alignment:T['alignment'] }>) {
        return this;
    }
    
}
class VStackClass extends StackClass<{ alignment?: KeyOfTypeWithType<VerticalAlignment>; }> {

}
export const VStack = swifty(VStackClass);
export const LazyVStack = VStack;

class HStackClass extends StackClass<{ alignment?: KeyOfTypeWithType<HorizontalAlignment>; }> {

}
export const HStack = swifty(HStackClass);
export const LazyHStack = HStack;

class ZStackClass extends StackClass<{ alignment?: AlignmentKey; }> {

}

export const ZStack = swifty(ZStackClass);
export const LazyZStack = ZStack;
