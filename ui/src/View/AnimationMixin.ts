import { AnimationKey, isBindableState, tweenBindable } from "../Animation";
import type { Bindable } from "@tswift/util";

export class AnimationMixin {
  watch?: Map<string, Bindable<unknown>>;

  animation(type: AnimationKey, t: Bindable<unknown>) {
    if (!isBindableState(t)) {
      return this;
    }
    const scope = t.scope as unknown as typeof this;
    if (this !== scope) {
      scope.animation(type, t);
      return this;
    }
    if (this.watch) {
      this.watch.set(t.property, tweenBindable(this.watch.get(t.property)));
    }
    return this;
  }
}
