import {Num, Size, swiftyKey} from '@tswift/util';
import { EdgeKey } from './Edge';
import { UnitPointKey } from './View/TransformMixin';

export class AnyTransition {

    static identity = new AnyTransition();
    static move(edge:EdgeKey){
        return new AnyTransition();
    }
    static opacity = new AnyTransition();

    static offset(size:Size):AnyTransition;
    static offset(x:Num, y:Num):AnyTransition;
    static offset(x:Num|Size, y?:Num){
        return new AnyTransition();
    }
    static scale(scale:Num, from:UnitPointKey){
        return new AnyTransition()
    }
    static slide = new AnyTransition();

    static push(from:EdgeKey){
        return new AnyTransition();
    }
    static assymetric(insertion:AnyTransition, removal:AnyTransition){
        return new AnyTransition();
    }
    animation(v:Animation){
        return new AnyTransition();
    }
    combined(_with:AnyTransition){
        return new AnyTransition();
    }
}

export const Transition = swiftyKey(AnyTransition);