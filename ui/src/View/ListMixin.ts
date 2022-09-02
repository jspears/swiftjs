import { Inherit } from "../Inherit";
import { DefaultListStyle, ListStyle } from "../List/ListStyle";

export class ListMixin {
  @Inherit
  _listStyle: ListStyle = DefaultListStyle;
  @Inherit
  _tableStyle: ListStyle = DefaultListStyle;
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
}
