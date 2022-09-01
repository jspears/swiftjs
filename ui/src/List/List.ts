import { View, Viewable } from "../View";
import { isBindable, isFunction } from "@tswift/util";
import type { Bindable, Identifiable, Int } from "@tswift/util";
import type { On } from "../View/EventsMixin";
import { h, VNode } from "preact";
import { DefaultListStyle, ListStyle } from "./ListStyle";
import { Environment, State } from "../PropertyWrapper";
import { EditMode } from "../EditMode";
import { ListComponent } from "./ListComponent";
import type { ListConfig, RowContent, HasData, HasSelection } from "./types";
import { hasContent, hasData, hasId, hasSelection } from "./types";
import { StyleListConfig } from "./ListComponent";
import { Color } from "../Color";
export class ListItem<T> extends Viewable {
  selected = false;

  constructor(
    private data: T,
    private index: number,
    private total: number,
    private edit: boolean = false,
    private content: RowContent<T>["content"] | View,
    private style: ListStyle = DefaultListStyle,
    private selection?: HasSelection<T>["selection"]
  ) {
    super();
    if (selection) {
      const doSelection = (v: Set<unknown> | unknown) => {
        if (v == null) {
          this.selected = false;
          return;
        } else if (v instanceof Set) {
          this.selected = v.has(this.index + "");
        } else {
          this.selected = v === this.index + "";
        }
        this._backgroundColor = this.selected
          ? this.style.selectedColor
          : Color.white;
      };
      doSelection(selection());
      selection.sink(doSelection);
    } else {
      this._backgroundColor = Color.white;
    }
  }

  render() {
    const content: View =
      this.content instanceof View ? this.content : this.content(this.data);
    content.parent = this;
    return this.style.renderListItem(
      content,
      this.index,
      this.total,
      this.selected,
      this.edit
    );
  }
}
type HasDataContent<T> = HasData<T> & RowContent<T>;

export class ListClass<T> extends Viewable<ListConfig<T>> {
  style = DefaultListStyle;
  @Environment(".editMode")
  editMode?: Bindable<EditMode>;

  constructor(data: HasData<T>["data"], content: RowContent<T>["content"]);
  constructor(
    data: HasData<T>["data"],
    selection: HasSelection<T>["selection"],
    content: RowContent<T>["content"]
  );
  constructor(selection: HasSelection<T>["selection"], ...views: View[]);
  constructor(selection: HasSelection<T>, data:HasDataContent<T>);
  constructor(config: ListConfig<T>, ...views: View[]);
  constructor(config: HasSelection<T>, ...views: View[]);
  constructor(...views: View[]);
  constructor(...args: unknown[]) {
    super();
    let all = args.concat();
    const first = all[0];
    const second = all[1];
    if (hasContent<T>(second) && hasData<T>(second)){
      this.config.content =second.content;
      this.config.data = second.data;
      all  = [first];    
    }
    if (
      (first != null && hasContent<T>(first)) ||
      hasData<T>(first) ||
      hasId<T>(first) ||
      hasSelection<T>(first)
    ) {
      this.config = Object.assign(this.config, first, {});
      this.children = all.slice(1) as View[];
    } else {
      if (Array.isArray(all[0])) {
        this.config.data = all.shift() as any;
      }
      if (isBindable(all[0])) {
        this.config.selection = all.shift() as any;
      }
      if (isFunction(all[0])) {
        this.config.content = all.shift() as any;
      }
      this.children = all as View[];
    }
  }
  body = () => {
    const editMode = this.editMode?.().isEditing();

    if (this.config?.data && this.config?.content) {
      const selection = this.config.selection;
      const content = this.config.content as RowContent<T>["content"];
      return this.config.data.filter(Boolean).map((v, idx, { length }) => {
        const itm = new ListItem(
          v,
          idx,
          length,
          editMode,
          content,
          this._listStyle,
          editMode ? selection : undefined
        );
        itm.parent = this;
        return itm;
      });
    }
    return (
      this.children?.map((v, idx, { length }) => {
        const itm = new ListItem(
          v,
          idx,
          length,
          editMode || false,
          v,
          this._listStyle
        );
        itm.parent = this;
        return itm;
      }) || []
    );
  };
  refreshable(fn: () => void) {
    return this;
  }
  init() {
    this.background(Color.gray).padding(10);
  }
  onDelete(fn: On<Set<Int>>) {
    return this;
  }
  render(): VNode<any> {
    return h(
      ListComponent,
      {
        body: this.exec,
        isEdit: this.editMode?.()?.isEditing,
        selection: this.config.selection,
        style: this.asStyle({ flex: "1", width: "100%" }),
        listStyle: this.style,
      } as StyleListConfig,
      []
    );
  }
}

export const List = Object.assign(
  <T>(...args: ConstructorParameters<typeof ListClass<T>>) =>
    new ListClass<T>(...args),
  ListClass
);
