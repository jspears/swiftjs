import { View, Viewable } from "./View";
import { has, swifty } from "@tswift/util";
import {Text} from './Text';
import { Font } from "./Font";

type Content = View | string;
type SectionConfig = {
  header?: Content
  content?: Content;
  footer?: Content;
};

class Header extends Viewable<Content> {
  constructor(content: Content) {
    super(typeof content === 'string' ? Text(content) : content);
  }
  init() {
    this.font(Font.title.uppercaseSmallCaps());
    this.background('.red');
  }
}
class Footer extends Header {
  init() {
    this.font(Font.subheadline);
  }
}

class Body extends Viewable {

}
function isConfig(v: unknown): v is SectionConfig {
  return has(v, 'header') || has (v, 'content') || has(v, 'footer');
}

class SectionClass extends Viewable<SectionConfig> {
  constructor(content: Content, header?: Content, footer?: Content);
  constructor(config: SectionConfig);
  constructor(config: SectionConfig | Content, header?:Content, footer?:Content){
    super(...(isConfig(config) ? [
      config.header && new Header(config.header),
      config.content && new Body(config.content),
      config.footer &&  new Footer(config.footer)
    ] : [
        header && new Header(header),
        config && new Body(config) ,
        footer && new Footer(footer)    
    ]).filter(Boolean) as View[])
  }
  init() {
    
  }
}

export const Section = swifty(SectionClass);
