import { Bindable, State, degrees, Viewable, Slider, Text, View, Bound, Num, main } from "@tswift/ui";

@main
export class TransformView extends Viewable {
  @State angle: Num = 0;

  body = ({ $angle, angle }: Bound<this>): View[] => {
    return [Text("Rotate Me").rotationEffect(degrees(angle), ".center"), Slider({ value: $angle, in: "0...360" })];
  };
}
