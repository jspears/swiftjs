import { View, Viewable } from "../View";
import { asArray, isBindable, isFunction, swifty } from "@tswift/util";
import type { Bindable, Identifiable, Int } from "@tswift/util";
import type { On } from "../View/EventsMixin";
import { h, VNode } from "preact";
import { Environment, State } from "../PropertyWrapper";
import { EditMode } from "../EditMode";
import { ListComponent } from "./ListComponent";
import type { ListConfig, RowContent, HasData, HasSelection, HasId, ContentFn } from "./types";
import { hasContent, hasData, hasId, hasSelection } from "./types";
import { ListComponentProps } from "./ListComponent";
import { Color } from "../Color";
import { createSelection } from './Selection';

type SelectionType = HasSelection['selection'];

export class ListClass<T extends HasId = HasId> extends Viewable<ListConfig<T>> {

  @Environment(".editMode")
  editMode?: Bindable<EditMode>;


  constructor(data: T[], content: RowContent<T>["content"]);
  constructor(
    data: T[],
    selection: SelectionType,
    content:ContentFn<T>
  );
  constructor(selection: SelectionType, ...views: View[]);
  constructor(selection: SelectionType, data: T[]);
  constructor(config: ListConfig<T>, ...views: View[]);
  constructor(config: HasSelection, ...views: View[]);
  constructor(...views: View[]);
  constructor(config?:T[] | HasSelection | SelectionType| ListConfig<T> | View, selection?:T[]|SelectionType|ContentFn<T> | View, content?:ContentFn<T> | undefined | View, ...views:[]) {
    super();
    const args:unknown[] = [config, selection, content, ...views];
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
      this._selection = createSelection(this.config.selection);
    }
  }
  body = () => {
    const editMode = this.editMode?.().isEditing();
    if (this.config?.data && this.config?.content) {
      const selection = this.config.selection;
      const content = this.config.content as RowContent<T>["content"];
      return this.config.data.map(content, this);
    }
    return this.children;
    // return (
    //   this.children?.map((v, idx, { length }) => {
    //     if (v instanceof ForEachClass){
    //       return v.exec();
    //     }
    //     const itm = new ListItem<T>(
    //       {id:idx+''} as unknown as any,
    //       idx,
    //       length,
    //       editMode || false,
    //       v,
    //     );
    //     itm.parent = this;
    //     return itm;
    //   }) || []
    //);
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
    const isEdit = this.editMode?.()?.isEditing
    return h(
      ListComponent,
      {
        body: ()=>asArray(this.exec()).map((v, idx,all)=>v.renderListItem(idx, all.length, isEdit?.())),
        isEdit,
        watch:this.watch,
        selection: this._selection,
        style: { flex: "1", width: "100%" },
        listStyle: this._listStyle,
      } as ListComponentProps,
      []
    );
  }
}

export const List = swifty(ListClass)