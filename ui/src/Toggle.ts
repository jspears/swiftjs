import { Viewable } from "./View/Viewable";
import { asArray, BoolType, Bound, isBindable, swifty } from "@tswift/util";
import { bindToState, flatRender, PickBindable } from "./state";
import { Component, h } from "preact";
import { ViewComponentProps } from "./preact";
import { View } from "./View";
import { State } from "./PropertyWrapper";
import { Label } from "./Label";
import { isView } from "./guards";
export interface ToggleConfig {
  isOn?: boolean | BoolType;
  $isOn?: BoolType;
  isMixed?: boolean;
  label: string | View;
}

class ToggleClass extends Viewable<ToggleConfig> {
  @State isOn = false;
  constructor(config: ToggleConfig, label?: View) {
    super(config, ...asArray(config.label ? (isView(config.label) ? config.label : Label(config.label)) : label));
    if (config.isOn != null) {
      this.isOn = typeof config.isOn === "function" ? config.isOn() : config.isOn;
    }
    if (isBindable(config.isOn)) {
      this.onReceive(config.isOn, (v) => {
        this.isOn = !!v;
      });
    }
  }

  toggle(v?: boolean): this {
    if (v != null) {
      this.config.$isOn?.(v);
    } else {
      this.config.$isOn?.toggle();
    }
    return this;
  }
  body = ({ isOn }: Bound<this>) => {};
  renderExec = () => flatRender(this.exec());
}

interface ToggleComponentProps extends ViewComponentProps, ToggleConfig {}

export const Toggle = swifty(ToggleClass);
