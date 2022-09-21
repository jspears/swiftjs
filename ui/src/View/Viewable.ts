import { Alignment, AlignmentBase, AlignmentKey, AlignmentType } from "../Edge";
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
  ObservableObject,
  Hasher,
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
import { AnimationContext } from "../Animation";
import { Transition, AnyTransition } from "../AnyTransition";
import { TransitionView } from "./TransitionView";
import { idFor } from "./identify";

export type Body<T> = View | View[] | ((bound: Bound<T> & T) => View | undefined | (View | undefined)[]);

export class ViewableClass<T = any> extends View {
  protected _style: CSSProperties = {};
  protected config: Partial<T> = {};
  protected dirty = watchable<boolean>(true);
  protected _tag?: string;
  protected _bound: Bound<this>;
  protected _unsub?: Bindable<unknown>;
  _overlay?: [View, AlignmentType];

  constructor(config?: T | View, ...children: View[]) {
    super();
    const configIsView = isView(config);
    this.config = configIsView ? {} : config || {};
    this.children = configIsView ? [config, ...children] : children;
    this._bound = new Proxy(this, {
      get(scope, key) {
        if (isString(key)) {
          if (key[0] === "$") {
            return scope.$(key.slice(1) as any);
          }
          return scope.$(key as any).value;
        }
      },
    }) as Bound<this>;
  }
  overlay(overlay: View, alignment: AlignmentKey = ".center") {
    this._overlay = [overlay, Alignment.fromKey(alignment)];
    return this;
  }
  onReceive<K extends keyof this = keyof this>(p: Dot<K>, perform: (e: this[K]) => Void): this;
  onReceive<E>(p: Bindable<E>, perform: (v: E) => Void): this;

  onReceive(p: Bindable<unknown> | string, perform: (e: unknown) => Void) {
    if (typeof p === "string") {
      this.unsubscribe(this.$(p.slice(1) as keyof this & string).sink(perform));
    } else {
      this.unsubscribe(p.sink(perform));
    }
    return this;
  }
  protected $ = <V extends typeof this = typeof this, K extends keyof V & string = keyof V & string, R = V[K]>(
    key: K,
    bindTo?:Bindable<unknown>
  ): Bindable<R> => {
    if (!this.watch) {
      this.watch = new Map();
    }
    let bound = this.watch.get(key);
    if (!bound) {
      const value = has(this, key) ? this[key] : null;
      if (isObservableObject(value)) {
        bound = Object.assign((value as ObservableObject).objectWillChange, { scope: this, property: key }) as any
      } else if (isBindable(value)) {
        bound = value;
      } else {
        bound = bindableState<R>(value as unknown as R, this, key) as any;
      }
      if (bound == null) {
        throw new Error(`this should not happen, like ever`)
      }
      this.watch.set(key, bound);
    }
    if (AnimationContext.withAnimation) {
      return AnimationContext.withAnimation.tween(bound) as any;
    }
    return bound as Bindable<R>;
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
      this._opacity ? { opacity: this._opacity } : {},
      this._border,
      this._padding,
      this._transforms,
      this._style,
      ...css,
    );
  }

  body?: Body<this>;

  _transition?: AnyTransition;
  transition(transition: TransitionKey) {
    this._transition = Transition.fromKey(transition);
    return this;
  }

  _transitionMap = new Map<number, TransitionView>();

  exec = (): View[] => {
    const ret: View[] = [];
    const views = this._exec();
    const max = Math.max(views.length, Math.max(...(this._transitionMap.keys()))+1);
    for (let idx = 0; idx < max ; idx++){
      const v = views[idx];
      const trans = this._transitionMap.get(idx);
      if (v == null) {
        if (trans) {
          trans.toggle()
          ret.push(trans);
        }      
        continue;
      }
      v.parent = this;
      v._id = idFor(v, idx);
      if (v instanceof Viewable) {
        const isTransition = !!(v._transition || v._onAppear || v._onDisappear)
        if (trans && !isTransition) {
          trans.toggle();
          ret.push(v);
        }else if (isTransition){
          const t = new TransitionView(
            v._transition,
            v._onAppear,
            v._onDisappear,
            v
          );
          this._transitionMap.set(idx, t);
          ret.push(t);
        } else {
          ret.push(v);
        }
      } else {
        ret.push(v);
      }
    }
    return views;
  }

  _exec = (): View[] => {
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
    return asArray(this.body(this._bound)).flatMap((v, idx) => {
      if (!v) {
        return [];
      };
      
      return v;
    });
  };
  renderExec = () => flatRender(this.exec());
 
  render() {
    if (this.body && this.watch) {
      return h(
        ViewComponent,
        {
          class: this.constructor.name,
          watch: this.watch,
          exec: this.renderExec,
        },
        [],
      );
    }
    return super.render?.();
  }
  hash(hasher:Hasher):Hasher {
    return hasher.combine(this.constructor.name).combine(this._tag).combine(this._id);
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
  TransformMixin,
);
