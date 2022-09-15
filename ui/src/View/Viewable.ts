import { Alignment, AlignmentBase, AlignmentKey } from "../Edge";
import {
  isObservableObject,
  isString,
  applyMixins,
  has,
  watchable,
  Void,
  isBindable,
  asArray,
  Dot,
  fromKey,
} from "@tswift/util";
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
import { h } from "preact";
import { ListMixin } from "./ListMixin";
import { CSSProperties } from "../types";
import { EnvironmentMixin } from "./EnvironmentMixin";
import { bindableState, BindableState, flatRender } from "../state";
import { isBounds, isView } from "../guards";
import { ViewComponent } from "../preact";
import { TransformMixin } from "./TransformMixin";

export type Body<T> =
  | View
  | View[]
  | ((bound: Bound<T> & T) => View | undefined | (View | undefined)[]);

export class ViewableClass<T = any> extends View {
  watch = new Map<string, BindableState<any>>();
  protected _style: CSSProperties = {};
  protected config: Partial<T> = {};
  protected dirty = watchable<boolean>(true);
  protected _tag?: string;
  protected _bound: Bound<this>;
  protected _unsub?: Bindable<unknown>;
  _overlay?: [View, alignment];

  constructor(config?: T | View, ...children: View[]) {
    super();
    const configIsView = isView(config);
    this.config = configIsView ? {} : config || {};
    this.children = configIsView ? [config, ...children] : children;
    this._bound = new Proxy(this, {
      get(target, key) {
        if (isString(key)){
          if (key[0] === '$'){
           return  target.$(key.slice(1) as any)
          }
          return target.$(key).value;
        }
      },
    }) as Bound<this>;
  }
  overlay(overlay: View, alignment: AlignmentKey = '.center') {
    this._overlay = [overlay, fromKey(alignment, AlignmentBase)];
    return this;
  }
  onReceive<K extends keyof this = keyof this>(p: Dot<K>, perform: (e: this[K]) => Void): this;
  onReceive<E>(p: Bindable<E>, perform: (v: E) => Void): this;

  onReceive(p: Bindable<unknown> | string, perform: (e: unknown) => Void) {

    if (typeof p === 'string') {
      this.unsubscribe(this.$(p.slice(1) as keyof this & string).sink(perform));
    } else {
      this.unsubscribe(p.sink(perform));
    }
    return this;
  }
  protected $ = <
    V extends typeof this = typeof this,
    K extends keyof V & string = keyof V & string,
    R = V[K]
  >(
    key: K
  ): Bindable<R> => {
    if (!this.watch.has(key)) {
      const value = has(this, key) ? this[key] : null;
      const watch = isBindable(value)
        ? value
        : isObservableObject(value) ?
          Object.assign(value.objectWillChange, { scope: this, property: key })
          : bindableState<R>(value as unknown as R, this, key);
      const pd = Object.getOwnPropertyDescriptor(this, key);
      if (pd) {
        pd.get = ()=> watch.value;
        if (pd.set) {
          watch.sink(pd.set);
        }
        pd.set = watch;
      } else {
        Object.defineProperty(this, key, {
          configurable: true,
          get() {
            return this.watch.get(key)?.value;
          },
          set(v) {
            this.watch.get(key)?.(v);
          },
        });
      }
      this.watch.set(key, watch);
    }
    return this.watch.get(key) as BindableState<R>;
  };
  /**
   * Try and unsubscribe.    need to unsubscribe children...
   * but I don't have the bandwidth to think about it. 
   * I _think_ we need to pass this into the state bind thing.
   * until then it'll leak.
   * 
   * To make this all work we will prolly need a destroy
   * method, that calls the children.
   * 
   */
  unsubscribe(v: () => unknown) {
    if (!this._unsub) {
      this._unsub = watchable(null) as any;
    }
    this._unsub?.sink(v);
    return this;
  }
  frame(conf: Partial<Bounds & { alignment: AlignmentKey }>) {
    if (isBounds(conf)) {
      Object.assign(this._style, conf);
    }
    return this;
  }
  tag(v: string) {
    this._tag = v;
    return this;
  }
  matchedGeometryEffect(effect: { id: string; in?: string }) {
    return this;
  }
  asStyle(...css: (CSSProperties | undefined | null)[]): CSSProperties {
    const backgroundColor = this._backgroundColor?.value;
    const color = this._foregroundColor?.value;
    return Object.assign(
      {},
      this._font?.style,
      { backgroundColor, color },
      this._border,
      this._padding,
      this._transforms,
      this._style,
      ...css
    );
  }

  body?: Body<this>;

  exec = (): View[] => {
    this._unsub?.();
    if (!this.body) {
      return asArray(this.children);
    }
    if (isView(this.body)) {
      return asArray(this.body);
    }
    if (Array.isArray(this.body)) {
      return this.body;
    }
    return asArray(this.body(this._bound)).flatMap((v) => {
      v.parent = this;
      return v;
    });
  };
  renderExec = () => flatRender(this.exec())


  render() {
    if (this.body) {
      return h(
        ViewComponent,
        {
          class: this.constructor.name,
          watch: this.watch,
          exec: this.renderExec,
        },
        []
      );
    }
    return super.render?.();
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
  ShapeMixin,
  TransformMixin { }
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
  ShapeMixin,
  TransformMixin
);
