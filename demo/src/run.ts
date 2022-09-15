import { App, CSSProperties, render, View } from "@tswift/ui";
import "preact/debug";

export function run(
  View: View,
  style: CSSProperties = {},
  unstyle: CSSProperties = {},
  appNode: HTMLDivElement | null = document.querySelector("#app"),
) {
  if (appNode == null || appNode.parentElement == null) {
    return;
  }

  render((globalThis.__SWIFT_UI = App(View)), appNode);
  Object.assign(appNode.style, unstyle);
  document.querySelector("#background-input")?.addEventListener("change", (e) => {
    if (appNode) {
      if ((e.target as HTMLInputElement).checked) {
        Object.keys(unstyle).forEach(appNode.style.removeProperty, appNode.style);
        Object.assign(appNode.style, style);
      } else {
        Object.keys(style).forEach(appNode.style.removeProperty, appNode.style);
        Object.assign(appNode.style, unstyle);
      }
    }
  });
}
