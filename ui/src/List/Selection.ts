import { Set, CountSet, OrigSet, Identifiable } from "@tswift/util";
import { Bindable } from "@tswift/util";
import { isInstanceOf } from "../guards";
import { hasId, Identity, SelectionType, Selection } from "./types";

export const id = <V extends Identity>(
  v: V
): V extends Identifiable ? Identifiable["id"] : string => (hasId(v) ? v.id : v + "");

export const createSelection = <V extends Identity>(
  selection: Bindable<SelectionType>
): Selection<V> => {
  const isSingleSelection = (): boolean => isInstanceOf(selection(), OrigSet);

  return Object.assign(selection, {
    isSingleSelection,
    isSelected(v: Identity): boolean {
      const answer = selection();
      if (answer instanceof CountSet) {
        return answer.has(id(v));
      }
      return answer === id(v);
    },
    toggle(v: Identity): void {
      const answer = selection();
      const vid = id(v);
      if (answer instanceof CountSet) {
        if (answer.has(vid)) {
          answer.delete(vid);
          selection(Set(answer));
          return;
        }
        selection(Set([...answer, vid]));
        return;
      }
      selection(v === answer ? undefined : vid);
    },
  });
};
