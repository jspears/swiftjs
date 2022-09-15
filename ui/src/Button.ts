import { View, Viewable } from "./View";
import type { Content } from "./View";
import { Bindable, has, swifty } from "@tswift/util";
import type { Dot } from "@tswift/util";
import { Environment, State } from "./PropertyWrapper";
import { EditMode } from "./EditMode";
import { Component, h } from "preact";
import { CSSProperties } from "./types";
import { bindToState } from "./state";
import { isView } from "./guards";
import { Text } from "./Text";
import { ViewComponentProps } from "./preact";
export enum ButtonRole {
  cancel = "cancel",
  destructive = "destructive",
  none = "none",
}
export interface ButtonConfig {
  role?: ButtonRole | Dot<keyof typeof ButtonRole>;
  action?(): void;
  label?: string | View;
  shape?: ".roundedRectangle";
}
const defLabel = (v: View | string | undefined): View | undefined => {
  if (isView(v)) {
    return v;
  }
  if (typeof v === "string") {
    return Text(v);
  }
};

export class ButtonStyle {
  constructor(
    public _label = defLabel,
    public _trigger?: (fn?: () => unknown) => () => void,
    public _role?: ButtonRole,
  ) {}
  makeBody(btn: ButtonClass): View {
    if (this._label) {
      btn.label = this._label(btn.label);
    }
    if (this._trigger) {
      btn.onAction = this._trigger(btn.onAction);
    }
    return btn;
  }
}

export const PlainButtonStyle = new (class extends ButtonStyle {
  makeBody(btn: ButtonClass): View {
    btn.foregroundColor(".accentColor");
    return btn;
  }
})();

export const BorderedButtonStyle = new (class extends ButtonStyle {
  makeBody(btn: ButtonClass): View {
    btn.foregroundColor(".accentColor");
    return btn;
  }
})();
export const PrimativeButtonStyle = new (class extends ButtonStyle {
  makeBody(btn: ButtonClass): View {
    btn.foregroundColor(".accentColor");
    return btn;
  }
})();
function isContent(v: unknown): v is View | string {
  return v == null ? false : typeof v === "string" || v instanceof View;
}
class ButtonClass extends Viewable<ButtonConfig> {
  style: CSSProperties = {
    cursor: "pointer",
  };
  _buttonStyle: ButtonStyle = PlainButtonStyle;
  constructor(label?: ButtonConfig["label"] | ButtonConfig, action?: ButtonConfig["action"]) {
    super(
      ...((isContent(label) ? [{ label, action }] : has(label, "label") || has(label, "action") ? [label] : []) as [
        ButtonConfig,
      ]),
    );
    this.font(".body");
  }
  init() {
    return this._buttonStyle.makeBody(this);
  }
  buttonStyle(style: ButtonStyle) {
    return this;
  }
  onAction = this.config?.action;
  role = this.config?.role;
  label = this.config?.label;

  render() {
    const style = this.asStyle(this.style);
    const r = h(ButtonComponent, {
      action: this.onAction,
      watch: this.watch,
      label: this.$("label"),
      role: this.role,
      style,
    } as ButtonProps);

    return r;
  }
}

interface ButtonProps extends ViewComponentProps {
  label: Bindable<ButtonConfig["label"]>;
  style: CSSProperties;
  action(): void;
  role?: string;
}

class ButtonComponent extends Component<ButtonProps> {
  constructor(props: ButtonProps) {
    super(props);
    bindToState(this, props);
  }
  render() {
    return h(
      "button",
      {
        onClick: this.props.action,
        role: this.props.role,
        style: this.props.style,
      },
      this.props.label(),
    );
  }
}
class EditButtonClass extends ButtonClass {
  @Environment(".editMode")
  editMode?: Bindable<EditMode>;

  @State
  label: string;

  constructor() {
    super();
    this.editMode?.().isEditing.sink((v) => {
      this.label = v ? "Done" : "Edit";
    });
    this.label = this.editMode?.().isEditing() ? "Done" : "Edit";
  }

  onAction = () => {
    const editMode = this.editMode?.()?.isEditing.toggle();
    this.label = editMode ? "Done" : "Edit";
  };
}
export const EditButton = swifty(EditButtonClass);
export const Button = (...args: ConstructorParameters<typeof ButtonClass>) => new ButtonClass(...args);
