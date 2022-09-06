import { Viewable } from "./View";
import { swifty } from "@tswift/util";
import { h, Fragment, Component } from "preact";
import { CSSProperties } from "./types";
import { bindToState } from "./state";
class TextClass extends Viewable<string> {
  public constructor(private text: string) {
    super();
  }
  init() {
    this.padding(".vertical", 10);
  }
  render() {
    return h(
      TextComponent,
      {
        id:`text-${this.id}`,
        watch: this.watch,
        style: this.asStyle({ display: "block", background: "inherit" }),
      },
      this.text
    );
  }
}
interface TextProps {
  watch: Map<string, unknown>;
  style: CSSProperties;
  id?: string;
}
class TextComponent extends Component<TextProps> {
  constructor(props: TextProps) {
    super();
    bindToState(this, props);
  }
  render() {
    const { watch, ...props } = this.props;
    return h("span", props);
  }
}
export const Text = swifty(TextClass);
