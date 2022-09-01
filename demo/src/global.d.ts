import { App } from "@tswift/ui";
declare global {
  const __SWIFT_UI: ReturnType<typeof App>;
}
