import { View } from './View';
import { Fragment, h, render as _render, VNode } from 'preact';

export function render(view: View, node?: Element | string | null): void {
  if (!node) {
    throw new Error(`no node found '${node}'`);
  }
  const root = typeof node === 'string' ? document.querySelector(node) : node;
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
    [...(Array.isArray(view) ? view : [view]), ...views].map((v) =>
      v?.render?.()
    )
  );
};
