import { View, Viewable } from "../View";
import {
  asArray,
  Dot,
  isBindable,
  isFunction,
  keyPath,
  swifty,
} from "@tswift/util";
import type { Bindable, Identifiable, Int } from "@tswift/util";
import type { On } from "../View/EventsMixin";
import { h, VNode } from "preact";
import { Environment, State } from "../PropertyWrapper";
import { EditMode } from "../EditMode";
import { ListComponent } from "./ListComponent";
import type { HasId } from "@tswift/coredata";
import type { ListConfig, SelectionType } from "./types";
import { ListComponentProps } from "./ListComponent";
import { Color } from "../Color";
import { createSelection } from "./Selection";
import { VStack } from "../Stack";
import { TreeItem } from "./TreeItem";
import { dataToView } from "./dataToView";

export class ListClass<T extends HasId = HasId> extends Viewable<
  ListConfig<T>
> {
  @Environment(".editMode")
  editMode?: Bindable<EditMode>;
  _level = 0;
  constructor(config?: ListConfig<T> | View, ...views: []) {
    super(...[config, ...views]);
    if (this.config.selection) {
      this._selection = createSelection(
        this.config.selection as Bindable<SelectionType>
      );
    }
  }

  body = () => {
    if (this.config.data && this.config.content) {
      const { data, content, children } = this.config;
      if (children) {
        return data.map((v) => {
          const child = keyPath(v, children) as T[];
          let ti: View;
          if (child) {
            const li = List({ data: child, children, content } as any);
            li._level++;
            ti = TreeItem({ open: this._level == 1, id: v.id }, content(v), li);
          } else {
            ti = TreeItem({ open: this._level == 1 }, content(v));
          }
          ti.parent = this;
          ti.id = v.id;
          return ti;
        });
      }
      return dataToView(this.config.data, this.config.content, this);
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

  renderExec = () =>
    asArray(this.exec()).map((v, idx, all) =>
      v.renderListItem(idx, all.length)
    );

  render(): VNode<any> {
    const isEdit = this.editMode?.()?.isEditing;
    return h(
      ListComponent,
      {
        exec: this.renderExec,
        isEdit,
        watch: this.watch,
        selection: this._selection,
        style: { flex: "1", width: "100%" },
        listStyle: this._listStyle,
      } as ListComponentProps,
      []
    );
  }
}

export const List = <T extends HasId = HasId>(
  ...args: ConstructorParameters<typeof ListClass<T>>
) => new ListClass<T>(...args);
