import {  KeyPath, True, watchable } from "@tswift/util";
import { EditMode } from "./EditMode";
import { ColorScheme } from "./View/ApperanceMixin";

export const EnvironmentValues = {
    editMode: watchable(EditMode.active),
    colorScheme: ColorScheme.light,
    dismiss: True()
} as const;


    
export type EnvironmentValuesKeys = KeyPath<typeof EnvironmentValues>;
