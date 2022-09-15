import { Viewable } from "./View";
import { swiftyKey } from "@tswift/util";
import { h, Fragment, Component } from "preact";
import { bindToState } from "./state";
import { ViewComponentProps } from "./preact";
import { Color } from "./Color";

class TextClass extends Viewable<string> {
  _backgroundColor = Color.clear;
  _foregroundColor = undefined;

  public constructor(private text: string) {
    super();
    this.padding(10);
  }
  render(){
  return h(
      TextComponent,
      {
        class: "$Text",
        onClick:this._onTapGesture,
        watch: this.watch,
        style: this.asStyle({ whiteSpace:'nowrap', display: "block" }),
      },
      this.text
    );
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
