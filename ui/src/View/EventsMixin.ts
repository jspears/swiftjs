import { CSSProperties } from "../types";

export type On<T = unknown> = (t: T) => unknown;
export class EventsMixin {
  _style?:CSSProperties;
  _onTapGesture?:On;
  _onLongPressGesture?:On;
  _onHover?:On;
  _onAppear?:On;
  _onDisappear?:On;
  _disabled?: boolean;
  
  onAppear(appear:On){
    
    this._onAppear = appear;
  }
  onDisappear(appear:On){
    this._onDisappear = appear;
  }
  disabled(disabled?: boolean) {
    this._disabled = disabled;
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
    this._onLongPressGesture = fn;
    return this;
  }
  onHover(fn: On): this {
    this._onHover = fn;
    return this;
  }
}
