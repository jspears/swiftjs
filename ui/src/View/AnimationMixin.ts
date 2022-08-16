import { AnimationKey } from '../Animation';
import { Bindable, Bool } from '@jswift/util';

export class AnimationMixin {
  animation<V>(type: AnimationKey, t?: Bindable<V> | V) {
    return this;
  }
}
