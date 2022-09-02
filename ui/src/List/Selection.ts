import { Set, OrigSet, Listen, ObservableObject, has, CountSet, watchable } from "@tswift/util";
import { Bindable } from "@tswift/util";
import { HasId, hasId } from "./types";

type Identity = HasId | string;

export type SelectionType = (string | undefined | null) | CountSet<string>;

export const id = <V extends Identity>(v:V):V extends HasId ? HasId['id'] : string => hasId(v) ? v.id : v + '';

export type Selection<T extends Identity> = Bindable<SelectionType> & {
  isSelected(v:T | string):boolean;
  toggle(v:T | string):void;
}

export const createSelection = <V extends Identity>(selection:Bindable<SelectionType>):Selection<V>=>{

  return Object.assign(selection, {
    isSelected(v:Identity):boolean {
      const answer = selection();
      if (answer instanceof CountSet){
        return answer.has(id(v));
      }
      return answer === v;
    },
    toggle(v:Identity):void {
      const answer = selection();
      if (answer instanceof CountSet){
          if (answer.has(id(v))){
            answer.delete(id(v));
            selection(Set(answer));
          }else{
            selection(Set([...answer, id(v)]));
          }
      }else{
          if ( v === answer){
            selection(null);
          }else{
            selection(id(v));
          }
      }
    }
  })

}
