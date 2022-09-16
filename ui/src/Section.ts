import { View, Viewable, ViewableClass } from "./View";
import { asArray, has, swifty, toArray } from "@tswift/util";
import { Text } from "./Text";
import { Font } from "./Font";
import { TransformFn } from "./types";
import { h, VNode } from "preact";
import { ListComponent, ListComponentProps } from "./List/ListComponent";
import { flatRender } from "./state";

type Content = View | string;
type SectionConfig = {
  header?: Content;
  content?: Content;
  footer?: Content;
};

class Header extends Viewable<Content> {
  constructor(content?: Content) {
    super(typeof content === "string" ? Text(content) : content);
    this.font(Font.subheadline.uppercaseSmallCaps());
    this.padding(".horizontal", 15);
  }
  render() {
    return h("section", { style: this.asStyle(), class: "section-header" }, super.render());
  }
}
class Footer extends Header {
  init() {
    this.font(Font.subheadline);
  }
}

class Body extends Viewable {
  transform: TransformFn = (view, idx, total) => {
    return view.renderListItem(idx, total);
  };
  constructor(content?: View | string | View[]) {
    super(...(typeof content === "string" ? [Text(content)] : Array.isArray(content) ? content : [content]));
    this.padding(".horizontal", 0);
  }
  renderExec = () => {
    return asArray(this.exec()).map((v, idx, { length }) => v.renderListItem(idx, length));
  };

  render() {
    return h(ListComponent, {
      exec: this.renderExec,
      class: `$${this.constructor.name}`,
      watch: this.watch,
      style: this.asStyle({ flex: "1", width: "100%" }),
      listStyle: this._listStyle,
    } as ListComponentProps);
  }
}
function isConfig(v: unknown): v is SectionConfig {
  return has(v, "header") || has(v, "content") || has(v, "footer");
}
/**
 * header footer content, if no content, than footer becomes content
 *
 */
class SectionClass extends Viewable<SectionConfig> {
  constructor(header: Content, footer?: Content, content?: Content);
  constructor(config: SectionConfig, ...views: View[]);
  constructor(config: SectionConfig | Content, footer?: Content, content?: Content) {
      //@ts-ignore
      super({},
      //@ts-ignore
      ...toArray(...(isConfig(config) ? [
      //@ts-ignore
      config.header ? new Header(config.header) : undefined,
      //@ts-ignore
      (config.content || content || footer) ? new Body(config.content || content || footer) : undefined,
      //@ts-ignore
      (config.footer || (config && content)) ? new Footer(config.footer || footer) : undefined,
        ] : [ 
      //@ts-ignore
      config ? new Header(config) : undefined,
      //@ts-ignore
      (content || footer) ? new Body(content || footer) : undefined,
      //@ts-ignore
      content && footer ? new Footer(footer) : undefined,
        ]))
    );
  }
  init() {}
  renderListItem(index: number, total: number) {
    return this.children[0]?.render();
  }
  render() {
    return h("div", { class: "section" }, flatRender(this.exec()));
  }
}

export const Section = swifty(SectionClass);
