import { FillStyleType } from "../FillStyle";
import { Shape } from "../Shape";

export class ShapeMixin {
    clipShape(shape:Shape, style?:FillStyleType){
        return this;
    }
}