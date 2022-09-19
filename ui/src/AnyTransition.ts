
import { Num, Size, KeyOf, False, Bool, Bindable } from '@tswift/util';
import { swiftyKey, fromKey, watchable } from '@tswift/util';
import { AnimationContext, Animation, AnimationKey, AnimationType } from './Animation';
import { Edge, EdgeKey } from './Edge';
import { CSSProperties } from './types';
import { isNum, unitFor } from './unit';
import { UnitPointKey } from './View/TransformMixin';

const TRANSITION = [
    'top',
    'right',
    'bottom',
    'left',
    'transform',
    'transformOrigin',
    'filter',
    'scale',
    'opacity',
    'translate',
    'rotate',

] as const;
type Transitionable = typeof TRANSITION[number]
type TranFn = (v: number) => string | number;
interface TransitionFuncs extends Partial<Record<Transitionable, TranFn>> {

}
export const TransitionContext = {
    transition: Bool(false),
}
export class AnyTransition implements TransitionFuncs {

    insertion: AnyTransition = this;
    removal: AnyTransition = this;
    _animation?: AnimationType;

    static identity = new AnyTransition();

    static move(edge: EdgeKey) {
        const to = fromKey(Edge, edge);
        return new class Move extends AnyTransition {
            top(n: Num) {
                if (typeof n === 'string') {
                    return '';
                }

                return unitFor(n * 100)
            }
            left(n: Num) {
                if (typeof n === 'string') {
                    return '';
                }
                return unitFor(n * 100);
            }
        }
    }

    static opacity = new class Opacity extends AnyTransition {
        opacity(v: Num) {
            if (v === '.infinity') {
                return 1;
            }
            return v;
        }
    };

    static offset(size: Size): AnyTransition;
    static offset(width: Num, y: Num): AnyTransition;
    static offset(x: Num | Size, y?: Num) {
        let _x: number, _y: number;
        if (!isNum(x)) {
            y = x.height;
            x = x.width;
        }
        if (typeof x != 'number') {
            _x = 0;
        } else {
            _x = x;
        }
        if (typeof y != 'number') {
            _y = 0;
        } else {
            _y = y;
        }

        return new class Offset extends AnyTransition {
            offset(n: number): string {
                return `${unitFor(_x * n)} ${unitFor(_y * n)}`;
            }
        }
    }

    static scale(scale: Num, from: UnitPointKey) {
        return new class extends AnyTransition {

            scale(n: number) {
                if (scale === '.infinity') {
                    return 1;
                }
                return n * scale;
            }
        }
    }

    static slide = new class Slide extends AnyTransition {
        translate(n: number): string {
            return `${-100 + (n * 100)}%`;
        }
    }

    static push(from: EdgeKey) {
        return new class Push extends AnyTransition {

        }
    }
    static assymetric(insertion: AnyTransition, removal: AnyTransition) {
        return new class Assymetric extends AnyTransition {
            constructor() {
                super()
                this.insertion = insertion;
                this.removal = removal;
            }
        }
    }

    animation(v: AnimationKey) {
        this._animation = Animation.fromKey(v);
        return this;
    }

    combined(with_: AnyTransition) {
        const self = this;
        return new class Combined extends AnyTransition {
            _animation = self._animation;
            style(n: number) {
                return self.style(n, with_.style(n));
            }

        }
    }

    style = (v: number, _style: CSSProperties = {}): CSSProperties => {
       return TRANSITION.reduce((ret, key) => {
            const val = this[key]?.(v);
            if (val != null) {
                ret[key] = val;
            }
            return ret;
        }, _style);
    }

    toStyle(): TransitionStyles {
        let animation = this._animation || AnimationContext.withAnimation;
        const { duration = .35, delay = 0 } = animation?.conf || {};
        const cssName = animation?.cssName || 'ease-in-out';
        const ret = {
            entering: this.insertion.style(0),
            entered: this.insertion.style(1),
            exiting: this.removal.style(1),
            exited: this.removal.style(0),
        }

        const transition = [...new Set(Object.values(ret).flatMap(v=>Object.keys(v)))].reduce((ret, k)=>{
            const trans = `${k} ${duration}s ${cssName} ${delay}s`;
            return ret  ? `${ret}, ${trans}` : trans;
        }, '');

        return {
            duration:duration * 1000,
            style:{
                ...ret.entering,
                transition
            },
            ...ret            
        };
    }
}

export type TransitionStyles = {
    duration:number,
    style: CSSProperties;
    entering: CSSProperties;
    exiting: CSSProperties;
    entered: CSSProperties;
    exited: CSSProperties;
}

export const Transition = swiftyKey(AnyTransition);
export type TransitionKey = KeyOf<typeof AnyTransition>;

class TransitionToggle {
    in: Bindable<boolean>;
    out: Bindable<boolean>
    constructor(init:boolean ) {
        this.in = watchable(init);
        this.out = watchable(init);
    }
}