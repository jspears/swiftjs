import { View, State, Color, PreviewProvider } from "@tswift/ui";
//Animation Demo
export class AnimationDemo extends View {
    @State
    angle: number = 0;
    @State
    color: Color = Color.blue;
    @State
    isBold: boolean = false;
    body?;
}

export class AnimationDemo_Previews extends PreviewProvider {
    static previews?;
}
