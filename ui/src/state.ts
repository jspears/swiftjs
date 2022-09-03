import { asArray, Bindable, isBindable, watchable } from "@tswift/util";
import { Component, VNode } from "preact";
import { View } from "./View";
/**
 * Finds all bound
 * @param comp
 * @param props
 * @returns
 */
export const bindToState = <T>(comp: Component<T>, props: T): void => {
  comp.componentWillUnmount = Object.entries(props).reduce(
    (ret, [key, value]) => {
      if (value instanceof Map) {
        for (const [k, v] of value.entries()) {
          applyBindable(ret, comp, k, v);
        }
      } else {
        applyBindable(ret, comp, key, value);
      }
      return ret;
    },
    watchable<unknown>(null)
  );
};

const applyBindable = (
  ret: Bindable<unknown>,
  comp: Component<unknown>,
  key: string,
  value: unknown
) => {
  if (isBindable(value) && !(comp.state && key in comp.state)) {
    ret.sink(value.sink((v) => comp.setState({ [key]: v })));
    ((comp.state || (comp.state = {})) as Record<string, unknown>)[key] =
      value();
  }
};


export function flatRender(render:(View | undefined) | (View | undefined)[]):VNode<any>[] {
  if (render == null){
      return [];
  }
  return asArray(render).flatMap(v=>v?.render()).filter(Boolean) as VNode<any>[];

}