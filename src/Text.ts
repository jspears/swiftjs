import { Viewable } from './View';
import { Font, Weight } from './Font';
import { swifty } from './utilit';
import { Color } from './Color';
import { Dot, KeyOfTypeWithType } from './types';
interface TextConfig {

}
class TextClass extends Viewable<TextConfig> {
    public constructor(private text: string) {
        super({});
    }
    font(font: KeyOfTypeWithType<Font>): this {
        return this;
    }
    fontWeight(fontWeight: Weight | Dot<keyof typeof Weight>): this {
        return this;
    }
    bold(): this {
        return this;
    }
    italic(): this {
        return this;
    }
    strikethrough(on: boolean, color:KeyOfTypeWithType<Color>): this {
        return this;
    }
    foregroundColor(color:KeyOfTypeWithType< Color>):this{
        return this;
    }
    
}


export const Text = swifty(TextClass)