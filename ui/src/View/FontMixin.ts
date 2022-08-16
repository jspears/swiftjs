import { FontKey, WeightKey } from "../Font";
import { Num } from "@jswift/util";

export class FontMixin {

    font(f:FontKey){
        return this;
    }
    bold(f?:boolean){
        return this;
    }
    italic(f?:boolean){
        return this;
    }
    strikethrough(f?:boolean){
        return this;
    }
    underline(f?:boolean){
        return this;
    }
    monospaced(f?:boolean){
        return this;
    }
    fontWeight(f?:WeightKey){
        return this;
    }
    lineSpacing(num?:Num){
        return this;
    }
}
