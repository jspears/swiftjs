import { asArray, Bindable, swifty, toArray } from "@tswift/util";
import { h, Component } from "preact";
import { ViewComponentProps } from "../preact";
import { State } from "../PropertyWrapper";
import { bindToState, flatRender } from "../state";
import { View, Viewable } from "../View";
import { Text } from '../Text';
import { HStack, VStack } from "../Stack";
import { Spacer } from "../Spacer";
import { degrees } from "../unit";
interface TreeItemProps {
  open?: boolean;
  id:string;
}
class TreeItemClass extends Viewable<TreeItemProps> {
  @State open = false;
  constructor(config: TreeItemProps, private label:View, private list?:View) {
    super(...toArray(config, label, list));
    this.id = config.id;
    if (config.open) {
      this.open = true;
    }
  }  
  
  makeChevron(){
    const chevron = Text('›').foregroundColor('.blue').font('.bold').padding('.trailing', 10);
    if (this.open){
      chevron.rotationEffect(degrees(90))
    }

    return chevron;
  }
  
  body = () => {
    if (this.open && this.list) {
      return VStack({}, HStack({style:{justifyContent:'space-between'}},this.label,  this.makeChevron()), this.list)
    }
    if (!this.list){
      return HStack({},this.label);
    }
    return HStack({style:{justifyContent:'space-between'}}, this.label,  this.makeChevron());
  };

  renderExec = ()=>flatRender(this.exec());
  render(){
    return h(TreeItemComponent, {id:this.id, watch:this.watch, exec:this.renderExec, style:this.asStyle({flex:'1'}), open:this.$('open')})
  }
}
interface TreeItemComponentProps extends ViewComponentProps {
  open: Bindable<boolean>;
}
class TreeItemComponent extends Component<
TreeItemComponentProps,
  { open: boolean, id:string }
> {
  constructor(props: TreeItemComponentProps) {
    super();
    this.state = bindToState(this, props);
  }
  onClick = (e:Event) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    if ((e.currentTarget as HTMLElement)?.dataset?.id === this.props.id ){
      console.log(e);
      this.props.open(!this.state.open);
    }
  };
  render({ watch, open, exec, id, ...rest }: TreeItemComponentProps) {
    return h("div", {...rest, class:'$TreeItem', ['data-id']:id, ['data-open']:open, onClick:this.onClick}, exec?.());
  }
}

export const TreeItem = swifty(TreeItemClass);
