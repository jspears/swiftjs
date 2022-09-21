import { Dot, KeyPath, KeyValue, ObservableObject } from "@tswift/util";
import { EnvironmentValuesKeys, EnvironmentValues, EnvironmentValuesClass } from "../EnvironmentValues";
import { Inherit } from "../Inherit";

export class EnvironmentMixin {
  @Inherit
  _environment?: EnvironmentValues;

  environmentObject(v: EnvironmentValues) {
    this._environment = v;
  }
  environment<K extends Dot<keyof  EnvironmentValues>>(key: K, t: K extends `.${infer Key extends keyof EnvironmentValues & string}` ? EnvironmentValues[Key]: never) {
    this._environment = new EnvironmentValuesClass({
      [key]: t
    }); 
    return this;
  }
}
