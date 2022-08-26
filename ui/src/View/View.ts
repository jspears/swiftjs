import { h, VNode, Fragment } from 'preact';

export class View {
  #children: View[] = [];
  parent?: View;
  set children(children) {
    children.forEach((v) => (v.parent = this));
    this.#children = children;
  }
  get children(): View[] {
    return this.#children;
  }
  render(): VNode<any> {
    if (this.children) {
      return h(Fragment, {}, ...this.children.map((v) => v.render?.()));
    }
    return h(Fragment, {});
  }
}

export type Content = () => View;
