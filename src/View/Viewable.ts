import { AlignmentKey } from "../Edge";
import { Bindable, Bound, Bounds } from "../types";
import { applyMixins, has, isString, swifty, watchable } from "../utilit"
import { Apperance } from "./Apperance";
import { PaddingMixin } from "./PaddingMixin";
import { PickerMixin } from "./PickerMixin";
import { Searchable } from './Searchable';
import { FontMixin } from "./FontMixin";
import { Content, View } from "./View";
import { EventsMixin } from "./EventsMixin";
import { ShapeMixin } from './ShapeMixin';
import { AnimationMixin } from './AnimationMixin';
import { ControlMixin } from './ControlMixin';
import { NavigationMixin } from "./NavigationMixin";
import { toNode } from "../dom";

export class ViewableClass<T = any> extends View {
    private watch = new Map<string, Bindable<any>>;
    protected config: Partial<T>;
    protected dirty = watchable<boolean>(true);
    private attrs = new Map<string,string | number>();

    constructor(config?: T | View, ...children: View[]) {
        super()
        this.config = config instanceof View ? {} : config || {};
        this.children = config instanceof View ? [config, ...children] : children;
    }
    protected $ = <V extends typeof this = typeof this,
        K extends keyof V & string = keyof V & string,
        R = V[K]
    >(key: K): Bindable<R> => {
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
                    set: watch
                });
            }
            this.watch.set(key, watch);
        }
        return this.watch.get(key) as Bindable<R>;

    }
    frame(conf: Partial<Bounds & { alignment: AlignmentKey }>) {
        return this;
    }

    toolbar(id: string, content?: Content): this
    toolbar(content?: Content): this
    toolbar(id?: string | Content, content?: Content) {

        return this;
    }
    tag(v: string) {
        return this;
    }
    matchedGeometryEffect(effect: { id: string, in?: string }) {
        return this;
    }

    body?(bound: Bound<this>, self: this): View | (View| undefined)[] | undefined; 

    render(){
        if (this.body){
            const resp = this.body(new Proxy<Bound<this>>(this as Bound<this>, {
                get(target, key){
                    if (isString(key) && key.startsWith('$')){
                        return target.$(key as any);
                    }
                }
            }), this);
            return toNode(...(Array.isArray(resp) ? resp : [resp]));
        }
        return super.render?.();
    }
}


export interface ViewableClass extends Apperance, AnimationMixin, ControlMixin, EventsMixin, FontMixin, NavigationMixin, PaddingMixin, PickerMixin, Searchable, ShapeMixin {

}
export const Viewable = applyMixins(ViewableClass, Apperance, AnimationMixin, ControlMixin, EventsMixin, FontMixin, NavigationMixin, PaddingMixin, PickerMixin, Searchable, ShapeMixin)