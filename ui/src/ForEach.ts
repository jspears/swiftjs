import { asArray, Int, map } from "@tswift/util";
import { h, Fragment } from "preact";
import { Inherit } from "./Inherit";
import { flatRender } from "./state";
import { TransformFn } from "./types";
import { View, Viewable } from "./View";

export type IndexSet = Set<Int>;
export type OnDelete = (v: IndexSet) => void;

type ForEachFn<D> = (item: D, idx: number) => View;

export class ForEachClass<I> extends Viewable<{}> {

  @Inherit
  transform?:TransformFn;

  constructor(private data: I[], private content: ForEachFn<I>) {
    super(...data.map(content));
  }

  onDelete(fn: OnDelete): this {
    return this;
  }

  render() {
    
    return h(
      Fragment,
      {},
      this.transform ? asArray(this.exec()).map((v, idx, all)=>v && this.transform?.(v, idx, all.length)) : flatRender(this.exec())
    );
  }
}

export function ForEach<T>(
  ...args: ConstructorParameters<typeof ForEachClass<T>>
) {
  return new ForEachClass<T>(...args);
}

Object.assign(ForEach, ForEach["prototype"]);
