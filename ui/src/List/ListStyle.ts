import { swifty } from '@tswift/util';
import { VNode } from 'preact';
import { CSSProperties } from '../types';
import { View } from '../View';

export class ListStyle {
  constructor(
    private _style: CSSProperties = {
      background: '#fff',
      borderRadius: '10px',
      fontFamily: 'system-ui',
      listStyle: 'none',
      margin: '0',
      padding: '0 0 0 15px ',
      textAlign: 'left',
      color: 'rgb(16,16,16)',
      fontSize: '18px',
    },
    private _itemStyle: CSSProperties = {
      borderBottom: '1px solid rgb(226,226,228)',
      padding: '12px 0 10px 0',
    }
  ) {}
 
  style() {
    return this._style;
  }
  list(children: View[]):VNode {
    return null as any;
  }
  listItem(v: View, idx: number, total:number): VNode {
    return null as any;
  }
  itemStyle(idx: number, total: number): CSSProperties {
    return Object.assign({}, this._itemStyle, {
      borderColor: idx + 1 == total ? 'transparent' : 'rgb(226,226,228)',
      flex:'1',
      display:'flex',
      flexDirection:'row',
      cursor:'pointer'
    });
  }
  bordered(bool: boolean): this {
    return this;
  }
}
export const DefaultListStyle = swifty(ListStyle);
export const BorderedListStyle = swifty(ListStyle);
export const CarouselListStyle = swifty(ListStyle);
export const GroupedListStyle = swifty(ListStyle);
export const InsetListStyle = swifty(ListStyle);
export const InsetGroupedListStyle = swifty(ListStyle);
export const PlainListStyle = swifty(ListStyle);
export const SidebarListStyle = swifty(ListStyle);
