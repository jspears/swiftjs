import type { AlignmentKey } from '../Edge';
import { isString, applyMixins, has, watchable } from '@tswift/util';
import type { Bindable, Bound, Bounds } from '@tswift/util';
import { ApperanceMixin } from './ApperanceMixin';
import { PaddingMixin } from './PaddingMixin';
import { PickerMixin } from './PickerMixin';
import { Searchable } from './Searchable';
import { FontMixin } from './FontMixin';
import { View } from './View';
import type { Content } from './View';
import { EventsMixin } from './EventsMixin';
import { ShapeMixin } from './ShapeMixin';
import { AnimationMixin } from './AnimationMixin';
import { ControlMixin } from './ControlMixin';
import { NavigationMixin } from './NavigationMixin';
import { toNode } from '../dom';
import { h, Component, Fragment } from 'preact';
import { ListMixin } from './ListMixin';
import { Font } from '../Font';
import { CSSProperties } from '../types';

export class ViewableClass<T = any> extends View {
  private watch = new Map<string, Bindable<any>>();
  protected config: Partial<T> = {};
  protected dirty = watchable<boolean>(true);
  private attrs = new Map<string, string | number>();
  _font: Font = Font.body;

  constructor(config?: T | View, ...children: View[]) {
    super();
    this.config = config instanceof View ? {} : config || {};
    this.children = config instanceof View ? [config, ...children] : children;
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
      const watch = watchable<R>(value as unknown as R);
      const pd = Object.getOwnPropertyDescriptor(this, key);
      if (pd) {
        pd.get = watch;
        if (pd.set) {
          watch.on(pd.set);
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
    return this.watch.get(key) as Bindable<R>;
  };
  frame(conf: Partial<Bounds & { alignment: AlignmentKey }>) {
    return this;
  }


  tag(v: string) {
    return this;
  }
  matchedGeometryEffect(effect: { id: string; in?: string }) {
    return this;
  }
  asStyle(...css:CSSProperties[]):CSSProperties {
    const background = this._backgroundColor;
    const color = this._foregroundColor;
    return Object.assign({}, this._font?.style, 
      background,
      color,
      this._border, this._padding, ...css);
  }
  body?(
    bound: Bound<this>,
    self: this
  ): View | (View | undefined)[] | undefined;
    
  render() {
    if (this.body) {
      const body = () => this.body?.(this.bound(), this);
      return h(ViewComponent as any, { watch: this.watch, body });
    }
    return super.render?.();
  }

  private bound(): Bound<this> {
    return new Proxy(this, {
      get(target, key) {
        if (isString(key) && key['0'] === '$') {
          return target.$(key.slice(1) as any);
        }
      },
    }) as any;
  }
}
type Props = { watch: Map<string, Bindable<any>>; body: () => View | View[] };
class ViewComponent extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.componentWillUnmount = watchable(
      null,
      ...Array.from(props.watch.entries()).map(([key, value]) =>
        value.on((v) => this.setState({ [key]: value }))
      )
    );
  }

  render() {
    return toNode(this.props.body());
  }
}

export interface ViewableClass
  extends ApperanceMixin,
    AnimationMixin,
    ControlMixin,
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
  EventsMixin,
  FontMixin,
  ListMixin,
  NavigationMixin,
  PaddingMixin,
  PickerMixin,
  Searchable,
  ShapeMixin
);
