import { AnimationKey } from "../Animation";
import { Bindable, has, isFunction, watchable } from "@tswift/util";
import { tween } from 'shifty'
import { bindableState, BindableState } from "../state";

function isBindableState(v: unknown): v is BindableState<unknown> {
  return (isFunction(v) && has(v, 'scope') && has(v, 'property'))
}
const tweenBindable = <T>(t:Bindable<T> = watchable<T>(0), options:{
  duration?:number,
  effect?:string
} = {})=>{
  const watched = watchable(t(), (to)=>{
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
    get(){
      return t();
    }
  })
  watched.sink = t.sink;  
  return watched;
}

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
