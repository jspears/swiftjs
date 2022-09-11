import {
  Circle,
  RadialGradient,
  Gradient,
  Text,
  LinearGradient,
  Viewable,
  Rectangle,
  AngularGradient,
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
    Text("Angular gradients are real")
      .backgroundStyle(
        AngularGradient({
          gradient: Gradient({
            colors: [
              ".red",
              ".orange",
              ".yellow",
              ".green",
              ".blue",
              ".purple",
            ],
          }),
          center: ".center",
        })
      )
      .frame({ width: 200, height: 200 }),
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
      ).stroke('.red', 10)
      .frame({ width: 200, height: 200 }),

    Rectangle()
      .fill(LinearGradient({ colors: [".gray", ".blue"] }))
      .frame({ width: 200, height: 200 }),
  ];
}
