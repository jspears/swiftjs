import { Int } from '@tswift/util';
import { View, Viewable } from './View';

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
}

export function ForEach<T>(
  ...[data, content]: ConstructorParameters<typeof ForEachClass<T>>
) {
  return new ForEachClass<T>(data, content);
}

Object.assign(ForEach, ForEach['prototype']);
