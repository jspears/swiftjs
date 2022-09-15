import SwiftUI

struct AnimationDemo: View {
    
    @State private var angle: Double = 0;
    @State private var color: Color = .blue;
    @State private var isBold: Bool = false;
    
    var body: some View {
        Text("Hello, World!")
            .padding()
            .foregroundColor(color)
            .font(.title.weight(isBold ? .bold : .regular))
            .rotationEffect(.degrees(angle))
            .onTapGesture {
                angle += 90
                color = (color == .blue ? .red : .blue);
                isBold.toggle()
                
            }.animation(.easeInOut, value:angle )
    }
}

struct AnimationDemo_Previews: PreviewProvider {
    
    static var previews: some View {
        AnimationDemo()
    }
}
