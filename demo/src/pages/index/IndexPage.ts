import { Viewable, main, Text } from "@tswift/ui";

@main
export class IndexPage extends Viewable {
  body = Text("Welcome to TSwift").font(".title").padding(".bottom", 20);
}
