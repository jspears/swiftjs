import { FillStyleType } from "../FillStyle";
import { ShapeType } from "../Shape";

export class ShapeMixin {
    clipShape(shape:ShapeType, style?:FillStyleType){
        return this;
    }
}