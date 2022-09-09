import SwiftUI

struct ShapeDemo : View {

    var body = some View {
        Text(“Smash Swift”)
    .font(.largeTitle)
    .foregroundStyle(LinearGradient(colors: [.red, .blue],
        startPoint: .leading,
        endPoint: .trailing))
        Circle()
            .fill(
                 RadialGradient(gradient: Gradient(colors: [.red, .yellow, .green, .blue, .purple]), center: .center, startRadius: 50, endRadius: 100)
            )
            .frame(width: 200, height: 200)
    }
}
