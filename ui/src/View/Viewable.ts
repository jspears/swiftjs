import type { AlignmentKey } from "../Edge";
import { isString, applyMixins, has, watchable, Void, isBindable, asArray } from "@tswift/util";
import type { Bindable, Bound, Bounds } from "@tswift/util";
import { ApperanceMixin } from "./ApperanceMixin";
import { PaddingMixin } from "./PaddingMixin";
import { PickerMixin } from "./PickerMixin";
import { Searchable } from "./Searchable";
import { FontMixin } from "./FontMixin";
import { View } from "./View";
import { EventsMixin } from "./EventsMixin";
import { ShapeMixin } from "./ShapeMixin";
import { AnimationMixin } from "./AnimationMixin";
import { ControlMixin } from "./ControlMixin";
import { NavigationMixin } from "./NavigationMixin";
import { toNode } from "../dom";
import { h, Component } from "preact";
import { ListMixin } from "./ListMixin";
import { CSSProperties } from "../types";
import { EnvironmentMixin } from "./EnvironmentMixin";
import { bindToState } from "../state";
import { SelectionType } from "../List/types";
import { Inherit } from "../Inherit";
export class ViewableClass<T = any> extends View {
  watch = new Map<string, Bindable<any>>();

  protected config: Partial<T> = {};
  protected dirty = watchable<boolean>(true);
  protected _tag?: string;
  protected _bound: Bound<this>;
  constructor(config?: T | View, ...children: View[]) {
    super();
    this.config = config instanceof View ? {} : config || {};
    const allChildren =
      config instanceof View ? [config, ...children] : children;
    this.children = allChildren;
    this._bound = new Proxy(this, {
        get(target, key) {
          if (isString(key) && key["0"] === "$") {
            return target.$(key.slice(1) as any);
          }
        },
      }) as any;
  }

  onRecieve<E>(p: Bindable<E>, perform: (e: E) => Void) {
    p.sink(perform);
    return this;
  }
  protected $ = <
    V extends typeof this = typeof this,
    K extends keyof V & string = keyof V & string,
    R = V[K]
  >(
    ...keys: K[]
  ): Bindable<R> => {
    keys.forEach(key=>{
    if (!this.watch.has(key)) {
      const value = has(this, key) ? this[key] : null;
      const watch = isBindable(value) ? value : watchable<R>(value as unknown as R);
      const pd = Object.getOwnPropertyDescriptor(this, key);
      if (pd) {
        pd.get = watch;
        if (pd.set) {
          watch.sink(pd.set);
        }
        pd.set = watch;
      } else {
        Object.defineProperty(this, key, {
          get: watch,
          set: watch,
        });
      }
      this.watch.set(key, watch);
    }
  });
    return  this.watch.get(keys[0]) as Bindable<R> ;
  };
  frame(conf: Partial<Bounds & { alignment: AlignmentKey }>) {
    return this;
  }
  tag(v: string) {
    this._tag = v;
    return this;
  }
  matchedGeometryEffect(effect: { id: string; in?: string }) {
    return this;
  }
  asStyle(...css: CSSProperties[]): CSSProperties {
    const backgroundColor = this._backgroundColor?.value;
    const color = this._foregroundColor?.value;
    return Object.assign(
      {},
      this._font?.style,
      { backgroundColor, color },
      this._border,
      this._padding,
      ...css
    );
  }
  body?(
    bound: Bound<this>,
    self: this
  ): View | undefined | (View | undefined)[]
  exec = ():View[] => {
    if (!this.body) {
      return asArray(this.children);
    }
    return asArray(this.body(this._bound, this)).flatMap((v) => {
      (v.parent = this);
      return v;
    });
  };
  render() {
    if (this.body) {
      return h(ViewComponent as any, { watch: this.watch, body: this.exec });
    }
    return super.render?.();
  }
}
type Props = { watch: Map<string, Bindable<any>>; body: () => View[] };
class ViewComponent extends Component<Props> {
  constructor(props: Props) {
    super(props);
    bindToState(this, this.props);
  }

  render() {
    return toNode(...this.props.body());
  }
}

export interface ViewableClass
  extends ApperanceMixin,
    AnimationMixin,
    ControlMixin,
    EnvironmentMixin,
    EventsMixin,
    FontMixin,
    ListMixin,
    NavigationMixin,
    PaddingMixin,
    PickerMixin,
    Searchable,
    ShapeMixin {}
export const Viewable = applyMixins(
  ViewableClass,
  ApperanceMixin,
  AnimationMixin,
  ControlMixin,
  EnvironmentMixin,
  EventsMixin,
  FontMixin,
  ListMixin,
  NavigationMixin,
  PaddingMixin,
  PickerMixin,
  Searchable,
  ShapeMixin
);
