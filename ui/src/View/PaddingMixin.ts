import { AlignmentKey } from "../Edge";
import { Num } from "@jswift/util";

/*
var top: CGFloat
var bottom: CGFloat
var leading: CGFloat
var trailing: CGFloat*/
export class PaddingMixin {
    padding(v?: {
        alignment?: AlignmentKey;
        length?: Num;
    }): this;
    padding(length: Num): this;
    padding(edgeInsets: { top: Num, bottom: Num, leading: Num, trailing: Num }): this;
    padding(alignment: AlignmentKey, length?: Num): this;
    padding(a?: unknown, l?: Num): this {
        return this;
    }
}