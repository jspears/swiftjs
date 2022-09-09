import { BoolType, Set, OrigSet, asArray } from "@tswift/util";
import { Component, VNode } from "preact";
import { bindToState } from "../state";
import { ListStyle } from "./ListStyle";
import { findTarget } from "../dom";
import { Selection } from "./types";
import { ViewComponentProps } from "../preact";

export interface ListComponentProps extends ViewComponentProps{
  listStyle: ListStyle;
  isEdit?: BoolType;
  selection?: Selection;
};

const byId = (n: HTMLElement) => n.dataset?.id != null;

export class ListComponent extends Component<ListComponentProps> {
  constructor(props: ListComponentProps) {
    super(props);
    this.state = bindToState(this, props);
  }
  onClick = (e: Event) => {
    if (this.props.selection) {
      const id = findTarget(byId, e.target as HTMLElement)?.dataset.id;
      console.log("id", id);
      if (!id) {
        return;
      }
      this.props.selection?.toggle(id);
    }
  };

  render() {
    return (
      <div style={this.props.style} id={this.props.id} class='$List'>
        <div onClick={this.onClick} style={this.props.listStyle.style()} class={'$List$inner'}>
          {this.props.exec?.()}
        </div>
      </div>
    );
  }
}
