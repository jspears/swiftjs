import { Viewable,  } from './View';
import { Bindable, BoolType, False, swifty } from '@tswift/util';
import { h } from 'preact';
import { Text } from './Text';
import { NavigationConfig } from './NavigationConfig';
import { Font } from './Font';

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
  render() {
    return h('div', {style:this.asStyle({padding:'1rem', flex:'1'}), id:'navigation'}, 
      h('div', {style:{height:'1rem'}}, NavigationConfig._toolbar.map(v=>v.render())),
      Text(NavigationConfig.navigationTitle || '')
        .font(Font.title.bold())
        .padding('.vertical', 10)
        .render(),
      super.render(),
    );
  }
}
export const NavigationView = swifty(NavigationViewClass);
