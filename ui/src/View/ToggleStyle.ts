import { BoolType } from "@tswift/util";
import { h } from "preact";
import { CSSProperties } from "../types";

export abstract class ToggleStyle {
  public name: string;
  static checkbox = new (class extends ToggleStyle {
    constructor() {
      super("checkbox");
    }
    toNode(id: string, style: CSSProperties, value: BoolType) {
      return h("input", {
        id,
        type: "checkbox",
        onChange: value.toggle,
        class: "$ToggleStyle$Checkbox",
        style,
      });
    }
  })();

  static button = new (class extends ToggleStyle {
    constructor() {
      super("button");
    }
  })();
  static switcher = new (class extends ToggleStyle {
    constructor() {
      super("switcher");
    }
    toNode(id: string, style: CSSProperties, value: BoolType) {
      return h("input", {
        id,
        type: "checkbox",
        onChange: value.toggle,
        class: `$ToggleStyle$Checkbox`,
        style,
      });
    }
  })();
  //TODO - Choose based on whatever logic is used
  static automatic = ToggleStyle.switcher;
  // static automatic = new class extends ToggleStyle {
  //   constructor() {
  //     super("automatic");
  //   }
  // };
  private constructor(name: string) {
    this.name = name;
  }
}
