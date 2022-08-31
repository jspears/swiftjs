import { View, Viewable,  } from './View';
import { Bindable, BoolType, False, swifty } from '@tswift/util';
import { h, VNode } from 'preact';
import { Text } from './Text';
import { NavigationConfig } from './NavigationConfig';
import { Font } from './Font';
import { Color } from './Color';
import { HStack } from './Stack';

export class EditMode {
  static active = new EditMode('active');
  static inactive = new EditMode('inactive');
  static transient = new EditMode('transient')
  private editing = False();

  constructor(public name:string){

  }
  get wrappedValue(){
    const self = this;
    return {
      get isEditing():boolean {
        return self.isEditing();
      },
      set isEditing(val:boolean){
        self.isEditing(val);
      }
    }
  }

  get isEditing():BoolType {
      return this.editing;
  }
}

class NavigationViewClass extends Viewable {

  body = ()=>[
    HStack({alignment:'.trailing'}, ...NavigationConfig._toolbar).padding(10),
    Text(NavigationConfig.navigationTitle || '')
      .font(Font.title.bold()).padding('.vertical', 10)
      .background('.clear')
      ,
    ...this.children
  ]
  init(){
    this.background(Color.gray);
    return this;
  }
  get _toolbar():View[]{
    return NavigationConfig._toolbar || [];
  }

  render():VNode {
    return h('div', {style:this.asStyle({padding:'1rem', flex:'1', width:'100%'}), id:'navigation'}, super.render());
  }
}
export const NavigationView = swifty(NavigationViewClass);
