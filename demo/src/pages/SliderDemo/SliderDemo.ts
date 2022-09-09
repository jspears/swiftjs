import { Bound, Num, Slider, State, Text, Viewable } from "@tswift/ui";

export class SliderDemo extends Viewable {
  @State speed: Num = 50.0;
  @State isEditing = false;

  body = ({ $speed, isEditing, $isEditing, speed }: Bound<this>) => [
    Slider({
      value: $speed,
      in: "0...100",
      step: 5,
      label: Text("Speed"),
      minimumValueLabel: Text("0"),
      maximumValueLabel: Text("100"),
      onEditingChanged: $isEditing,
    }),
    Text(`${speed}`).foregroundColor(isEditing ? ".red" : ".blue"),
  ];
}
