import { Viewable, Text, Button, VStack, State, Bound } from "@tswift/ui";

export class StateExample extends Viewable {
  @State intValue = 0;

  body = ($:Bound<this>)=>VStack(
      Text(`intValue equals ${$.intValue}`),
      Button("Increment", () => {
        $.intValue += 1;
      })
    );
}
