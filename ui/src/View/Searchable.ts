import { Dot } from "@tswift/util";

export enum SearchFieldPlacement {
  automatic,
}
export type SearchFieldPlacementKey =
  | SearchFieldPlacement
  | Dot<keyof typeof SearchFieldPlacement>;

export class Searchable {
  searchable(label: string, query: string, placement: SearchFieldPlacementKey) {
    return this;
  }
}
