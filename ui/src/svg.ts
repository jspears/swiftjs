import { VNode,h } from "preact";
import render from "preact-render-to-string";
import { CSSProperties } from "./types";
export const toUri = (node: VNode<any>): string => `data:image/svg+xml;utf-8,${encodeURIComponent(render(node))}`;
export const toCSS = (str: string) => `url('${str}')`;
export const svg = (style:CSSProperties, ...children: (VNode<any>|undefined)[]): VNode<any> => h(
    "svg",
    {
        xmlns: "http://www.w3.org/2000/svg",
        version: "1.1",
        viewBox: "0 0 100 100",
        style
    }, children);