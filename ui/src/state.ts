import { isBindable, watchable } from '@tswift/util';
import { Component } from 'preact';
/**
 * Finds all bound
 * @param comp
 * @param props
 * @returns
 */
export const bindToState = <T>(comp: Component<T>, props: T): void => {
  comp.componentWillUnmount = Object.entries(props).reduce(
    (ret, [key, value]) => {
      if (isBindable(value)) {
        ret.on(value.on((v) => comp.setState({ [key]: v })));
        ((comp.state || (comp.state = {})) as Record<string, unknown>)[key] =
          value();
      }

      return ret;
    },
    watchable(null)
  );
};
