import { BoolType, Set, OrigSet } from '@tswift/util';
import { Component } from 'preact';
import { bindToState } from '../state';
import { Color } from '../Color';
import { ListStyle } from './ListStyle';
import { View } from '../View';
import { HasSelection } from './types';
import { findTarget } from '../dom';

export type StyleListConfig = { body(): View[] } & HasSelection<unknown> & {
    style: ListStyle;
    isEdit: BoolType;
  };

export class ListComponent extends Component<StyleListConfig> {
  constructor(props: StyleListConfig) {
    super(props);
    bindToState(this, props);
  }
  onClick = (e: Event) => {
    const { selection } = this.props;

    if (!selection) {
      return;
    }
    const idx = findTarget(
      (n) => n.dataset?.id != null,
      e.target as HTMLElement
    )?.dataset.id;
    if (!idx) {
      return;
    }
    const select = selection();
    if (select instanceof OrigSet) {
      const set = Set(select as Set<any>);
      if (set.size === set.add(idx).size) {
        set.delete(idx);
      }
      selection(set);
    } else {
      selection(idx);
    }
  };

  isSelected(idx: number) {
    if (!this.props.selection) {
      return false;
    }
    const select = this.props.selection();
    if (select instanceof globalThis.Set) {
      return select.has(idx + '');
    }
    return select === idx;
  }
    
  render() {
    return (
      <ul onClick={this.onClick} style={this.props.style.style()}>
        {this.props.body().map(v=>v.render(), this)}
      </ul>
    );
  }
}
