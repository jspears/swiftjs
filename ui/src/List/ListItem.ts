import { View, Viewable } from "../View";
import { RowContent, HasId } from "./types";
import { Color } from "../Color";
import { Selection } from './Selection';
import { Inherit } from "../Inherit";
import { isViewable } from "../guards";


export class ListItem<T extends HasId> extends Viewable {

  @Inherit
  selection?: Selection<T>;
  
  selected? = false;


  constructor(
    private data: T,
    private index: number,
    private total: number,
    private edit: boolean = false,
    private content: RowContent<T>["content"] | View
  ) {
    super();


  }
  toggleBackground = ()=>{
    this.selected = this.selection?.isSelected(this.data);
    this._backgroundColor =this.edit && this.selected
      ? this._listStyle.selectedColor
      : Color.white;
  }
  init() {
    this.toggleBackground()
    if (this.selection)
      this.onRecieve(this.selection as any, this.toggleBackground);
  }

  render() {
    const content: View = this.content instanceof View ? this.content : this.content(this.data);
    if (isViewable(content)) {
      content.parent = this;
      return content._listStyle.renderListItem(
        content,
        this.data.id,
        this.index,
        this.total,
        this.selected,
        this.edit
      );
    }
  }
}
