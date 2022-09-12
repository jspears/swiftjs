import { Bindable } from '@tswift/util';
import { VNode } from 'preact';
import { Color } from '../Color';
import { EditMode } from '../EditMode';
import { Inherit } from '../Inherit';
import { CSSProperties, HasRender, HasRenderListItem, ListStyleRenderListItem } from '../types';
import { unitFor } from '../unit';
import { Check } from './Check';
import { Selection } from './types';

export class ListStyle implements ListStyleRenderListItem{
  
  selectedColor = new Color('#D1D1D6');
  
  unselectedColor = Color.white;

  private _style: CSSProperties = {
    fontFamily: 'system-ui',
    listStyle: 'none',
    flex:'1',
    textAlign: 'left',
    fontSize: unitFor(18),
    width: '100%'
  }
  
  private _itemStyle: CSSProperties = {
    borderBottom: `${unitFor(1)} solid ${this.selectedColor}`,
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
    v: HasRender,
    idx: number,
    total: number,
    id?: string,
    edit: boolean = false,
    selected: boolean = false,
  ): VNode<any> {
    id = id || `${idx}`;
    return (
      <div
        data-id={id}
        key={`data-id-idx-${id}`}
        class='$ListStyle'
        data-selected={selected}
        style={{
          background: (selected  && edit ? this.selectedColor : this.unselectedColor)+'',
          borderTopLeftRadius: idx === 0 ? unitFor(10) : '0',
          borderTopRightRadius: idx === 0 ? unitFor(10) : '0',
          borderBottomLeftRadius: idx === total - 1  ? unitFor(10) : '0',
          borderBottomRightRadius: idx === total - 1 ? unitFor(10) : '0',
          paddingLeft: unitFor(10),
          paddingRight: unitFor(10),
          overflow:'hidden',
        }}
      >
        <span style={this.itemStyle(idx, total, selected)} class='$ListStyle$inner'>
          <Check visible={edit} checked={selected} />
          {v?.render()}
        </span>
      </div>
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
