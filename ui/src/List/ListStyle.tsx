import { Color } from '../Color';
import { CSSProperties } from '../types';
import { View } from '../View';
import { Check } from './Check';

export class ListStyle {
  selectedColor = new Color('#D1D1D6');
  private _style: CSSProperties = {
    background: '#fff',
    borderRadius: '10px',
    fontFamily: 'system-ui',
    listStyle: 'none',
    margin: '0',
    textAlign: 'left',
    color: 'rgb(16,16,16)',
    fontSize: '18px',
    width: '100%'
  }
  private _itemStyle: CSSProperties = {
    borderBottom: `1px solid ${this.selectedColor}`,
  }
  constructor() {

  }

  style() {
    return this._style;
  }
  
  itemStyle(idx: number, total: number, selected = false): CSSProperties {
    return Object.assign({}, this._itemStyle, {
      borderColor: idx + 1 == total ? 'transparent' : this.selectedColor.value+'',
      flex: '1',
      display: 'flex',
      flexDirection: 'row',
      cursor: 'pointer',
      alignItems: 'center',
      background: selected ? this.selectedColor + '' : '',
    });
  }
  renderListItem(
    v: View,
    idx: number,
    total: number,
    selected = false,
    edit = false
  ) {
    return (
      <li
        data-id={idx}
        key={`data-id-idx-${idx}`}
        data-selected={selected}
        style={{
          background: selected ? this.selectedColor + '' : '',
          borderTopLeftRadius: idx === 0 ? '10px' : '0',
          borderTopRightRadius: idx === 0 ? '10px' : '0',
          borderBottomLeftRadius: idx === total - 1  ? '10px' : '0',
          borderBottomRightRadius: idx === total - 1 ? '10px' : '0',
          paddingLeft: '15px',
          overflow:'hidden',
        }}
      >
        <span style={this.itemStyle(idx, total, selected)}>
          <Check visible={edit} checked={selected} />
          {v?.render()}
        </span>
      </li>
    );
  }

  bordered(bool: boolean): this {
    return this;
  }
}
export const DefaultListStyle = new ListStyle();
export const BorderedListStyle = new ListStyle();
export const CarouselListStyle = new ListStyle();
export const GroupedListStyle = new ListStyle();
export const InsetListStyle = new ListStyle();
export const InsetGroupedListStyle = new ListStyle();
export const PlainListStyle = new ListStyle();
export const SidebarListStyle = new ListStyle();
