import type { AlignmentKey } from "../Edge";
import {
  isString,
  applyMixins,
  has,
  watchable,
  Void,
  isBindable,
  asArray,
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
import { flatRender } from "../state";
import { isBounds, isView } from "../guards";
import { ViewComponent } from "../preact";
import { TransformMixin } from "./TransformMixin";
import { FillStyle, isGradient } from "../Gradient";

export type Body<T> =
  | View
  | View[]
  | ((bound: Bound<T> & T) => View | undefined | (View | undefined)[]);

export class ViewableClass<T = any> extends View {
  watch = new Map<string, Bindable<any>>();
  protected _style: CSSProperties = {};
  protected config: Partial<T> = {};
  protected dirty = watchable<boolean>(true);
  protected _tag?: string;
  protected _bound: Bound<this>;
  constructor(config?: T | View, ...children: View[]) {
    super();
    const configIsView = isView(config);
    this.config = configIsView ? {} : config || {};
    this.children = configIsView ? [config, ...children] : children;
    this._bound = new Proxy(this, {
      get(target, key) {
        if (isString(key) && key["0"] === "$") {
          return target.$(key.slice(1) as any);
        } else if (isString(key)) {
          return target[key as keyof typeof target];
        }
      },
    }) as Bound<this>;
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
    keys.forEach((key) => {
      if (!this.watch.has(key)) {
        const value = has(this, key) ? this[key] : null;
        const watch = isBindable(value)
          ? value
          : watchable<R>(value as unknown as R);
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
    return this.watch.get(keys[0]) as Bindable<R>;
  };

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
  renderExec = () => flatRender(this.exec());

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
    TransformMixin {}
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
