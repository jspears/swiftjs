import { Dot } from "../types";

export enum SearchFieldPlacement {
    automatic
}
export type SearchFieldPlacementKey = SearchFieldPlacement |  Dot<keyof typeof SearchFieldPlacement>;

export class Searchable {
    searchable(label:string, query:string, placement:SearchFieldPlacementKey){
        return this;
    }
}