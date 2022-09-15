import {main, State, Text, Font, degrees, Viewable, Bound, Color, Double} from "@tswift/ui";

@main
export class AnimationDemo extends Viewable {

    @State angle:Double = 0;
    @State color:Color = Color.blue;
    @State isBold: Boolean = false;
    
    body = ({ color, isBold, angle, $angle }: Bound<this>) =>{
        return Text("Hello, World")
        .padding()
        .foregroundColor(color)
        .font(Font.title.weight(isBold ? '.bold' : '.regular'))
        .rotationEffect(degrees(angle))
        .onTapGesture(() => {
            this.angle += 90;
            this.color = color == Color.blue ? Color.red : Color.blue;
            this.isBold = !this.isBold;
        })
        .animation('.easeInOut', $angle);
    }
        
}
