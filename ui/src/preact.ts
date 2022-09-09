import { Bindable } from "@tswift/util";
import { Component, VNode } from "preact";
import { bindToState, PickBindable } from "./state";
import { CSSProperties } from "./types";

export interface LifecycleProps {
  //Calling it exec, cause children has special meaning,
  //that doesn't quite work for us.
  exec?(): VNode<any>[];
  watch: Map<string, Bindable<unknown>>;
  class?: string;
}

export interface ViewComponentProps extends LifecycleProps {
  style?: CSSProperties;
  id?: string;
}

export class ViewComponent<T, S = {}> extends Component<
  T & ViewComponentProps,
  PickBindable<T & ViewComponentProps & S>
> {
  constructor(props: T & ViewComponentProps) {
    super(props);
    this.state = bindToState(this, this.props);
  }

  render() {
    return this.props.exec?.();
  }
}
