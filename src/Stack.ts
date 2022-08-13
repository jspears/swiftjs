import { Content, Viewable } from "./View";
import { swifty } from "./utilit";
import { VerticalAlignment, HorizontalAlignment } from "./Alignment";
import { KeyOfTypeWithType } from './types';

interface StackOptions {
    spacing?:number;
    content?:Content
}

class StackClass<T> extends Viewable<StackOptions & T> {
    padding(num:number):this {
        return this;
    }
}
class VStackClass extends StackClass<{  alignment?:KeyOfTypeWithType<VerticalAlignment>;}> {
    
}

class HStackClass extends StackClass<{alignment?:KeyOfTypeWithType<HorizontalAlignment>l}> {
   
}

class ZStackClass<T> extends StackClass<{ alignment?:KeyOfTypeWithType<VerticalAlignment>; }> {

}

export const HStack = swifty(HStackClass);
export const VStack = swifty(VStackClass);
export const ZStack = swifty(ZStackClass);
