import { ObservableObject } from "@tswift/util";

export class EnvironmentMixin {
  _environmentObject?: ObservableObject;

  environmentObject(v: ObservableObject) {
    this._environmentObject = v;
  }
}