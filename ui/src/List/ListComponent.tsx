import { BoolType, Set, OrigSet } from '@tswift/util';
import { Component, h, VNode } from 'preact';
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

  renderListItem(v: View, idx: number, all: unknown[]) {
    const selected = this.isSelected(idx);
    return (
      <li data-id={idx} key={`data-id-idx-${idx}`} data-selected={selected}>
        <span style={this.props.style.itemStyle(idx, all.length)}>
          <Checkbox visible={this.props.isEdit()} checked={selected} />
          {v?.render()}
        </span>
      </li>
    );
  }
    
  render() {
    return (
      <ul onClick={this.onClick} style={this.props.style.style()}>
        {this.props.body().map(this.renderListItem, this)}
      </ul>
    );
    //   return h(
    //     'ul',
    //     {
    //       onClick: this.onClick,
    //       style: this.props.style.style(),
    //     },
    //     this.props.body().map((v, idx, all) => {
    //       const selected = this.isSelected(idx);
    //       return h(
    //         'li',
    //         {
    //           'data-id': idx,
    //           'key':`data-id-idx-${idx}`,
    //           ...(selected ? { 'data-selected': true } : {}),
    //         },
    //         h('span', {
    //           style: this.props.style.itemStyle(idx, all.length),
    //         },
    //           h(Checkbox, { checked: selected, visible:this.props.isEdit() }),
    //           v?.render()
    //         )
    //       )
    //     })
    //   );
  }
}

const Mark = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1rem"
    height="1rem"
    viewBox="0 0 512 512"
  >
    <polyline
      points="416 128 192 384 96 288"
      style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"
    />
  </svg>
);

const Checkbox = ({
  visible,
  checked,
}: {
  visible: boolean;
  checked: boolean;
}) => (
  <span
    style={{
      position: 'relative',
      height: '1.15rem',
      overflow: 'hidden',
      display: 'inline-block',
      width: '1.2rem',
      maxWidth: visible ? '1.2rem' : 0,
      transition: 'left, max-width .4s ease-in-out',
    }}
  >
    <span
      style={{
        borderRadius: '200%',
        height: '1.15rem',
        width: '1.15rem',
        backgroundColor: checked ? Color.blue + '' : 'unset',
        border: `1px solid ${Color.gray}`,
        display: 'inline-block',
        position: 'absolute',
        left: visible ? '0px' : '-5px',
        transition: 'left .4s ease-in-out',
      }}
    >
      <Mark />
    </span>
  </span>
);

// <svg style="color: #f3da35"
//xmlns="http://www.w3.org/2000/svg"
//width="512" height="512"
//viewBox="0 0 512 512"><
//<path d="M448,256c0-106-86-192-192-192S64,150,64,256s86,192,192,192S448,362,448,256Z"
//style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:32px"
//fill="#f3da35"></path><polyline points="352 176 217.6 336 160 272" style="fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></polyline></svg>
