import { Bindable, Identifiable, CountSet, KeyValue, has } from "@tswift/util";
import { View } from "../View";

export type HasSelection = {
  selection: Bindable<CountSet<string> | string> | undefined;
};

export type RowContent<T> = {
  content($0?: T): View;
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
