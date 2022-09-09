import { Viewable } from "./View";
import { isBindable, swifty } from "@tswift/util";
import { Bindable, Bound, KeyOf } from "@tswift/util";
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
        class:'$TextField',
        placeholder: this.config.label,
        value: () => this.config.text,
      } as any);
    } else {
      return h(BoundInput, {
        watch:this.watch,
        placeholder: this.config.label,
        value: this.config.text as any,
      });
    }
  }
}
interface BoundInputProps extends ViewComponentProps {
  placeholder?: string | undefined;
  value: Bindable<string>;
}
class BoundInput extends Component<BoundInputProps, PickBindable<BoundInputProps>> {
  constructor(props:BoundInputProps){
    super(props);
    this.state = bindToState(this, props);
  }

  render() {
    return h("input", {
      value: this.state.value,
      placeholder: this.props.placeholder,
      onInput: (e: Event) => {
        const ele = e.target as HTMLInputElement;
        this.props.value(ele.value);
      },
    });
  }
}
export const TextField = swifty(TextFieldClass);
