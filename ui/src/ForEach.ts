import { Int } from "@tswift/util";
import { h, Component, render, Fragment } from "preact";
import { View, Viewable } from "./View";

export type IndexSet = Set<Int>;
export type OnDelete = (v: IndexSet) => void;

type ForEachFn<D> = (item: D, idx: number) => View;

class ForEachClass<I> extends Viewable<{}> {
  constructor(private data: I[], private content: ForEachFn<I>) {
    super();
  }

  body = () => this.data.map(this.content);

  onDelete(fn: OnDelete): this {
    return this;
  }

  render() {
    return h(
      Fragment,
      {},
      this.body()?.map((v) => v?.render())
    );
  }
}

export function ForEach<T>(
  ...args: ConstructorParameters<typeof ForEachClass<T>>
) {
  return new ForEachClass<T>(...args);
}

Object.assign(ForEach, ForEach["prototype"]);
