import { View, Viewable } from './View';
import {
  swifty,
  Set,
  CountSet,
  has,
  isBindable,
  isFunction,
  KeyPath,
} from '@tswift/util';
import type { Bindable, Constructor, Identifiable, Int } from '@tswift/util';
import type { On } from './View/EventsMixin';
import { Component, h, VNode } from 'preact';
import { DefaultListStyle, ListStyle } from './ListStyle';
import { bindToState } from './state';

type HasSelection<T> = {
  selection: T extends Identifiable
    ? Bindable<CountSet<T['id'] | undefined>> | T['id'] | undefined
    : Bindable<CountSet<T> | T>;
};

type RowContent<T> = {
  content($0?: T): View;
};

type HasData<T> = {
  data: T[];
};

type HasId<T = { id: string }> = {
  id?: KeyPath<T, 'id'>;
};

export type ListConfig<T> = HasData<T> &
  HasId<T> &
  HasSelection<T> &
  RowContent<T>;

function hasContent<T>(v: unknown): v is RowContent<T> {
  return has(v, 'content');
}
function hasData<T>(v: unknown): v is HasData<T> {
  return has(v, 'data');
}
function hasId<T>(v: unknown): v is HasId<T> {
  return has(v, 'id');
}
function hasSelection<T>(v: unknown): v is HasSelection<T> {
  return has(v, 'selection');
}

type DataConfig<T> = HasData<T> &
  RowContent<T> &
  Partial<HasId<T>> &
  Partial<HasSelection<T>>;

export class ListClass<T> extends Viewable<ListConfig<T>> {
  style = DefaultListStyle();

  constructor(data: HasData<T>['data'], content: RowContent<T>['content']);
  constructor(
    data: HasData<T>['data'],
    selection: HasSelection<T>['selection'],
    content: RowContent<T>['content']
  );
  constructor(selection: HasSelection<T>['selection'], ...views: View[]);
  constructor(config: DataConfig<T>);
  constructor(config: HasSelection<T>, ...views: View[]);
  constructor(...views: View[]);
  constructor(...all: unknown[]) {
    super();
    const first = all[0];

    if (
      (first != null && hasContent<T>(first)) ||
      hasData<T>(first) ||
      hasId<T>(first) ||
      hasSelection<T>(first)
    ) {
      this.config = Object.assign(this.config, first, {});
      this.children = all.slice(1) as View[];
    } else {
      if (Array.isArray(all[0])) {
        this.config.data = all.shift() as any;
      }
      if (isBindable(all[0])) {
        this.config.selection = all.shift() as any;
      }
      if (isFunction(all[0])) {
        this.config.content = all.shift() as any;
      }
      this.children = all as View[];
    }
  }
  body = () => {
    if (this.config?.data && this.config?.content) {
      return this.config.data
        .map(this.config.content)
        .filter(Boolean) as View[];
    }
    return this.children || [];
  };
  refreshable(fn: () => void) {
    return this;
  }
  onDelete(fn: On<Set<Int>>) {
    return this;
  }
  render(): VNode<any> {
    return h(
      ListComponent,
      { body: this.body, style: this.style } as StyleListConfig,
      []
    );
  }
}

type StyleListConfig = { body(): View[] } & HasSelection<unknown> & {
    style: ListStyle;
  };

class ListComponent extends Component<StyleListConfig> {
  constructor(props: StyleListConfig) {
    super(props);
    bindToState(this, props);
  }
  onClick = (e: Event) => {
    const { selection } = this.props;

    if (!selection) {
      return;
    }
    const idx = (e.target as HTMLElement).dataset.id;
    if (!idx) {
      return;
    }
    const select = selection();
    if (select instanceof Set) {
      const set = Set(select as Set<any>);
      if (set.size === set.add(idx).size) {
        set.delete(idx);
      }
      selection(set);
    } else {
      selection(idx);
    }
  };

  isSelected(idx: number) {
    if (!this.props.selection) {
      return false;
    }
    const select = this.props.selection();
    if (select instanceof globalThis.Set) {
      return select.has(idx);
    }
    return select === idx;
  }

  render() {
    return h(
      'ul',
      {
        onClick: this.onClick,
        style: this.props.style.style(),
      },
      this.props.body().map((v, idx, all) =>
        h(
          'li',
          {
            'data-id': idx,
            style: this.props.style.itemStyle(idx, all.length),
            ...(this.isSelected(idx) ? { 'data-selected': true } : {}),
          },
          v?.render()
        )
      )
    );
  }
}

export const List = Object.assign(
  <T>(...args: ConstructorParameters<typeof ListClass<T>>) =>
    new ListClass<T>(...args),
  ListClass
);
