import { ColorKey } from "../Color";
import { AlignmentKey, Edge, VerticalEdge, VirticalEdgeKey, VirticalEdgeSetKey } from "../Edge";
import { Dot, KeyOfTypeWithType, Num } from "../types";
import { Content, View } from "../View";

export interface Style {

}
export enum ColorScheme {
    light,
    color,

}
export enum Visibility {
    automatic,
    hidden,
    visible
}
export type VisibilityKey = Visibility | Dot<keyof typeof Visibility>;
export type ColorSchemeKey = ColorScheme | Dot<keyof typeof ColorScheme>;

class ToggleStyleClass {
    static get checkbox() {
        return checkbox;
    }
    static get button() {
        return button;
    }
    static get switcher() {
        return switcher;
    }
    static get automatic() {
        return automatic;
    }
}
const checkbox = new ToggleStyleClass();
const button = new ToggleStyleClass();
const switcher = new ToggleStyleClass();
const automatic = new ToggleStyleClass();


export class Apperance<S extends Style = Style> {
    accentColor(c: ColorKey): this {
        return this;
    }
    backgroundStyle(s: Style): this {
        return this;
    }
    foregroundStyle(s1: Style, s2: Style): this {
        return this;
    }
    foregroundColor(s?: ColorKey): this {
        return this;
    }

    tint(s: S | ColorKey): this {
        return this;
    }

    listRowSeperatorTint(color: ColorKey, edges?: VirticalEdgeSetKey): this {
        return this;
    }
    listSectionSeperatorTint(color?: ColorKey, edges?: VirticalEdgeSetKey): this {
        return this;
    }
    listItemTint(color?: ColorKey): this {
        return this;
    }

    preferredColorScheme(scheme?: ColorSchemeKey) {
        return this;
    }

    border(s: S, width?: Num) {
        return this;
    }
    
    opacity(num:Num){
        return this;
    }
    
    overlay(alignment: AlignmentKey, content: Content | View) {
        return this;
    }
    
    background(color:ColorKey):this;

    background(alignment: AlignmentKey | ColorKey, content?: Content | View):this {
        return this;
    }

    hidden() {
        return this;
    }
    labelsHidden() {
        return this;
    }
    shadow(def: { color: ColorKey, radius: Num, x: Num, y: Num }) {
        return this;
    }
    zIndex(num: Num) {
        return this;
    }
    listRowSeparator(visibility: VisibilityKey, edges?: VerticalEdge[]) {
        return this;
    }
    toggleStyle(style: KeyOfTypeWithType<ToggleStyleClass>) {
        return this;
    }
    fixedSize(e?: Fixed):this;
    fixedSize(fixed?: boolean | Fixed) {
        return this;
    }
}

type Fixed = {
    horizontal: boolean;
    vertical: boolean;
}