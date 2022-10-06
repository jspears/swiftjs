
import { swiftyKey, fromKey, watchable, isObjectWithPropType, isFunction } from '@tswift/util';
import type { Num, Size, KeyOf, Listen } from "@tswift/util";
import { tween } from 'shifty';
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
    'transition',

] as const;
type Transitionable = typeof TRANSITION[number]
type TranFn = (v: number) => string | number;
type TransitionFunctions  = { 
    [k in Transitionable]?:TranFn;
};

export class AnyTransition implements TransitionFunctions {
    insertion: AnyTransition = this;
    removal: AnyTransition = this;
    _animation?: AnimationType;
    _toggle?:TransitionToggle;

    static identity = new AnyTransition();
    static move(edge: EdgeKey):AnyTransition {
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

    static opacity:AnyTransition = new class extends AnyTransition {
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

    static scale(scale: Num, from: UnitPointKey):AnyTransition {
        return new class extends AnyTransition {

            scale(n: number) {
                if (scale === '.infinity') {
                    return 1;
                }
                return n * scale;
            }
        }
    }

    static slide:AnyTransition = new class Slide extends AnyTransition {
        translate(n: number): string {
            return `${-100 + (n * 100)}%`;
        }
    }

    static push(from: EdgeKey):AnyTransition {
        return new class Push extends AnyTransition {

        }
    }

    static asymetric(insertion: AnyTransition, removal: AnyTransition):AnyTransition {
        return new class Asymetric extends AnyTransition {
            constructor() {
                super()
                this.insertion = insertion;
                this.removal = removal;
            }
        }
    }
    /** 
     * This is here soley to make Typescript happy, otherwise there is no overlap.
    */
    transition(v:number){
        return '';
    }

    animation(v: AnimationKey) {
        this._animation = Animation.fromKey(v);
        return this;
    }

    style = (v: number, _style: CSSProperties = {}): CSSProperties => {
        const self = this;
        return TRANSITION.reduce((ret, key) => {
            if (isObjectWithPropType(isFunction, key, self)) {
                ret[key] = self[key](v);
            }
            return ret;                
        }, _style);
    }

    combined(with_: AnyTransition):AnyTransition {
        const self = this;
        return new class Combined extends AnyTransition {
            _animation = self._animation;
            style = (n: number)=> {
                return self.style(n, with_.style(n));
            }

        }
    }
    toggle() {
        if (!this._toggle) {
            this._toggle = new TransitionToggle(this);
        }
        this._toggle.toggle();
        return this;
    }

    styles(listen: Listen<CSSProperties>) {
        if (!this._toggle) {
            this._toggle = new TransitionToggle(this);
        }     
        return this._toggle.styles(listen);
    }

    toStyle(): TransitionStyles {
        const animation:AnimationType | undefined = this._animation || AnimationContext.withAnimation;
        const { cssName = 'ease-in-out', duration = .35, delay = 0 } = animation?.conf || {} ;
        const ret = {
            entering: this.insertion.style(0),
            entered: this.insertion.style(1),
            exiting: this.removal.style(1),
            exited: this.removal.style(0),
        }

        const transition = [...new Set(Object.values(ret).flatMap(v => Object.keys(v)))].reduce((ret, k) => {
            const trans = `${k} ${duration}s ${cssName} ${delay}s`;
            return ret ? `${ret}, ${trans}` : trans;
        }, '');

        return {
            duration: duration * 1000,
            style: {
                ...ret.entering,
                transition
            },
            ...ret
        };
    }
}

export type TransitionStyles = {
    duration: number,
    style: CSSProperties;
    entering: CSSProperties;
    exiting: CSSProperties;
    entered: CSSProperties;
    exited: CSSProperties;
}

export const Transition = swiftyKey(AnyTransition);
export type TransitionKey = KeyOf<typeof AnyTransition>;

type TransitionStates = 'entering' | 'entered' | 'exiting' | 'exited';

class TransitionToggle {

    get state() {
        return this._change();
    }

    set state(v) {
        this._change(v);
    }

    _change = watchable<TransitionStates | undefined>(undefined);
    _props = watchable<CSSProperties>({});

    constructor(private _transition: AnyTransition) {
        this._change.sink(this.transition);
    }

    transition = async(state: TransitionStates|undefined):Promise<void> => {
        const self = this;
        switch (state) {
            case 'entering': {
                const trans = this._transition.insertion;
                const tw = tween({
                    ...trans._animation?.conf,
                    from: { value: 0 },
                    to: { value: 1 },
                    render({ value }) {
                        self._props(trans.style(value))
                    }
                });
                if (isFakePromise(tw)) {
                    await tw;
                }
                this.state = 'entered';
                break
            }
            case 'exiting': {
                const trans = this._transition.removal;
                const t = tween({
                    ...trans._animation?.conf,
                    from: { value: 1 },
                    to: { value: 0 },
                    render({ value }) {
                        self._props(trans.style(value))
                    }
                });
                if (isFakePromise(t)) {
                    await t;
                }
                this.state = 'exited';
                break;
            }
        }
    }
    sink(listen:Listen<TransitionStates|undefined>){
        return this._change.sink(listen);
    }
    styles(listen: Listen<CSSProperties>) {
        return this._props.sink(listen);
    }

    toggle = () => {
        if (this.state === 'entered' || this.state === 'entering') {
            this.state = 'exiting';
        } else {
            this.state = 'entering';
        }
    }

}
export const TransitionContext: {
    transition?: TransitionToggle,
    initialize(start: boolean, duration: number): TransitionToggle,

} = {
    initialize(start: boolean, duration: number) {
        return null as any;
//        return (TransitionContext.transition = new TransitionToggle(start));
    }
}

function isFakePromise(v: unknown): v is Promise<unknown> {
    return true;
}
