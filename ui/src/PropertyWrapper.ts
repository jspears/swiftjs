import { AnimationKey } from "./Animation";
import { View, ViewableClass } from "./View/index";
import { EnvironmentValues, EnvironmentValuesKeys } from "./EnvironmentValues";
import { Bindable, Dot, fromKey, keyPath, ObservableObject, UUID } from "@tswift/util";

export function FocusState(target: Object, propertyKey: PropertyKey) {
  Reflect.defineProperty(target, propertyKey, {
    get() {
      return this.$(propertyKey)();
    },
    set(v) {
      this.$(propertyKey)(v);
    },
  });
}
export function State(target: Object, propertyKey: PropertyKey) {
  Reflect.defineProperty(target, propertyKey, {
    configurable: true,
    get() {
      return this.$(propertyKey).value;
    },
    set(v) {
      this.$(propertyKey)(v);
    },
  });
}
function boundToParent(view: View, property: string): Bindable<unknown> {
  if (!view) {
    throw new Error(`Could not find state for binding '${property}' in parents check name`);
  }
  const current = view.watch.get(property);
  if (current != null) {
    return current;
  }
  return boundToParent(view, property);
}

export function Binding(target: View, property: string) {
  Reflect.defineProperty(target, property, {
    configurable: true,
    get() {
      return boundToParent(this, property)?.value;
    },
    set(v) {
      return boundToParent(this, property)(v);
    },
  });
}

export function Namespace(target: Object, propertyKey: PropertyKey) {
  Reflect.defineProperty(target, propertyKey, {
    value: UUID(),
  });
}

export function Environment(property: EnvironmentValuesKeys) {
  return function (target: Object, propertyKey: PropertyKey) {
    Reflect.defineProperty(target, propertyKey, {
      get() {
        return keyPath(EnvironmentValues, property);
      },
    });
  };
}
// @FetchRequest(
//     sortDescriptors: [NSSortDescriptor(keyPath: \Item.dueDate, ascending: false)],
//     animation: .default)
interface Sort {
  keyPath?: string;
  ascending?: boolean;
}

export function FetchRequest(req: { sortDescriptors: Sort[]; animation?: AnimationKey }) {
  return function (target: Object, propertyKey: PropertyKey) {
    console.log("Environment(): called");
  };
}

export function AppStorage(key: string) {
  return function AppStorage$(target: Object, property: string) {
    Reflect.defineProperty(target, property, {
      set(value) {
        localStorage.set(property, JSON.stringify(value));
      },
      get() {
        const item = localStorage.getItem(property);
        if (item) {
          return JSON.parse(item);
        }
      },
    });
  };
}

export const StateObject = (target: View, property: PropertyKey) => {
  let value: ObservableObject | undefined = Reflect.getOwnPropertyDescriptor(target, property)?.value;
  if (value) {
    (target as any).watch.set(property, value.objectWillChange);
    return;
  }
  Reflect.defineProperty(target, property, {
    set(v) {
      value = v;
      this.watch.set(property, value?.objectWillChange);
    },
    get() {
      return value;
    },
  });
};
export const EnvironmentObject = (target: View, property: PropertyKey) => {
  let value = Reflect.getOwnPropertyDescriptor(target, property)?.value;
  if (value) {
    (target as any).watch.set(property, value.objectWillChange);
  }
  Object.defineProperty(target, property, {
    get() {
      if (value != null) {
        return value;
      }
      let v: any = this;
      while (!("_environmentObject" in v) && v._environmentObject != null) {
        v = this.parent;
      }
      value = v._environmentObject;
      this.watch.set(property, value?.objectWillChange);

      return v?._environmentObject;
    },
    set(v: ObservableObject) {
      this._environmentObject = v;
    },
  });
};
