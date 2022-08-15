import { Dot } from "../types";

export enum Prominence {
    standard,
    increased
}
export type ProminenceKey=Prominence | Dot<keyof typeof Prominence>;

export enum ControlSize {
    mini,
    small,
    regular,
    large
}
export type ControlSizeKey = ControlSize | Dot<keyof typeof ControlSize>;

export class ControlMixin {
    controlProminence(v:ProminenceKey){
        return this;
    }
    controlSize(size:ControlSizeKey){
        return this;
    }
}