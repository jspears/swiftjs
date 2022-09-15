import { asArray, Identifiable, Int, map } from "@tswift/util";
import { h, Fragment } from "preact";
import { Inherit } from "./Inherit";
import { dataToView } from "./List/dataToView";
import { flatRender } from "./state";
import { TransformFn } from "./types";
import { View, Viewable } from "./View";

export type IndexSet = Set<Int>;
export type OnDelete = (v: IndexSet) => void;

type ForEachFn<D> = (item: D) => View;

export class ForEachClass<I extends Identifiable> extends Viewable<{}> {
  @Inherit
  transform?: TransformFn;

  constructor(private data: I[], private content: ForEachFn<I>) {
    super(...dataToView(data, content));
  }

  onDelete(fn: OnDelete): this {
    return this;
  }
  renderListItem(idx: number, all: number) {
    return this.render();
  }
  render() {
    const children = this.exec();
    return h(
      Fragment,
      {},
      this.transform
        ? asArray(children).map((v, idx, all) => v && this.transform?.(v, idx, all.length))
        : flatRender(children),
    );
  }
}

export function ForEach<T extends Identifiable>(...args: ConstructorParameters<typeof ForEachClass<T>>) {
  return new ForEachClass<T>(...args);
}

Object.assign(ForEach, ForEach["prototype"]);
