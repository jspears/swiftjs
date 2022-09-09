import { Bindable,  Identifiable, CountSet, KeyValue, has, Dot } from "@tswift/util";
import type { View } from "../View";
export type SelectionType = string | undefined | CountSet<string>;
export type Identity = Identifiable | string;

export type Selection<T extends Identity = Identity> = Bindable<SelectionType> & {
  isSingleSelection():boolean,
  isSelected(v: T | string): boolean;
  toggle(v: T | string): void;
};

export type HasSelection = {
  selection: Bindable<CountSet<string>> | Bindable<string | null>;
};

export type ContentFn<T> = (v:T)=>View;

export type RowContent<T> = {
  content:ContentFn<T>;
};

export type HasData<T extends Identifiable> = {
  data: T[];
};
 
export type HasChildren<T> = {
  children:Dot<keyof T>
}
export type ListConfig<T extends Identifiable> = HasData<T> &
  HasSelection &
  HasChildren<T> & 
  RowContent<T>;

export function hasContent<T>(v: unknown): v is RowContent<T> {
  return has(v, "content");
}
export function hasData<T extends Identifiable>(v: unknown): v is HasData<T> {
  return has(v, "data");
}
export function hasId(v: unknown): v is Identifiable {
  return has(v, "id");
}
export function hasSelection(v: unknown): v is HasSelection {
  return has(v, "selection");
}
