import { BoolType, Set, OrigSet, asArray } from "@tswift/util";
import { Component, VNode } from "preact";
import { bindToState } from "../state";
import { ListStyle } from "./ListStyle";
import { findTarget } from "../dom";
import { CSSProperties } from "../types";
import { HasId, Selection } from "./types";

export type ListComponentProps = { body(): VNode<any>[] } & {
  listStyle: ListStyle;
  isEdit?: BoolType;
  style: CSSProperties;
  selection?: Selection<HasId>;
  id?: string;
};

const byId = (n: HTMLElement) => n.dataset?.id != null;

export class ListComponent extends Component<ListComponentProps> {
  constructor(props: ListComponentProps) {
    super(props);
    bindToState(this, props);
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
      <div style={this.props.style} id={this.props.id}>
        <div onClick={this.onClick} style={this.props.listStyle.style()}>
          {this.props.body()}
        </div>
      </div>
    );
  }
}
