import { Dot, KeyOf, KeyOfTypeWithType } from "@jswift/util";
import { applyMixins } from "@jswift/util";



export class VerticalAlignment {
   static top = new VerticalAlignment();
   static bottom = new VerticalAlignment();
   static firstTextBaseline = new VerticalAlignment()
   static lastTextBaseline = new VerticalAlignment()
   
}
export type VerticalAlignmentKey = KeyOf<typeof VerticalAlignment>;


export class HorizontalAlignment {
   static leading = new HorizontalAlignment()
   static center = new HorizontalAlignment();
   static trailing = new HorizontalAlignment();
 
}
export type HorizontalAlignmentKey = KeyOf<typeof HorizontalAlignment>;



export interface Alignment extends HorizontalAlignment, VerticalAlignment {

}

export const Alignment = applyMixins(class Alignment {}, HorizontalAlignment, VerticalAlignment);

export type AlignmentKey = HorizontalAlignmentKey | VerticalAlignmentKey;

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