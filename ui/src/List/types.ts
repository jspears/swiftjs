import { Bindable, Identifiable, CountSet, KeyValue, has } from "@tswift/util";
import type { View } from "../View";
export type SelectionType = string | undefined | null | CountSet<string>;
export type Identity = HasId | string;

export type Selection<T extends Identity = Identity> = Bindable<SelectionType> & {
  isSingleSelection():boolean,
  isSelected(v: T | string): boolean;
  toggle(v: T | string): void;
};

export type HasSelection = {
  selection: Bindable<SelectionType>;
};
export type ContentFn<T> = (v:T)=>View;

export type RowContent<T> = {
  content:ContentFn<T>;
};

export type HasData<T> = {
  data: T[];
};

export type HasId = {
  id: string
}
export type ListConfig<T> = HasData<T> &
  HasId &
  HasSelection &
  RowContent<T>;

export function hasContent<T>(v: unknown): v is RowContent<T> {
  return has(v, "content");
}
export function hasData<T>(v: unknown): v is HasData<T> {
  return has(v, "data");
}
export function hasId(v: unknown): v is HasId {
  return has(v, "id");
}
export function hasSelection(v: unknown): v is HasSelection {
  return has(v, "selection");
}
