import { AnimationKey } from "./Animation";
import { View, ViewableClass } from "./View/index";
import { EnvironmentValues, EnvironmentValuesKeys } from "./EnvironmentValues";
import { Dot, fromKey, keyPath, UUID } from "@tswift/util";

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
  const desc = Reflect.getOwnPropertyDescriptor(target, propertyKey);
  Reflect.defineProperty(target, propertyKey, {
    get() {
      return this.$(propertyKey)();
    },
    set(v) {
      this.$(propertyKey)(v);
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

export function FetchRequest(req: {
  sortDescriptors: Sort[];
  animation?: AnimationKey;
}) {
  return function (target: Object, propertyKey: PropertyKey) {
    console.log("Environment(): called");
  };
}

export function Binding(target: View, property: PropertyKey) {}

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
