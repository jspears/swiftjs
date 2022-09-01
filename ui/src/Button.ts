import { View, Viewable } from './View';
import type { Content } from './View';
import { Bindable, has, swifty } from '@tswift/util';
import type { Dot } from '@tswift/util';
import { Environment, State } from './PropertyWrapper';
import { EditMode } from "./EditMode";
import { Component, h } from 'preact';
import { CSSProperties } from './types';
import { bindToState } from './state';
export enum ButtonRole {
  cancel = 'cancel',
  destructive = 'destructive',
  none = 'none',
}
export interface ButtonConfig {
  role?: ButtonRole | Dot<keyof typeof ButtonRole>;
  action?(): void;
  label?: Content | string | View;
  shape?: '.roundedRectangle';
}
export class ButtonStyleConfiguration {
  constructor(arg?: ButtonConfig) { }

}

export const PlainButtonStyle = swifty(ButtonStyleConfiguration);
export const BorderedButtonStyle = swifty(ButtonStyleConfiguration);
export const PrimativeButtonStyle = swifty(ButtonStyleConfiguration);

class ButtonClass extends Viewable<ButtonConfig> {
  style:CSSProperties = {
    cursor:'pointer'
  }
  constructor(config?: ButtonConfig);
  constructor(label?: ButtonConfig['label'], action?: ButtonConfig['action'])
  constructor(label?: ButtonConfig['label'] | ButtonConfig, action?: ButtonConfig['action']) {
    super((label == null ? null : has(label, 'label') ? label : { label, action }) as ButtonConfig);
  }
  init() {
    return this.foregroundColor('.accentColor');
  }
  buttonStyle(style: ButtonStyleConfiguration) {
    return this;
  }
  onAction = this.config?.action;
  role = this.config?.role;
  label = this.config?.label;

  render() {
    const style = this.asStyle(this.style);
    const r = h(ButtonComponent, { action: this.onAction, watch:this.watch, label: this.$('label'), role: this.role, style } as ButtonProps);

    return r;
  }
}

type ButtonProps = { label: Bindable<ButtonConfig['label']>, style: CSSProperties, action(): void, role?: string };

class ButtonComponent extends Component<ButtonProps>{
  constructor(props: ButtonProps) {
    super(props);
    bindToState(this, props);
  }
  render() {
    return h('button', { onClick: this.props.action, role: this.props.role, style: this.props.style }, this.props.label());
  }
}
class EditButtonClass extends ButtonClass {
  @Environment('.editMode')
  editMode?: Bindable<EditMode>
 
  @State
  label: string ;

  constructor(){
    super();
    this.editMode?.().isEditing.sink(v=>{
      this.label = v ? 'Done' : 'Edit';
    })
    this.label = this.editMode?.().isEditing() ? 'Done' : 'Edit';
  }

  onAction = () => {
    const editMode = this.editMode?.()?.isEditing.toggle();
    this.label = editMode ? 'Done' : 'Edit';
  }

}
export const EditButton = swifty(EditButtonClass);
export const Button = swifty(ButtonClass);
