import { Bindable } from "../types";
import { Content, View } from "./types";

export class NavigationMixin {
    sheet(opts: {
        isPresented: Bindable<boolean>,
        onDismiss(): void,
        content: Content | View
    }) {
        return this;
    }
    navigationTitle(label: string) {
        return this;
    }
    navigationBarItems(items: { leading?: View, trailing?: View }) {
        return this;
    }
}