import { Viewable } from "./View";
import { swifty, watchable } from "@tswift/util";
import { Bindable, KeyOf } from "@tswift/util";
import { Component, h } from "preact";
import { ViewComponentProps } from "./preact";
import { bindToState, PickBindable } from "./state";

export class TextInputAutocapitalization {
  static characters = new TextInputAutocapitalization();
  //Defines an autocapitalizing behavior that will capitalize every letter.
  static sentences = new TextInputAutocapitalization();
  //Defines an autocapitalizing behavior that will capitalize the first letter in every sentence.
  static words = new TextInputAutocapitalization();
  //Defines an autocapitalizing behavior that will capitalize the first letter of every word.
  static never = new TextInputAutocapitalization();
}

export interface TextFieldConfig {
  label: string;
  text: Bindable<string> | string;
}

class TextFieldClass extends Viewable<TextFieldConfig> {
  _onFocus?: Bindable<boolean>;

  submitLabel(key: string) {
    return this;
  }
  onSubmit(fn: () => unknown) {
    return this;
  }
  focused<T = boolean>(fn: Bindable<T>, t?: T) {
    this._onFocus = (
      t == null
        ? fn
        : watchable(false).sink((v) => {
            if (v) {
              fn(t);
            } else {
              fn();
            }
          })
    ) as Bindable<boolean>;
    return this;
  }
  disableAutocorrection(disable: boolean) {
    return this;
  }
  textInputAutocapitalization(v: KeyOf<typeof TextInputAutocapitalization>) {
    return this;
  }

  handleFocus = () => {
    this._onFocus?.(true);
  };

  handleBlur = () => {
    this._onFocus?.(false);
  };

  render() {
    const props = {
      class: "$TextField",
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      placeholder: this.config.label,
    };
    if (typeof this.config.text == "string") {
      return h("input", {
        ...props,
        value: () => this.config.text,
      } as any);
    } else {
      return h(BoundInput, {
        watch: this.watch,
        ...props,
        value: this.config.text as any,
      });
    }
  }
}
interface BoundInputProps extends ViewComponentProps {
  placeholder?: string | undefined;
  value: Bindable<string>;
  onFocus(): void;
  onBlur(): void;
}
class BoundInput extends Component<
  BoundInputProps,
  PickBindable<BoundInputProps>
> {
  constructor(props: BoundInputProps) {
    super(props);
    this.state = bindToState(this, props);
  }

  onInput = (e: Event) => {
    const ele = e.target as HTMLInputElement;
    this.props.value(ele.value);
  };

  render() {
    return h("input", {
      value: this.state.value,
      placeholder: this.props.placeholder,
      onFocus: this.props.onFocus,
      onBlur: this.props.onBlur,
      onInput: this.onInput,
    });
  }
}
export const TextField = swifty(TextFieldClass);
