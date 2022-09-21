import { Viewable } from "./View";
import { Hasher, swiftyKey } from "@tswift/util";
import { h, Fragment, Component } from "preact";
import { bindToState } from "./state";
import { ViewComponentProps } from "./preact";
import { Color } from "./Color";
import {Font} from './Font';
class TextClass extends Viewable<string> {
  _backgroundColor = Color.clear;
  _foregroundColor = undefined;
  _font = Font.body;

  public constructor(private text: string) {
    super();
    this.padding(10);
  }
  render() {
    const style = this.asStyle({ whiteSpace: "nowrap", display: "block" });
    return h(
      TextComponent,
      {
        class: "$Text",
        onClick: this._onTapGesture,
        watch: this.watch,
        style,
      },
      this.text,
    );
  }
  hash(hasher:Hasher):Hasher{
    return hasher.combine('Text').combine(this.text);
  }
}

class TextComponent extends Component<ViewComponentProps> {
  constructor(props: ViewComponentProps) {
    super();
    bindToState(this, props);
  }
  render() {
    const { watch, exec, ...props } = this.props;
    return h("span", props);
  }
}
export const Text = swiftyKey(TextClass);
