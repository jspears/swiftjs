import { asArray, Bindable } from "@tswift/util";
import { h, VNode, Fragment } from "preact";
import { Inherit } from "../Inherit";
import { DefaultListStyle, ListStyle } from "../List/ListStyle";
import { HasId, Selection } from "../List/types";

export class View implements HasId {
  id:string ='';
  @Inherit
  _selection?: Selection;

  _listStyle:ListStyle = DefaultListStyle;

  _children: View[] = [];

  _parent?: View;

  set children(children) {
    asArray(children).forEach((v) => (v.parent = this));
    this._children = children;
  }

  get children(): View[] {
    return this._children;
  }

  set parent(v: View | undefined) {
    if (this._parent && v !== this._parent) {
      console.warn(
        `${this?.constructor?.name} was assigned a different parent, this should not happen new '${v?.constructor?.name}' old '${this._parent?.constructor?.name}'`
      );
    }
    this._parent = v;
    this.init();
  }

  get parent(): View | undefined {
    return this._parent;
  }
  
  init() {}
  
  renderListItem(index:number, total:number, edit = false, selected?:boolean):VNode<any>{
    const isSelected = selected == null ? edit ? this._selection?.isSelected(index+'') : false  : false;
    return this._listStyle.renderListItem(this, index, total, edit, isSelected);
  }
  
  render(): VNode<any> {
    if (this.children) {
      return h(Fragment, {}, ...this.children.map((v) => v.render?.()));
    }
    return h(Fragment, {});
  }
}

export type Content = () => View;
