import {
    main, Published, Button, VStack, Text, ObservedObject, ObservableObject,
    Viewable, swifty, StateObject, Bound
} from "@tswift/ui";

class UserProgress extends ObservableObject {
    @Published score = 0
}
class InnerView extends Viewable {

    @ObservedObject progress: UserProgress;

    constructor(progress: UserProgress) {
        super();
        this.progress = progress;
    }

    body = Button("Increase Score", () => {
        this.progress.score += 1
    });

}



@main
export class ObserverableObjectDemo extends Viewable {
    @StateObject progress = new UserProgress();

    body = ({ progress }: Bound<this>) => VStack(
        Text(`Your score is ${progress.score}`),
        new InnerView(progress)
    );

}
