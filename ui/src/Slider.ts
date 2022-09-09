import {
  Bindable,
  Num,
  Stride,
  StrideStr,
  swifty,
  toArray,
  toStride,
} from "@tswift/util";
import { h } from "preact";
import { ViewComponent } from "./preact";
import { HStack, VStack } from "./Stack";
import { View, Viewable } from "./View";

type Value = Bindable<Num>;
export interface SliderConfig {
  value: Value;
  in?: StrideStr;
  step?: number;
  onEditingChanged?(b?: boolean): void;
  label?: View;
  minimumValueLabel?: View;
  maximumValueLabel?: View;
}

class BodyClass extends Viewable<SliderConfig> {
  range: Stride;

  constructor(config: SliderConfig) {
    super(
      config,
      ...toArray(
        config.minimumValueLabel,
        config.maximumValueLabel,
        config.label
      )
    );
    this.range = toStride(config.in || "0...100");
    if (config.step) {
      this.range.step = config.step;
    }
  }
  render() {
    return h(SliderComponent, {
      watch: this.watch,
      value: this.config.value,
      min: this.range.from + "",
      max: this.range.to + "",
      step: this.range.step + "",
      onEditingChanged: this.config.onEditingChanged,
      style: this.asStyle({ width: "-webkit-fill-available" }),
    } as any);
  }
}
class SliderComponent extends ViewComponent<{
  value: Value;
  min: string;
  max: string;
  step: string;
  onEditingChanged?(v: boolean): void;
}> {
  onInput = (v: Event) => {
    const target = v.target as HTMLInputElement;
    this.props.value(parseFloat(target.value));
    this.props.onEditingChanged?.(true);
  };
  onChange = () => this.props.onEditingChanged?.(false);

  render() {
    const { watch, exec, value, ...rest } = this.props;
    return h("input", {
      type: "range",
      value: value() + "",
      onInput: this.onInput,
      onChange: this.onChange,
      ...rest,
    }) as any;
  }
}
class SliderClass extends Viewable<SliderConfig> {
  static Body = swifty(BodyClass);

  body = () => {
    const { minimumValueLabel, label, maximumValueLabel, ...rest } =
      this.config;
    const minMax =
      minimumValueLabel || maximumValueLabel
        ? HStack(
            {
              style: {
                flex: "0",
              },
            },
            ...toArray(
              minimumValueLabel,
              SliderClass.Body(rest as SliderConfig),
              maximumValueLabel
            )
          )
        : SliderClass.Body(rest as SliderConfig);

    if (label) {
      return VStack(
        { style: { flex: "0", width: "-webkit-fill-available" } },
        minMax,
        label
      );
    }
    return minMax;
  };
}
export const Slider = swifty(SliderClass);
