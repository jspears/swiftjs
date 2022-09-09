import { Dot, fromKey, KeyOf } from "@tswift/util";
import { Angle } from "../unit";
import { swifty } from "@tswift/util";
import { CSSProperties } from "../types";
 class UnitPointClass {
    static zero =  new UnitPointClass(0,0);

    //middle points
    static leading = new UnitPointClass('left', 'center');
    static center = new UnitPointClass('center', 'center');
    static trailing = new UnitPointClass('right', 'center');

    //top points
    static topLeading = new UnitPointClass('top', 'left');
    static top = new UnitPointClass('top', 'center');
    static topTrailing = new UnitPointClass('top', 'right');

    //bottom
    static bottomLeading = new UnitPointClass('bottom', 'left');
    static bottom = new UnitPointClass('bottom', 'center');
    static bottomTrailing = new UnitPointClass('bottom', 'right');

    toTranslate(){
        return `translate(${this.x}, ${this.y})`
    }
    constructor(public x?:number|string, public y?:number|string){

    }
};
const UnitPoint = swifty(UnitPointClass);

export type UnitPointKey = KeyOf<typeof UnitPointClass>;

export class TransformMixin {
    _transforms:CSSProperties = {};

    rotationEffect(angle:Angle, point:UnitPointKey = UnitPoint.zero){
        if (!this._transforms){
            this._transforms = {}
        }
        const unitPoint = fromKey(UnitPoint, point);
        this._transforms['transformOrigin'] = unitPoint.toTranslate();
        this._transforms['transform'] = `${this._transforms['transform']||''} rotate(${angle})`;  
//        this._transforms['transition'] = `${ this._transforms['transition']||''} transform .4s ease-in-out`     
         return this;
    }

    scaleEffect(num:number){

        if (!this._transforms){
            this._transforms = {};
        }
        this._transforms['transform'] = `${this._transforms['transform']||''} scale(${num})`;  

        return this;
    }
}