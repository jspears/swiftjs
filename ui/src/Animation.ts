import { KeyOf, Bindable, swiftyKey, todo, isInstanceOf } from "@tswift/util";
import { has, isFunction, watchable } from "@tswift/util";
import { tween, Tweenable } from "shifty";
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
  static easeInOut = new AnimationClass("easeInOutExpo");
  static easeIn = new AnimationClass("easeInExpo");
  static easeOut = new AnimationClass("easeOutExpo");
  static linear = new AnimationClass("linear");
  static default = AnimationClass.easeInOut;

  conf: AnimationConfig = {
    duration: 350,
  };

  @todo("figure it out")
  static spring(conf: {
    response: number;
    dampingFraction: number;
    blendDuration: number;
  }) {
    return AnimationClass.default;
  }
  @todo("figure it out")
  static timingCurve(curve: {
    c0x: number;
    c0y: number;
    c1x: number;
    c1y: number;
    duration: number;
  }) {
    return AnimationClass.default;
  }
  constructor(easing: string | AnimationConfig) {
    if (typeof easing == "string") {
      this.conf.easing = easing;
    } else {
      Object.assign(this.conf, easing);
    }
  }
  repeatCount(repeatCount: number, autoreverses: boolean = false) {
    return new AnimationClass({ repeatCount, autoreverses });
  }
  repeatForever(autoreverses: boolean) {
    return new AnimationClass({ repeatForever: true, autoreverses });
  }
  speed(speed: number) {
    return new AnimationClass({ speed });
  }
  delay(delay: number) {
    return new AnimationClass({ delay: delay * 1000 });
  }
  duration(duration: number) {
    return new AnimationClass({ duration: duration * 1000 });
  }
  tween<T>(cb: Bindable<T>) {
    return tweenBindable<T>(cb, this.conf);
  }
}
export const linear = AnimationClass.linear;
export const easeIn = AnimationClass.easeIn;
export const easeOut = AnimationClass.easeOut;
export const easeInOut = AnimationClass.easeInOut;

export type AnimationType = typeof AnimationClass;

export type AnimationKey = KeyOf<typeof AnimationClass>;

export type Callback = () => void;
export const AnimationTool = swiftyKey(AnimationClass);

type AnimationContextType = {
  withAnimation?: AnimationClass
}
/**
 * This holds an animation context.   When bound
 * values change they will need to check here to see
 * if there are animated or not.
 */
export const AnimationContext: AnimationContextType = {
  withAnimation: undefined,
}
/**
 * So withAnimation sets the animation for a function.
 * when that function is called any bound variables, will
 * need to check if there is a withAnimation and if there
 * is than they will need to act all animated like.
 *
 * 
 */
export function withAnimation(
  animationKey: AnimationKey,
  result: Callback
):  void;
export function withAnimation(result: Callback): void;
export function withAnimation(
  animation: AnimationKey | Callback,
  result?: Callback
):void {
  let _animation = isInstanceOf(animation, AnimationClass) ? animation :
    typeof animation === 'string' ?
      AnimationTool.fromKey(animation) : undefined;

  if (!_animation) {
    result = isFunction(animation) ? animation : result;
    _animation = AnimationClass.default;
  }
    AnimationContext.withAnimation = _animation;
    try {
      result?.()
    } finally {
      AnimationContext.withAnimation = undefined;
    }
  
}
export const Animation = swiftyKey(AnimationClass);

export function isBindableState(v: unknown): v is BindableState<unknown> {
  return isFunction(v) && has(v, "scope") && has(v, "property");
}

type AnimatedBindable<T> = Bindable<T> & {
  animated: Tweenable;
}

export const tweenBindable = <T>(
  t: Bindable<T> = watchable<T>(0),
  options: AnimationConfig = {}
): AnimatedBindable<T> => {
  const animated = tween();

  const watched = watchable(t(), (to) => {
    animated.tween({
      easing: "easeInQuint",
      duration: 400,
      ...options,
      render({ value }) {
        t(value);
      },
      from: { value: t() },
      to: { value: to },
    });
  });
  Object.defineProperty(watched, "value", {
    get() {
      return t();
    },
  });
  watched.sink = t.sink;
  return Object.assign(watched, { animated });
}