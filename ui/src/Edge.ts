import { Constructor, Dot, fromKey, KeyOf, KeyOfTypeWithType } from '@tswift/util';
import { applyMixins } from '@tswift/util';
import { CSSProperties } from './types';
export abstract class AlignmentBase {
  abstract apply(css: CSSProperties): void;
}
export class VerticalAlignment extends AlignmentBase {
  static top = new VerticalAlignment();
  static bottom = new VerticalAlignment();
  static firstTextBaseline = new VerticalAlignment();
  static lastTextBaseline = new VerticalAlignment();
  apply(v: CSSProperties) {

    switch (this) {
      case VerticalAlignment.top: {
        v.alignItems = 'flex-start';
        break;
      }
      case VerticalAlignment.bottom: {
        v.alignItems = 'flex-end';
        break;
      }
      case VerticalAlignment.firstTextBaseline: {
        break;
      }
      case VerticalAlignment.lastTextBaseline: {
        break;
      }
    }
  }
}
export type VerticalAlignmentKey = KeyOf<typeof VerticalAlignment>;

export class HorizontalAlignment extends AlignmentBase {
  static leading = new HorizontalAlignment();
  static center = new HorizontalAlignment();
  static trailing = new HorizontalAlignment();
  apply(css: CSSProperties) {
    switch (this) {
      case HorizontalAlignment.leading:
        Object.assign(css, { 'textAlign': 'left' })
        break;
      case HorizontalAlignment.trailing:
        Object.assign(css, { 'textAlign': 'right' })
        break;

      case HorizontalAlignment.center:
        Object.assign(css, { 'textAlign': 'center' })
        break;
    }
  }
}

export type HorizontalAlignmentKey = KeyOf<typeof HorizontalAlignment>;

type C = new (...args:any)=>any

export type AlignmentType =  HorizontalAlignment & VerticalAlignment &
Pick<typeof HorizontalAlignment, keyof typeof HorizontalAlignment> &
Pick<typeof VerticalAlignment, keyof typeof VerticalAlignment> &
C & {
  horizontal:HorizontalAlignment,
  vertical:VerticalAlignment
};

export const Alignment:AlignmentType = Object.assign(applyMixins(
  class Alignment extends AlignmentBase {
    apply(css: CSSProperties) {
     
    }
   static vertical = new VerticalAlignment();
   static horizontal = new HorizontalAlignment();
  },
  HorizontalAlignment,
  VerticalAlignment
), HorizontalAlignment, VerticalAlignment);

export type AlignmentKey = KeyOf<typeof Alignment>;

export class Edge {
  constructor(public name: string) {

  }
  static top = new Edge('Top');
  static bottom = new Edge('Bottom');
  static leading = new Edge('Left');
  static trailing = new Edge('Right');
}

export class EdgeSet {
  private _set:Set<Edge> = new Set();
  public name:string;
  constructor(name:string, ...edges:EdgeKey[]);
  constructor(edgeSet:EdgeSet, ...edges:EdgeKey[]);
  constructor( name: string | EdgeSet, ...edges:EdgeKey[]) {
    if (typeof name === 'string'){
      this.name = name;
    }else{
      this.name = name.name;
      this._set = name._set;
    }
    edges.forEach(v=>this._set.add(fromKey(Edge, v as EdgeKey)));
    
  }

  static [Symbol.iterator]() {
    return [Edge.top, Edge.trailing, Edge.bottom, Edge.leading][Symbol.iterator]()
  }
  [Symbol.iterator]() {
    return this._set[Symbol.iterator]();
  }
  static top = new EdgeSet('top', Edge.top);
  static bottom = new EdgeSet('bottom', Edge.bottom);
  static leading = new EdgeSet('leading', Edge.leading);
  static trailing = new EdgeSet('trailing', Edge.trailing)
  static horizontal = new EdgeSet('horizongal', Edge.leading, Edge.trailing);
  static vertical = new EdgeSet('vertical', Edge.top, Edge.bottom);
}

export type EdgeKey = KeyOf<typeof Edge>;
export type EdgeSetKey = KeyOf<typeof EdgeSet>;

export enum VerticalEdge {
  top,
  bottom,
}

export type VirticalEdgeKey = VerticalEdge | Dot<keyof typeof VerticalEdge>;

export type VirticalEdgeSetKey = VirticalEdgeKey | VirticalEdgeKey[];
