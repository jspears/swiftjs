import { Viewable, Text } from "@tswift/ui";

export class IndexPage extends Viewable {
  body = Text("Welcome to TSwift").font(".title").padding(".bottom", 20);
}
