import { asArray, Bindable, isBindable, watchable } from "@tswift/util";
import { Component, VNode } from "preact";
import { useEffect, useState } from "preact/hooks";
import { LifecycleProps } from "./preact";
import { View } from "./View";

export type PickBindable<T> = {
  [K in keyof T as T[K] extends Bindable<any>
    ? K
    : never]: T[K] extends Bindable<infer Type> ? Type : never;
};

/**
 * Finds all bound
 * @param comp
 * @param props
 * @returns
 */
export const bindToState = <
  T extends LifecycleProps = LifecycleProps,
  Ret = PickBindable<T>
>(
  comp: Component<T>,
  { watch, exec, ...props }: T
): Ret => {
  const state: Record<string, unknown> = {};
  const unsub = watchable(null);
  for (const [key, value] of watch) {
    const $key = `$${key}`;
    unsub.sink(value.sink((v) => comp.setState({ [$key]: v })));
    state[$key] = value();
  }
  for (const [key, value] of Object.entries(props)) {
    if (isBindable(value)) {
      unsub.sink(value.sink((v) => comp.setState({ [key]: v })));
      state[key] = value();
    }
  }
  comp.componentWillUnmount = unsub;
  comp.state = state;
  return state as Ret;
};

export function flatRender(
  render: (View | undefined) | (View | undefined)[]
): VNode<any>[] {
  if (render == null) {
    return [];
  }
  return asArray(render)
    .flatMap((v) => v?.render())
    .filter(Boolean) as VNode<any>[];
}

export const useBindableMap = <T extends LifecycleProps>({
  watch,
  exec,
  ...props
}: T): PickBindable<T> => {
  const [state, setState] = useState({} as Record<string, unknown>);

  useEffect(() => {
    const unsub = watchable(null);

    for (const [key, value] of watch) {
      const $key = `$${key}`;
      unsub.sink(value.sink((v) => setState({ ...state, [$key]: v })));
      state[$key] = value();
    }
    for (const [key, value] of Object.entries(props)) {
      if (isBindable(value)) {
        unsub.sink(value.sink((v) => setState({ ...state, [key]: v })));
        state[key] = value();
      }
    }
    return unsub;
  }, [watch, ...Array.from(Object.values(props).filter(isBindable))]);

  return state as any;
};
