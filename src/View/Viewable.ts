import { AlignmentKey } from "../Edge";
import { Bindable, Bound, Bounds } from "../types";
import { applyMixins, has, swifty, watchable } from "../utilit"
import { Apperance } from "./Apperance";
import { PaddingMixin } from "./PaddingMixin";
import { PickerMixin } from "./PickerMixin";
import { Searchable } from './Searchable';
import { FontMixin } from "./FontMixin";
import { Content, View } from "./types";
import { EventsMixin } from "./EventsMixin";
import { ShapeMixin } from './ShapeMixin';
import { AnimationMixin } from './AnimationMixin';
import { ControlMixin } from './ControlMixin';

export class ViewableClass<T = any> extends View {
    private watch = new Map<string, Bindable<any>>;
    protected config: Partial<T>;
    protected dirty = watchable<boolean>(true);
    constructor(config?: T | View, ...views: View[]) {
        super()
        this.config = config instanceof View ? {} : config || {};
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

    body?(bound: Bound<this>, self: this): View
}


export interface ViewableClass extends Apperance, AnimationMixin, EventsMixin, FontMixin, PaddingMixin, PickerMixin,ControlMixin, Searchable, ShapeMixin {

}
export const Viewable = applyMixins(ViewableClass, Apperance,AnimationMixin,  EventsMixin, FontMixin, PaddingMixin, PickerMixin, ControlMixin, Searchable, ShapeMixin)