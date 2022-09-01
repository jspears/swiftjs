import { swifty } from "@tswift/util";
import { Dot, KeyOf, KeyOfTypeWithType } from "@tswift/util";

class AnimationClass {
  static default = new AnimationClass();
  static easeInOut = new AnimationClass();
  static easeIn = new AnimationClass();
  static easeOut = new AnimationClass();
  static linear = new AnimationClass();
}
export const Animation = swifty(AnimationClass);

export type AnimationType = typeof AnimationClass;

export type AnimationKey = KeyOf<typeof AnimationClass>;

type Callback = () => void;

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
