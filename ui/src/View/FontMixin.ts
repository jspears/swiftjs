import { Font, FontKey, WeightKey } from '../Font';
import { Num,  } from '@tswift/util';

export class FontMixin {
  _font: Font = Font.body;

  font(f: FontKey) {
    if (typeof f === 'string') {
      this._font = Font[f.slice(1) as keyof typeof Font];
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
    this._font = this._font.italic();
    return this;
  }
  strikethrough(f?: boolean) {
    this._font = this._font.italic();
    return this;
  }
  underline(f?: boolean) {
    this._font = this._font.underline();
    return this;
  }
  monospaced(f?: boolean) {
    this._font = this._font.monospaced();
    return this;
  }
  fontWeight(f?: WeightKey) {
    return this;
  }
  lineSpacing(num?: Num) {
    return this;
  }
}
