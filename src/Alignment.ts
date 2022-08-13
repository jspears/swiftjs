export const Namespace = Object.assign((target:Object, property:PropertyKey)=>{
   
}, {ID:class {}});

export class VerticalAlignment {
    static get top(){
        return top 
     }
     static get bottom(){
        return bottom;
     }
     static get firstTextBaseline(){
        return firstTextBaseline;
     }
     static get lastTextBaseline(){
        return lastTextBaseline;
     }
}

const top = new VerticalAlignment();
const bottom = new VerticalAlignment();
const firstTextBaseline = new VerticalAlignment()
const lastTextBaseline = new VerticalAlignment()

export class HorizontalAlignment {
    static get leading(){
        return leading
     }
     static get center(){
        return center;
     }
     static get trailing(){
        return trailing;
     }
 
}

const leading = new HorizontalAlignment()
const center = new HorizontalAlignment();
const trailing = new HorizontalAlignment();