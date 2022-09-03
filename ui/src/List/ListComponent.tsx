import { BoolType, Set, OrigSet, asArray } from '@tswift/util';
import { Component } from 'preact';
import { bindToState } from '../state';
import { ListStyle } from './ListStyle';
import { View } from '../View';
import { findTarget } from '../dom';
import { CSSProperties } from '../types';
import { Selection } from './Selection';
import { HasId } from './types';

export type StyleListConfig = { body(): View[] }  & {
    listStyle: ListStyle;
    isEdit: BoolType;
    style: CSSProperties;
    selection:Selection<HasId>
  };

const byId = (n: HTMLElement) => n.dataset?.id != null;

export class ListComponent extends Component<StyleListConfig> {
  constructor(props: StyleListConfig) {
    super(props);
    bindToState(this, props);
  }
  onClick = (e: Event) => {
    const isEdit = this.props.isEdit();
    console.log('onClick',isEdit);
    if (!isEdit) {
      return;
    }

    const id = findTarget(byId, e.target as HTMLElement)?.dataset.id;
    if (!id) {
      return;
    }
    console.log('toggle', id);
    this.props.selection.toggle(id);
  };


  render() {
    const children = asArray(this.props.body()).map(v=>{
      if (v.render) {
        return v.render();
      }
      console.log(v, 'has no render?')

    });


    return (
      <div style={this.props.style}>
        <ul onClick={this.onClick} style={this.props.listStyle.style()}>
          {children}
        </ul>
      </div>
    );
  }
}
