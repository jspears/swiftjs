export type On<T = unknown> = (t: T) => unknown;
export class EventsMixin {
  _style?:CSSProperties;
  _onTapGesure?:On;
  _onLongPressGesture?:On;
  _onHover?:On;

  disabled(disabled?: boolean) {
    return this;
  }
  onTapGesture(fn: On) {
    if (!this._style){
      this._style = {};
    }
    this._style.cursor = 'pointer';
    this._onTapGesture = fn;
    return this;
  }
  onLongPressGesture(fn: On) {
    this._onLongPressgesture = fn;
    return this;
  }
  onHover(fn: On): this {
    this._onHover = fn;
    return this;
  }
}
