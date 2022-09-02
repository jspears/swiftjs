import { View, Viewable } from "../View";
import { isBindable, isFunction } from "@tswift/util";
import type { Bindable, Identifiable, Int } from "@tswift/util";
import type { On } from "../View/EventsMixin";
import { h, VNode } from "preact";
import { DefaultListStyle, ListStyle } from "./ListStyle";
import { Environment, State } from "../PropertyWrapper";
import { EditMode } from "../EditMode";
import { ListComponent } from "./ListComponent";
import type { ListConfig, RowContent, HasData, HasSelection, HasId } from "./types";
import { hasContent, hasData, hasId, hasSelection } from "./types";
import { StyleListConfig } from "./ListComponent";
import { Color } from "../Color";
import { createSelection, Selection } from './Selection';
import { ListItem } from "./ListItem";

type HasDataContent<T> = HasData<T> & RowContent<T>;

export class ListClass<T extends HasId = View> extends Viewable<ListConfig<T>> {

  @Environment(".editMode")
  editMode?: Bindable<EditMode>;

  selection: Selection<T>;

  constructor(data: HasData<T>["data"], content: RowContent<T>["content"]);
  constructor(
    data: HasData<T>["data"],
    selection: HasSelection["selection"],
    content: RowContent<T>["content"]
  );
  constructor(selection: HasSelection["selection"], ...views: View[]);
  constructor(selection: HasSelection["selection"], data: HasDataContent<T>);
  constructor(config: ListConfig<T>, ...views: View[]);
  constructor(config: HasSelection, ...views: View[]);
  constructor(...views: View[]);
  constructor(...args: unknown[]) {
    super();

    let all = args.concat();
    const first = all[0];
    // const second = all[1];
    // if (hasContent<T>(second) && hasData<T>(second)){
    //   this.config.content =second.content;
    //   this.config.data = second.data;
    //   all  = [first];    
    // }
    if (
      (first != null && hasContent<T>(first)) ||
      hasData<T>(first) ||
      hasId(first) ||
      hasSelection(first)
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
      if (isFunction(all[0]) && !(all[0] instanceof View)) {
        this.config.content = all.shift() as any;
      }
      this.children = all as View[];
    }
    if (this.config.selection) {
      this.selection = createSelection(this.config.selection);
    }
  }
  body = () => {
    const editMode = this.editMode?.().isEditing();

    if (this.config?.data && this.config?.content) {
      const selection = this.config.selection;
      const content = this.config.content as RowContent<T>["content"];
      return this.config.data.filter(Boolean).map((data, idx, { length }) => {
        const itm = new ListItem(
          data,
          idx,
          length,
          editMode,
          content,
          editMode ? this.selection : undefined
        );
        itm.parent = this;
        return itm;
      });
    }
    return (
      this.children?.map((v, idx, { length }) => {
        const itm = new ListItem<HasId>(
          {id:idx+''},
          idx,
          length,
          editMode || false,
          v,
          editMode ? this.selection : undefined
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
        watch:this.watch,
        selection: this.selection,
        style: this.asStyle({ flex: "1", width: "100%" }),
        listStyle: this._listStyle,
      } as StyleListConfig,
      []
    );
  }
}

export const List = Object.assign(
  <T extends HasId>(...args: ConstructorParameters<typeof ListClass<T>>) =>
    new ListClass<T>(...args),
  ListClass
);
