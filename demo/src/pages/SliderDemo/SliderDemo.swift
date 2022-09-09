import SwiftUI

struct SliderDemo : View {
@State private var speed = 50.0
@State private var isEditing = false

var body: some View {
    Slider(
        value: $speed,
        in: 0...100,
        step: 5
    ) {
        Text("Speed")
    } minimumValueLabel: {
        Text("0")
    } maximumValueLabel: {
        Text("100")
    } onEditingChanged: { editing in
        isEditing = editing
    }
    Text("\(speed)")
        .foregroundColor(isEditing ? .red : .blue)

}
}

