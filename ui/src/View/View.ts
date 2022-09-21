import { asArray, Bindable, HashI, Hashable, Hasher, Identifiable } from "@tswift/util";
import { h, VNode, Fragment } from "preact";
import { EditMode } from "../EditMode";
import { Inherit } from "../Inherit";
import { DefaultListStyle, ListStyle } from "../List/ListStyle";
import { Selection } from "../List/types";
import { Environment } from "../PropertyWrapper";
import { BindableState } from "../state";
import { HasWatch } from "./HasWatch";


export class View implements Identifiable, HasWatch, Hashable {
  id: string = "";
  
  _id = ''
  watch?:Map<string, BindableState<unknown>> = new Map<string, BindableState<unknown>>();

  editMode?:EditMode;

  @Inherit
  _selection?: Selection;

  _listStyle: ListStyle = DefaultListStyle;

  _children: View[] = [];

  _parent?: View;

  set children(children) {
    asArray(children).forEach((v) =>{ 
      v.parent = this
    });
    this._children = children;
  }
  get children(): View[] {
    return this._children;
  }

  set parent(v: View | undefined) {
    if (this._parent && v !== this._parent) {
      console.warn(
        `${this?.constructor?.name} was assigned a different parent, this should not happen new '${v?.constructor?.name}' old '${this._parent?.constructor?.name}'`,
      );
    }
    this._parent = v;
    this.init();
  }

  get parent(): View | undefined {
    return this._parent;
  }

  init() {}

  renderListItem(index: number, total: number): VNode<any> {
    const isEdit = this.editMode?.isEditing() ?? false;
    const id = this.id || index + "";
    const selected = this._selection?.isSingleSelection() || isEdit ? this._selection?.isSelected(id) ?? false : false;
    return this._listStyle.renderListItem(this, index, total, id, isEdit, selected);
  }

  render(): VNode<any> {
    if (this.children) {
      return h(Fragment, {}, ...this.children.map((v) => v.render?.()));
    }
    return h(Fragment, {});
  }
  hash(hasher:HashI):HashI {
    return hasher.combine(this.constructor.name).combine(this.id);
  }
}

export type Content = () => View;
