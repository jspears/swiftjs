import { BindableState } from "../state";

export interface HasWatch {
    watch?:Map<string, BindableState<unknown>>;
}