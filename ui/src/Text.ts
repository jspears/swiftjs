import { Viewable } from './View';
import { Font, FontKey, Weight } from './Font';
import { swifty } from '@jswift/util';
import { Color, ColorKey } from './Color';
import { Dot, KeyOf, KeyOfTypeWithType } from '@jswift/util';
interface TextConfig {

}
class TextClass extends Viewable<TextConfig> {
    public constructor(private text: string) {
        super();
    }
    render(): HTMLElement | DocumentFragment | Text | undefined {
        return document.createTextNode(this.text);
    }
}


export const Text = swifty(TextClass)