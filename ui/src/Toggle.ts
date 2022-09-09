import { Viewable } from "./View/Viewable";
import { BoolType, swifty } from "@tswift/util";
import { Bindable } from "@tswift/util";
import { View } from "./View";
import { bindToState, flatRender, PickBindable } from "./state";
import { Component, h } from "preact";
import { ViewComponentProps } from "./preact";

export interface ToggleConfig  {
  isOn?: boolean;
  $isOn?: BoolType;
}

class ToggleClass extends Viewable<ToggleConfig> {
  toggle(v?: boolean): this {
    if (v != null) {
      this.config.$isOn?.(v);
    } else {
      this.config.$isOn?.toggle();
    }
    return this;
  }
  renderExec = ()=>flatRender(this.exec());
  render() {
    return h(ToggleComponent, {watch:this.watch, ...this.config, exec:this.renderExec});
  }
}
interface ToggleComponentProps extends ViewComponentProps, ToggleConfig {

}

class ToggleComponent extends Component<ToggleComponentProps, PickBindable<ToggleComponentProps>> {
  constructor(props: ToggleComponentProps) {
    super();
    bindToState(this, props);
  }
  render({isOn}:ToggleComponentProps) {
    if (this.props.isOn != null ? this.props.isOn : this.props.$isOn?.()) {
      return this.props.children;
    }
    return null;
  }
}

export const Toggle = swifty(ToggleClass);
