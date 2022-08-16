import { Viewable } from "./View";
import { swifty } from "@jswift/util";
import { h, Fragment } from "preact";
interface TextConfig {}
class TextClass extends Viewable<TextConfig> {
  public constructor(private text: string) {
    super();
  }
  render() {
    return h(Fragment, {}, this.text);
  }
}

export const Text = swifty(TextClass);
