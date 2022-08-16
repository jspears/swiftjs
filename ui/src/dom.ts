import { View } from "./View";
import { Fragment, h, render as _render, VNode } from "preact";

export function render(view: View, node: HTMLElement | string): void {
  const root = typeof node === "string" ? document.querySelector(node) : node;
  if (!root) {
    throw new Error(`no node vound '${node}'`);
  }
  const viewNode = toNode(view);
  if (viewNode && root) {
    _render(viewNode, root);
  }
}

export const toNode = (view?: View, ...views: View[]): VNode<any> => {
  if (views.length == 0) {
    if (view) {
      return view.render?.() || h(Fragment, {});
    }
  }
  return h(
    Fragment,
    {},
    [view, ...views].map((v) => v?.render?.())
  );
};
