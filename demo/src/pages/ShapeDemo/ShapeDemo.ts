import {
  Circle,
  RadialGradient,
  Gradient,
  Text,
  LinearGradient,
  Viewable,
  Rectangle,
} from "@tswift/ui";

export class ShapeDemo extends Viewable {
  body = () => [
    Text("Text With Gradient")
      .font(".largeTitle")
      .foregroundStyle(
        LinearGradient({
          colors: [".red", ".blue"],
          startPoint: ".leading",
          endPoint: ".trailing",
        })
      ),
    Text("I have a background shape").backgroundStyle(
      Circle().fill(LinearGradient({ colors: [".yellow", ".white"] }))
    ),

    Circle()
      .fill(
        RadialGradient({
          gradient: Gradient({
            colors: [".red", ".yellow", ".green", ".blue", ".purple"],
          }),
          center: ".center",
          startRadius: 50,
          endRadius: 100,
        })
      )
      .frame({ width: 200, height: 200 }),

    Rectangle()
      .fill(LinearGradient({ colors: [".gray", ".blue"] }))
      .frame({ width: 200, height: 200 }),
  ];
}
