import { Color } from '../Color';
import { CSSProperties } from '../types';
import { View } from '../View';
import { Check } from './Check';

export class ListStyle {
  
  selectedColor = new Color('#D1D1D6');
  
  unselectedColor = Color.white;

  private _style: CSSProperties = {
    fontFamily: 'system-ui',
    listStyle: 'none',
    flex:'1',
    textAlign: 'left',
    fontSize: '18px',
    width: '100%'
  }
  
  private _itemStyle: CSSProperties = {
    borderBottom: `1px solid ${this.selectedColor}`,
  }

  style(){
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
    });
  }
  renderListItem(
    v: View,
    id:string,
    idx: number,
    total: number,
    selected = false,
    edit = false
  ) {
    return (
      <li
        data-id={id}
        key={`data-id-idx-${id}`}
        data-selected={selected}
        style={{
          background: (selected  && edit ? this.selectedColor : this.unselectedColor)+'',
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
