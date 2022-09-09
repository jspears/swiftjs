import { View, Viewable, ViewableClass } from "./View";
import { asArray, has, swifty, toArray } from "@tswift/util";
import {Text} from './Text';
import { Font } from "./Font";
import { TransformFn } from "./types";
import { h, VNode } from "preact";
import { ListComponent, ListComponentProps } from "./List/ListComponent";
import { flatRender } from "./state";

type Content = View | string;
type SectionConfig = {
  header?: Content
  content?: Content;
  footer?: Content;
};

class Header extends Viewable<Content> {
  constructor(content?: Content) {
    super(typeof content === 'string' ? Text(content) : content);
    this.font(Font.subheadline.uppercaseSmallCaps());
    this.padding('.horizontal', 25);
  }
  render(){
    return h('section', {style:this.asStyle(), class:'section-header'}, super.render());
  }
}
class Footer extends Header {
  init() {
    this.font(Font.subheadline);
  }
}

class Body extends Viewable {

  transform:TransformFn = (view, idx, total)=>{
    return view.renderListItem(idx, total);
  }
  constructor(content?: View | string | View[]) {
    super(...(typeof content === 'string' ?  [Text(content)] : Array.isArray(content) ? content : [content] ))
    this.padding('.horizontal', 10)
  }
  renderList = () => {
    
  }
  render(){
    const body = ():VNode<any>[] =>asArray(this.exec()).map((v, idx,all)=>v.renderListItem(idx, all.length, ''+idx));

    return h(ListComponent, {
      body,
      id:'id-body',
      watch:this.watch,
      style: this.asStyle({ flex: "1", width: "100%" }),
      listStyle: this._listStyle,
    } as ListComponentProps)
  }
}
function isConfig(v: unknown): v is SectionConfig {
  return has(v, 'header') || has (v, 'content') || has(v, 'footer');
}
/**
 * header footer content, if no content, than footer becomes content
 * 
 */
class SectionClass extends Viewable<SectionConfig> {
  constructor(header: Content, footer?: Content, content?: Content);
  constructor(config: SectionConfig, ...views:View[]);
  constructor(config: SectionConfig | Content, footer?: Content , content?: Content) {
    super(...(
    isConfig(config) ?
        toArray(config.header && new Header(config.header), 
               (config.content || content || footer ) && 
                  new Body(config.content || content || footer), (config.footer || config && content ) && new Footer(config.footer || footer))
        :
        toArray(config && new Header(config), (content || footer) && new Body(content || footer), content && footer && new Footer(footer))
    ) as View[]
    );
    
  
  }
  init() {
    
  }
  renderListItem(index:number, total:number){
    return this.children[0]?.render();
  }
  render(){
    return h('div', {class:'section'}, flatRender(this.exec()));
  }
}
 
export const Section = swifty(SectionClass);
