import { Dot } from "./types";
import { applyMixins } from "./utilit";



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

export interface Alignment extends HorizontalAlignment, VerticalAlignment {

}

export const Alignment = applyMixins(class Alignment {}, HorizontalAlignment, VerticalAlignment);

export type AlignmentKey = Alignment | Dot<Exclude<keyof typeof VerticalAlignment | keyof typeof HorizontalAlignment, 'prototype'>>;


export enum Edge {
      top,
      bottom,
      leading,
      trailing
}
export enum EdgeSet {
   top,
   bottom,
   leading,
   trailing,
   horizontal,
   vertical,

}
export type EdgeKey = Edge | Dot<keyof typeof Edge>;
export type EdgeSetKey = EdgeSet | Dot<keyof typeof EdgeSet>;


export enum VerticalEdge {
   top,
   bottom,
}

export type VirticalEdgeKey = VerticalEdge | Dot<keyof typeof VerticalEdge>;

export type VirticalEdgeSetKey = VirticalEdgeKey | VirticalEdgeKey[];