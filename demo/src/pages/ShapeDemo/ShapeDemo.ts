import {
  Circle,
  RadialGradient,
  Gradient,
  Text,
  main,
  LinearGradient,
  Viewable,
  Rectangle,
  AngularGradient,
  RoundedRectangle,
} from "@tswift/ui";

@main
export class ShapeDemo extends Viewable {
  body = () => [
    Text("Text With Gradient")
      .font(".largeTitle")
      .foregroundStyle(
        LinearGradient({
          colors: [".red", ".blue"],
          startPoint: ".leading",
          endPoint: ".trailing",
        }),
      ),
    Text("I have a background shape").backgroundStyle(
      Circle().fill(LinearGradient({ colors: [".yellow", ".pink", ".green"] })),
    ),
    Text("Angular gradients are real")
      .backgroundStyle(
        AngularGradient({
          gradient: Gradient({
            colors: [".red", ".orange", ".yellow", ".green", ".blue", ".purple"],
          }),
          center: ".center",
        }),
      )
      .frame({ width: 200, height: 200 }),
      RoundedRectangle({cornerRadius:25})
      .fill(LinearGradient({
        colors:['.purple', '.green']
      }))
    .frame({width: 200, height:200})    ,
    Circle()
      .fill(
        RadialGradient({
          gradient: Gradient({
            colors: [".red", ".yellow", ".green", ".blue", ".purple"],
          }),
          center: ".center",
          startRadius: 50,
          endRadius: 100,
        }),
      )
      .stroke(".red", 10)
      .frame({ width: 200, height: 200 }),
    Rectangle()
      .fill(LinearGradient({ colors: [".gray", ".blue"] }))
      .frame({ width: 200, height: 200 }),
  ];
}
