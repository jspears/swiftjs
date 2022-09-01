import { NSManagedObjectContext } from "@tswift/coredata";
import { KeyPath, True, watchable } from "@tswift/util";
import { EditMode } from "./EditMode";
import { ColorScheme } from "./View/ColorScheme";

export const EnvironmentValues = {
  editMode: watchable(EditMode.active),
  colorScheme: ColorScheme.light,
  dismiss: True(),
  managedObjectContext:new NSManagedObjectContext()
} as const;

export type EnvironmentValuesKeys = KeyPath<typeof EnvironmentValues>;
