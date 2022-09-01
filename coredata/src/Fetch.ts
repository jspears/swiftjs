import { swifty } from "@tswift/util";

export interface FetchedResults<T> extends Array<T> {}

export class NSSortDescriptorClass {
  ascending?: boolean;
  keyPath?: string;

  constructor({
    keyPath,
    ascending,
  }: {
    keyPath?: string;
    ascending?: boolean;
  }) {
    this.keyPath = keyPath;
    this.ascending = ascending;
  }
}
export const NSSortDescriptor = swifty(NSSortDescriptorClass);
