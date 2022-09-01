import { Bindable, Identifiable, CountSet, KeyValue, has } from "@tswift/util";
import { View } from "../View";

export type HasSelection<T> = {
  selection: T extends Identifiable
    ? Bindable<CountSet<T["id"]> | T["id"] | undefined>
    : Bindable<CountSet<T> | T | undefined>;
};

export type RowContent<T> = {
  content($0?: T): View;
};

export type HasData<T> = {
  data: T[];
};

export type HasId<T = { id: string }> = {
  id?: KeyValue<T, "id">;
};

export type ListConfig<T> = HasData<T> &
  HasId<T> &
  HasSelection<T> &
  RowContent<T>;

export function hasContent<T>(v: unknown): v is RowContent<T> {
  return has(v, "content");
}
export function hasData<T>(v: unknown): v is HasData<T> {
  return has(v, "data");
}
export function hasId<T>(v: unknown): v is HasId<T> {
  return has(v, "id");
}
export function hasSelection<T>(v: unknown): v is HasSelection<T> {
  return has(v, "selection");
}
