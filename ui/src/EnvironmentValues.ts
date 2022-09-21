import { NSManagedObjectContext } from "@tswift/coredata";
import { Published, KeyPath, True, watchable, ObservableObject, BoolType } from "@tswift/util";
import Color from "color";
import { EditMode } from "./EditMode";
import { ColorScheme } from "./View/ColorScheme";

export interface EnvironmentValues {
  editMode: EditMode;
  colorScheme: ColorScheme;
  dismiss: BoolType;
  managedObjectContext: NSManagedObjectContext;
} 

export class EnvironmentValuesClass extends  ObservableObject implements EnvironmentValues{
  @Published editMode = EditMode.active;
  @Published colorScheme = ColorScheme.light;
  @Published dismiss = True();
  @Published managedObjectContext = new NSManagedObjectContext();
  constructor(values: Partial<EnvironmentValues>) {
    super();
    Object.assign(this, values);
    const set = new Set(Object.keys(this));
    Object.keys(values).forEach(property=>set.has(property) || Published(this, property));
  }
};

// export const EnvironmentValues = new EnvironmentValuesClass({});

export type EnvironmentValuesKeys = KeyPath<Omit<EnvironmentValues, 'objectWillChange'>>;
