import { KeyOf, Bindable, swiftyKey } from "@tswift/util";
import { has, isFunction, watchable } from "@tswift/util";
import { tween } from 'shifty'
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

  private conf: AnimationConfig = {
    duration: 350
  }
  static spring(conf: {response: number, dampingFraction: number, blendDuration: number}) {
    return AnimationClass.default;
  }
  
  static timingCurve(curve: { c0x: number, c0y: number, c1x: number, c1y: number, duration: number }) {
    console.warn('custom timingCurve not impemented yet');
    return AnimationClass.default;
  }
  constructor(easing: string | AnimationClass) {
    if (typeof easing == 'string') {
      this.conf.easing = easing;
    } else {
      Object.assign(this.conf, easing.conf);
    }
  }
  private apply(conf: AnimationConfig) {
    const ret = new AnimationClass(this);
    ret.conf = Object.apply(ret.conf, conf as any);
    return ret;
  }
  repeatCount(repeatCount: number, autoreverses: boolean = false) {
    return this.apply({repeatCount, autoreverses })
  }
  repeatForever(autoreverses: boolean) {
    return this.apply({repeatForever:true, autoreverses })
  }
  speed(speed: number) {
    return this.apply({ speed });
  }

  delay(delay: number) {
    return this.apply({ delay:delay * 1000 });
  }
  duration(duration: number) {
    return this.apply({ duration:duration * 1000 });
  }
}

export type AnimationType = typeof AnimationClass;

export type AnimationKey = KeyOf<typeof AnimationClass>;

export type Callback = () => void;
export const AnimationTool = swiftyKey(AnimationClass);

export function withAnimation(animationKey: AnimationKey, result: Callback): void;
export function withAnimation(result: Callback): void;
export function withAnimation(
  animation: AnimationKey | Callback,
  result?: Callback
): void {
  if (isFunction(result)) {
    result = animation;
  }
}

export function isBindableState(v: unknown): v is BindableState<unknown> {
  return (isFunction(v) && has(v, 'scope') && has(v, 'property'))
}
export const tweenBindable = <T>(t: Bindable<T> = watchable<T>(0), options: {
  duration?: number,
  effect?: string
} = {}) => {
  const watched = watchable(t(), (to) => {
    tween({
      easing: 'easeInQuint',
      duration: 400,
      ...options,
      render({ value }) {
        t(value);
      },
      from: { value: t() },
      to: { value: to },
    });
  });
  Object.defineProperty(watched, 'value', {
    get() {
      return t();
    }
  })
  watched.sink = t.sink;
  return watched;
}

function isAnimation(v: unknown): v is AnimationClass {
  return (
    v instanceof AnimationClass ||
    (typeof v === "string" && Object.hasOwnProperty.call(AnimationClass, v))
  );
}

