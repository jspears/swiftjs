import { Viewable } from './View/Viewable';
import { BoolType, swifty } from '@tswift/util';
import { Bindable,  } from '@tswift/util';
import { View } from './View';
import { bindToState } from './state';
import { Component, h } from 'preact';

export interface ToggleConfig {
  isOn?: boolean;
  $isOn?: BoolType;
}

class ToggleClass extends Viewable<ToggleConfig> {
  
  toggle(v?: boolean): this {
    if (v != null)  {
      this.config.$isOn?.(v)
    } else {
      this.config.$isOn?.toggle();
    }
    return this;
  }
  render() {
    return h(ToggleComponent, this.config, super.render());
  }
}

class ToggleComponent extends Component<ToggleConfig> {
  constructor(props:ToggleConfig) {
    super();
    bindToState(this, props);
  }
  render() {
    if (this.props.isOn  != null ? this.props.isOn : (this.props.$isOn?.())) {
      return this.props.children;
    }
    return null;
  }
}

export const Toggle = swifty(ToggleClass);
