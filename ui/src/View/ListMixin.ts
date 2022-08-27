import { DefaultListStyle, ListStyle } from '../ListStyle';

export class ListMixin {
  #listStyle: ListStyle = DefaultListStyle();
  #tableStyle: ListStyle = DefaultListStyle();
  tableStyle(style?: ListStyle): this {
    if (style) this.#tableStyle = style;
    return this;
  }
  listStyle(style?: ListStyle): this {
    if (style) {
      this.#listStyle = style;
    }
    return this;
  }

  getListStyle(): ListStyle {
    return this.#listStyle;
  }
}
