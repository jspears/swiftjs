import { fromKey, Num } from "@tswift/util";
import { Color, ColorKey } from "../Color";
import { Edge, EdgeSet, VerticalEdgeKey, VerticalEdgeSet } from "../Edge";
import { Inherit } from "../Inherit";
import { DefaultListStyle, ListStyle } from "../List/ListStyle";
import { Visibility, VisibilityKey } from "./ApperanceMixin";

export class ListMixin {
  @Inherit
  _listRowSeparator?: {
    visibility: Visibility;
    edges: VerticalEdgeSet;
  };
  @Inherit
  _listRowTint?: [Color, EdgeSet?];
  @Inherit
  _listSectionSeperatorTint?: { color: Color; edges?: VerticalEdgeKey };

  @Inherit
  _listStyle: ListStyle = null as any;

  @Inherit
  _tableStyle: ListStyle = DefaultListStyle;
  _listRowSeperatorTint?: Color;
  _listRowInsets: RowInsets | undefined;

  tableStyle(style?: ListStyle) {
    if (style) this._tableStyle = style;
    return this;
  }
  listStyle(style?: ListStyle) {
    if (style) {
      this._listStyle = style;
    }
    return this;
  }
  listRowSeperatorTint(color?: ColorKey) {
    this._listRowSeperatorTint = color ? fromKey(Color, color) : color;
    return this;
  }
  listRowInsets(row?: RowInsets) {
    this._listRowInsets = row;
  }

  listSectionSeperatorTint(color?: ColorKey, edges?: VerticalEdgeKey): this {
    return this;
  }

  listItemTint(color?: ColorKey): this {
    return this;
  }
  listRowSeparator(
    visibility: VisibilityKey,
    edges: VerticalEdgeKey[] = Array.from(VerticalEdgeSet.all)
  ) {
    this._listRowSeparator = {
      visibility: fromKey(Visibility, visibility),
      edges: new VerticalEdgeSet(...edges),
    };
    return this;
  }
}

type RowInsets = {
  top?: Num;
  bottom?: Num;
  leading?: Num;
  trailing?: Num;
};
