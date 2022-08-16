import { View, Viewable } from './View';
import { swifty } from '@jswift/util';
import type { Bindable, Int } from '@jswift/util';
import type { On } from './View/EventsMixin';
import type { Content } from './View';
export class ListStyle {}
export const DefaultListStyle = swifty(ListStyle);
export const BorderedListStyle = swifty(ListStyle);
export const CarouselListStyle = swifty(ListStyle);
export const GroupedListStyle = swifty(ListStyle);
export const InsetListStyle = swifty(ListStyle);
export const InsetGroupedListStyle = swifty(ListStyle);
export const PlainListStyle = swifty(ListStyle);
export const SidebarListStyle = swifty(ListStyle);

type HasSelection<T> = {
  selection: Bindable<T> | Bindable<Set<T>>;
};
type HasContent = {
  content: Content;
};
export type ListConfig<T> =
  | (HasSelection<T> & HasContent)
  | HasContent
  | HasSelection<T>;

class RowContent {}
class ListClass<T> extends Viewable<ListConfig<T>> {
  constructor(config: ListConfig<T> | View, ...view: View[]) {
    super(...(config instanceof View ? [config, ...view] : view));
  }
  listStyle(style: ListStyle) {
    return this;
  }
  refreshable(fn: () => void) {
    return this;
  }
  onDelete(fn: On<Set<Int>>) {
    return this;
  }
}

export const List = Object.assign(
  <T>(...args: ConstructorParameters<typeof ListClass<T>>) =>
    new ListClass<T>(...args),
  ListClass
);
