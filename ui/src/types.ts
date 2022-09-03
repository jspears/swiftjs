import type { View } from "./View";
import type { VNode } from "preact";

type CSS = Omit<
  CSSStyleDeclaration,
  | "item"
  | "setProperty"
  | "removeProperty"
  | "getPropertyValue"
  | "getPropertyPriority"
  | "parentRule"
  | number
  | "length"
  | keyof { [Symbol.iterator](): unknown }
>;

export type CSSProperties = Partial<CSS>;
export type TransformFn = (v:View, idx:number, total:number)=>VNode<any>;