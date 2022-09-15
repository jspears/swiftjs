import { View } from "./View";
import { Fragment, h, render as _render, VNode } from "preact";
import { asArray } from "@tswift/util";

export function render(view: View, node?: Element | string | null): void {
  if (!node) {
    throw new Error(`no node found '${node}'`);
  }
  const root = typeof node === "string" ? document.querySelector(node) : node;
  if (!root) {
    throw new Error(`no node found '${node}'`);
  }
  const viewNode = toNode(view);
  if (viewNode && root) {
    _render(viewNode, root);
  }
}

export const toNode = (view?: View | View[], ...views: View[]): VNode<any> => {
  if (views.length == 0) {
    if (view && !Array.isArray(view)) {
      return view.render?.() || h(Fragment, {});
    }
  }
  return h(
    Fragment,
    {},
    asArray([...asArray(view), ...views]).map((v) => v?.render?.()),
  );
};

export const findTarget = (find: (v: HTMLElement) => boolean, e?: HTMLElement | null): HTMLElement | undefined => {
  if (e == null) return;
  if (find(e)) {
    return e;
  }
  return findTarget(find, e.parentElement);
};
