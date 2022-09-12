import { Bound, Button, ObservableObject, print, Published, StateObject, Text, Viewable, VStack } from "@tswift/ui";

export class StateExample extends Viewable {
  @StateObject state: ContentViewState = new ContentViewState();

  body = ({ state, $state }: Bound<this>) =>VStack(
    Text(state.count + ''),
    Button("Count Up", state.countUp),
    Button("Reset", state.reset)
  )
    .onReceive($state,  ()=>
      print(state.count))

}

class ContentViewState extends ObservableObject {
  @Published count: number = 0

  countUp = ()=> {
    this.count += 1
  }

  reset = ()=> {
    this.count = 0
  }
}
