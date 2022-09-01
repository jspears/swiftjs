import { AnimationKey } from "../Animation";
import { Bindable, Bool } from "@tswift/util";

export class AnimationMixin {
  animation<V>(type: AnimationKey, t?: Bindable<V> | V) {
    return this;
  }
}
