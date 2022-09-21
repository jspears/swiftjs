import { KeyOf, Bindable, swiftyKey, todo, isInstanceOf } from "@tswift/util";
import { has, isFunction, watchable } from "@tswift/util";
import { tween, Tweenable } from "shifty";
import { TransitionContext } from "./AnyTransition";
import { BindableState } from "./state";
interface AnimationConfig {
  duration?: number;
  delay?: number;
  repeatCount?: number;
  repeatForever?: boolean;
  autoreverses?: boolean;
  speed?: number;
  easing?: string;
}
class AnimationClass {
  static easeInOut = new AnimationClass("easeInOutExpo", "ease-in-out");
  static easeIn = new AnimationClass("easeInExpo", "ease-in");
  static easeOut = new AnimationClass("easeOutExpo", "ease-out");
  static linear = new AnimationClass("linear", "linear");
  static default = AnimationClass.easeInOut;

  conf: AnimationConfig = {
    duration: 350,
  };

  @todo("figure it out")
  static spring(conf: { response: number; dampingFraction: number; blendDuration: number }) {
    return AnimationClass.default;
  }
  @todo("figure it out")
  static timingCurve(curve: { c0x: number; c0y: number; c1x: number; c1y: number; duration: number }) {
    return AnimationClass.default;
  }
  constructor(easing: string | AnimationConfig, public cssName:string) {
    if (typeof easing == "string") {
      this.conf.easing = easing;
    } else {
      Object.assign(this.conf, easing);
    }
  }
  apply(conf:Partial<AnimationConfig>){
      return new AnimationClass(Object.assign({}, this.conf, conf), this.cssName);
  }
  repeatCount(repeatCount: number, autoreverses: boolean = false) {
    return this.apply({ repeatCount, autoreverses })
  }
  repeatForever(autoreverses: boolean) {
    return this.apply({ repeatForever: true, autoreverses });
  }
  speed(speed: number) {
    return this.apply({ speed });
  }
  delay(delay: number) {
    return this.apply({ delay: delay * 1000 });
  }
  duration(duration: number) {
    return this.apply({ duration: duration * 1000 })
  }
  tween<T>(cb: Bindable<T>) {
    const inAnimation = AnimationContext.inAnimation = tweenBindable<T>(cb, this.conf);
    const done = _ => {
      AnimationContext.inAnimation = undefined;
    };
    inAnimation.animated?.then(done, done);
    return inAnimation;
  }
}
export const linear = AnimationClass.linear;
export const easeIn = AnimationClass.easeIn;
export const easeOut = AnimationClass.easeOut;
export const easeInOut = AnimationClass.easeInOut;

export type AnimationType =  AnimationClass;

export type AnimationKey = KeyOf<typeof AnimationClass>;

export type Callback = () => void;
export const AnimationTool = swiftyKey(AnimationClass);

type AnimationContextType = {
  inAnimation?: AnimatedBindable<any>;
  withAnimation?: typeof AnimationClass;
};
/**
 * This holds an animation context.   When bound
 * values change they will need to check here to see
 * if there are animated or not.
 */
export const AnimationContext: AnimationContextType = {
  withAnimation: undefined,
};
/**
 * So withAnimation sets the animation for a function.
 * when that function is called any bound variables, will
 * need to check if there is a withAnimation and if there
 * is than they will need to act all animated like.
 *
 *
 */
export function withAnimation(animationKey: AnimationKey, result: Callback): void;
export function withAnimation(result: Callback): void;
export function withAnimation(animation: AnimationKey | Callback, result?: Callback): void {
  let _animation = isInstanceOf(animation, AnimationClass)
    ? animation
    : typeof animation === "string"
    ? AnimationTool.fromKey(animation)
    : undefined;

  if (!_animation) {
    result = isFunction(animation) ? animation : result;
    _animation = AnimationClass.default;
  }
  AnimationContext.withAnimation = _animation;
  
  try {
    result?.();
  } finally {
    AnimationContext.withAnimation = undefined;
  }
}
export const Animation = swiftyKey(AnimationClass);
export const AnimationType =  AnimationClass;

export function isBindableState(v: unknown): v is BindableState<unknown> {
  return isFunction(v) && has(v, "scope") && has(v, "property");
}

type AnimatedBindable<T> = Bindable<T> & {
  animated: Tweenable;
};

export const tweenBindable = <T>(
  t: Bindable<T> = watchable<T>(null as T),
  options: AnimationConfig = {},
): AnimatedBindable<T> => {
  const v=  t();
  if (typeof v === 'boolean'){
    setTimeout(t, ((options.duration || .4) + (options.delay || 0))* 1000 , !v);
    return t as any;
  }
  const animated = tween();

  const watched = Object.defineProperty(watchable(v, (to) => 
    animated.tween({
      easing: "easeInQuint",
      duration: 350,
      ...options,
      render({ value }) {
        t(value);
      },
      from: { value: t() },
      to: { value: to },
    })), "value", {
    get:t,
  });

  return Object.assign(watched, { 
    animated,
    sink:t.sink,
  });
};
