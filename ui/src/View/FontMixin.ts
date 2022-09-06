import { Font, FontKey, WeightKey } from "../Font";
import type { Num } from "@tswift/util";
import { Inherit } from "../Inherit";
import { fromKey } from "@tswift/util";
export class FontMixin {
  @Inherit
  _font?: Font;

  font(f: FontKey) {
    if (typeof f === "string") {
      this._font = fromKey(Font, f);
    } else {
      this._font = f;
    }
    return this;
  }
  bold(f?: boolean) {
    this._font = this._font?.bold();
    return this;
  }
  italic(f?: boolean) {
    this._font = this._font?.italic();
    return this;
  }
  strikethrough(f?: boolean) {
    this._font = this._font?.italic();
    return this;
  }
  underline(f?: boolean) {
    this._font = this._font?.underline();
    return this;
  }
  monospaced(f?: boolean) {
    this._font = this._font?.monospaced();
    return this;
  }
  fontWeight(f?: WeightKey) {
    return this;
  }
  lineSpacing(num?: Num) {
    return this;
  }
}
