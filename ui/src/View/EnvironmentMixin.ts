import { Dot, KeyPath, KeyValue, ObservableObject } from "@tswift/util";
import { EnvironmentValuesKeys, EnvironmentValues, EnvironmentValuesClass } from "../EnvironmentValues";
import { Inherit } from "../Inherit";

export class EnvironmentMixin {
  @Inherit
  _environmentObject?: EnvironmentValuesClass;

  environmentObject(v: EnvironmentValuesClass) {
    this._environmentObject = v;
  }
  environment<K extends Dot<keyof  EnvironmentValuesClass>>(key: K, t: K extends `.${infer Key extends keyof EnvironmentValuesClass & string}` ? EnvironmentValuesClass[Key]: never) {
    this._environmentObject = new EnvironmentValuesClass({
      [key]: t
    }); 
    return this;
  }
}
