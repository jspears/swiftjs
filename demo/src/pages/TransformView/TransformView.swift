//

import SwiftUI

struct TransformView: View {
    @State private var angle = 0.0;
    var body: some View {
        Text("Rotate Me!")
            .rotationEffect(.degrees(angle))
        Slider(value:$angle, in:0...360)
    }
}

struct TransformView_Previews: PreviewProvider {
    static var previews: some View {
        TransformView()
    }
}
