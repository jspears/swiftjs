import {main, Text, VStack, Color, Viewable } from "@tswift/ui";

@main
export class Typeography extends Viewable {
  body = VStack(
    { alignment: ".leading", spacing: 10 },
    Text("Large Title").font(".largeTitle"),
    Text("Title").font(".title"),
    Text("Title 2").font(".title2"),
    Text("Title 3").font(".title3"),
    Text("Default"),
    Text("Body").font(".body"),
    Text("Callout").font(".callout"),
    Text("Sub Headline").font(".subheadline"),
    Text("Headline").font(".headline"),
    Text("Caption").font(".caption")
  )
    .padding(".horizontal", 20)
    .padding(".vertical", 10)
    .border(Color.purple, 4)
    .navigationTitle("Fonts Sizes");
}
