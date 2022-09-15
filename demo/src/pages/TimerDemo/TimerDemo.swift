import SwiftUI

struct TimerDemo : View {
    @State var value = 0.0
    let timer = Timer.publish(every: 0.5, on: .main, in: .common).autoconnect()
    
    var body: some View {
        VStack {
            Image(systemName: "rectangle.and.pencil.and.ellipsis", variableValue: value)
                .imageScale(.large)
                .font(.system(size: 60))
            Image(systemName: "wifi", variableValue: value)
                .imageScale(.large)
                .font(.system(size: 60))
            Image(systemName: "phone.down.waves.left.and.right", variableValue: value)
                .imageScale(.large)
                .font(.system(size: 60))
            Image(systemName: "shower.fill", variableValue: value)
                .imageScale(.large)
                .font(.system(size: 60))
        }
        .onReceive(timer) { _ in
            if value < 1.0 {
                value += 0.25
            } else {
                value = 0.0
            }
        }
    }
}
