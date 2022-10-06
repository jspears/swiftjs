import { Viewable } from "@tswift/ui";
declare global {
  var __SWIFT_UI: Viewable;
  interface Window {
     __SWIFT_UI: Viewable;

  }
}
export { };