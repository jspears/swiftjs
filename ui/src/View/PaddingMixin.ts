import {
  Alignment,
  AlignmentBase,
  AlignmentKey,
  Edge,
  EdgeKey,
  HorizontalAlignment,
  VerticalAlignment,
} from '../Edge';
import { fromKey, Num } from '@tswift/util';
import { CSSProperties } from '../types';
import { isNum, unitFor } from '../unit';

type Config = {
  alignment?: AlignmentKey;
  length?: Num;
};
type EdgeInsets = {
  top: Num;
  bottom: Num;
  leading: Num;
  trailing: Num;
};
/*
var top: CGFloat
var bottom: CGFloat
var leading: CGFloat
var trailing: CGFloat*/
export class PaddingMixin {
  protected _padding: CSSProperties = {};

  padding(v?: Config): this;
  padding(length: Num): this;
  padding(edge: EdgeKey[], l: Num): this;
  padding(edge: EdgeInsets, l: Num): this;
  padding(alignment: AlignmentKey, length?: Num): this;
  padding(
    a?: Config | Num | EdgeInsets | EdgeKey[] | AlignmentKey,
    l?: Num
  ): this {
    if (!this._padding) {
      this._padding = {};
    }
    const size = unitFor(l);
    if (Array.isArray(a)) {
      Object.assign(
        this._padding,
        a.reduce((ret, v) => {
          const edge = fromKey(Edge, v as EdgeKey);
          ret[`padding${edge.name}` as keyof CSSProperties] = size;
          return ret;
        }, {} as CSSProperties)
      );
    } else if (isNum(a)) {
      a = unitFor(a);
      Object.assign(this._padding, {
        paddingTop: a,
        paddingRight: a,
        paddingBottom: a,
        paddingLeft: a,
      });
    } else if (typeof a == 'string') {
      const alignment = fromKey(Alignment, a as AlignmentKey);
      if (alignment === Alignment.vertical) {
        Object.assign(this._padding, {
          paddingTop: size,
          paddingBottom: size,
        });
      } else if (alignment === Alignment.horizontal) {
        Object.assign(this._padding, {
          paddingLeft: size,
          paddingRight: size,
        });
      }
    } else if (a == VerticalAlignment) {
      Object.assign(this._padding, {
        top: size,
        bottom: size,
      });
    } else if (a == HorizontalAlignment) {
      Object.assign(this._padding, {
        right: size,
        left: size,
      });
    }
    return this;
  }
}
