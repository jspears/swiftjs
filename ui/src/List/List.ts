import { View, Viewable } from '../View';
import {
  CountSet,
  has,
  isBindable,
  isFunction,
  BoolType,
  KeyValue,
} from '@tswift/util';
import type { Bindable, Identifiable, Int } from '@tswift/util';
import type { On } from '../View/EventsMixin';
import { h, VNode } from 'preact';
import { DefaultListStyle, ListStyle } from './ListStyle';
import { Environment } from '../PropertyWrapper';
import { EditMode } from '../NavigationView';
import { ListComponent } from './ListComponent';
import { findTarget } from '../dom';
import type { ListConfig, RowContent, HasData,HasSelection } from './types';
import { hasContent, hasData, hasId, hasSelection } from './types';
import { StyleListConfig } from './ListComponent';

export class ListClass<T> extends Viewable<ListConfig<T>> {
  style = DefaultListStyle();
  @Environment('.editMode')
  editMode?: Bindable<EditMode>

  constructor(data: HasData<T>['data'], content: RowContent<T>['content']);
  constructor(
    data: HasData<T>['data'],
    selection: HasSelection<T>['selection'],
    content: RowContent<T>['content']
  );
  constructor(selection: HasSelection<T>['selection'], ...views: View[]);
  constructor(config: ListConfig<T>, ...views: View[]);
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
      {
        body: this.body,
        isEdit: this.editMode?.()?.isEditing,
        selection: this.config.selection, style: this.style
      } as StyleListConfig,
      []
    );
  }
}

  
export const List = Object.assign(
  <T>(...args: ConstructorParameters<typeof ListClass<T>>) =>
    new ListClass<T>(...args),
  ListClass
);
