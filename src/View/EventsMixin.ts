
export type On<T=unknown> = (t:T)=>unknown;
export class EventsMixin {
    disabled(disabled?:boolean) {
        return this;
    }
    onTapGesture(fn:On) {
        return this;
    }
    onLongPressGesture(fn:On) {
        return this;
    }
    onHover(fn:On):this {
        return this;
    }
}