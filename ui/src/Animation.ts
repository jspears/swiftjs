import { Bindable, swifty, swiftyKey } from "@tswift/util";
import { Dot, KeyOf, KeyOfTypeWithType } from "@tswift/util";
 
class AnimationClass {
  static easeInOut = new AnimationClass("ease-in-out");
  static easeIn = new AnimationClass("ease-in");
  static easeOut = new AnimationClass("ease-out");
  static linear = new AnimationClass("linear");
  static default = AnimationClass.easeInOut;

  constructor(private name: string) {
    
  }
  sink(v: Bindable<number>) {
 //   let prev = v();
   // new AnimationEffect()
  }
}

export type AnimationType = typeof AnimationClass;

export type AnimationKey = KeyOf<typeof AnimationClass>;

export type Callback = () => void;
export const AnimationTool = swiftyKey(AnimationClass);
export function withAnimation(result: Callback): void;
export function withAnimation(
  animation: AnimationKey | Callback,
  result?: Callback
): void {
  if (!isAnimation(animation)) {
    result = animation;
  }
  if (result) {
    setTimeout(result, 0);
  }
}

function isAnimation(v: unknown): v is AnimationClass {
  return (
    v instanceof AnimationClass ||
    (typeof v === "string" && Object.hasOwnProperty.call(AnimationClass, v))
  );
}

