import { Constructor, Dot, KeyOf, True, watchable } from "@tswift/util";
import { watch } from "fs";
import { Edge } from "./Edge";
import { EditMode } from "./NavigationView";
import { ColorScheme } from "./View/ApperanceMixin";

export const EnvironmentValues = {
    editMode:watchable(EditMode.active),
    colorScheme:ColorScheme.light,
    dismiss:True()
} as const;

export type EnvironmentValuesKeys = Dot< keyof typeof EnvironmentValues>;

