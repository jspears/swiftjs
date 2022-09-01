import { Viewable } from "./View";
import { isBindable, swifty } from "@tswift/util";
import { Bindable, Bound, KeyOf } from "@tswift/util";
import { Component, h } from "preact";

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
function debind<T>(v: Bindable<T> | T): T {
  if (isBindable<T>(v)) {
    return v();
  }
  return v;
}

class TextFieldClass extends Viewable<TextFieldConfig> {
  focused(focus?: boolean | Bindable<boolean>): this {
    return this;
  }
  submitLabel(key: string) {
    return this;
  }
  onSubmit(fn: () => unknown) {
    return this;
  }
  disableAutocorrection(disable: boolean) {
    return this;
  }
  textInputAutocapitalization(v: KeyOf<typeof TextInputAutocapitalization>) {
    return this;
  }
  render() {
    if (typeof this.config.text == "string") {
      return h("input", {
        placeholder: this.config.label,
        value: () => this.config.text,
      } as any);
    } else {
      return h(BoundInput, {
        placeholder: this.config.label,
        value: this.config.text as any,
      });
    }
  }
}

class BoundInput extends Component<{
  placeholder?: string | undefined;
  value: Bindable<string>;
}> {
  componentDidMount() {
    if (isBindable(this.props.value))
      this.componentWillUnmount = this.props.value.on((value) => {
        this.setState({ value });
      });
  }

  render() {
    return h("input", {
      value: this.props.value(),
      placeholder: this.props.placeholder,
      onInput: (e: Event) => {
        const ele = e.target as HTMLInputElement;
        this.props.value(ele.value);
      },
    });
  }
}
export const TextField = swifty(TextFieldClass);
