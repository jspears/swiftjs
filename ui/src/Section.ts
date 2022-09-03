import { View, Viewable } from "./View";
import { asArray, has, swifty, toArray } from "@tswift/util";
import {Text} from './Text';
import { Font } from "./Font";
import { isViewable } from "./guards";
import { HasId } from "./List/types";

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

  transform = (view:View, idx:number, total:number)=>{
    if (isViewable(view)){
      return view._listStyle.renderListItem(view, {id:`${idx}`} as any, idx, total);
    }else{
      console.log('what is this',view);
      return view;
    }
  }
  constructor(content?: View | string | View[]) {
    super(...(typeof content === 'string' ?  [Text(content)] : Array.isArray(content) ? content : [content] ))
  }
}
function isConfig(v: unknown): v is SectionConfig {
  return has(v, 'header') || has (v, 'content') || has(v, 'footer');
}

const convertToView = (k: string | View) => typeof k === 'string' ? Text(k) : k;

class SectionClass extends Viewable<SectionConfig> {
  constructor(content: Content, header?: Content, footer?: Content);
  constructor(config: SectionConfig, ...views:View[]);
  constructor(config: SectionConfig | Content, header?: Content, footer?: Content) {
    super(...(
    isConfig(config) ?
        toArray(config.header && new Header(config.header), (config.content || header ) && new Body(config.content || header), config.footer && new Footer(config.footer))
        :
        toArray(config && new Header(config), header && new Body(header), footer && new Footer(footer))
    ) as View[]
    );
    
    // super(...(isConfig(config) ? toArray(
    //   config.header && new Header(config.header),
    //   new Body(toArray( ...(config.content ? [config.content] : [header, footer, ...views])).map(convertToView)),
    //   config.footer && new Footer(config.footer)
    // ]) :
    //   toArray(header && new Header(header),
    //     config && new Body(config),
    //     footer && new Footer(footer))
    
    // ))
  }
  init() {
    
  }
}
 
export const Section = swifty(SectionClass);
