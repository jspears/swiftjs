import { Viewable } from './View';
import { swifty } from '@tswift/util';
import { h, Fragment } from 'preact';
import { CSSProperties } from './types';
interface TextConfig {}
class TextClass extends Viewable<TextConfig> {
  public constructor(private text: string) {
    super();
  }
  render() {
    return h('span', {style:this._font?.style}, this.text);
  }
}

export const Text = swifty(TextClass);
