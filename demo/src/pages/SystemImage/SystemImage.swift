import SwiftUI
/**
https://blog.devgenius.io/swiftui-tutorial-displaying-system-image-with-sf-symbols-75c01b5bf421
**/

struct SystemImage : View {
    var body: some View {
        Image(systemName: "bolt")
            .font(.system(size: 400))
            .foregroundColor(.blue)
            .shadow(color: .gray, radius: 10, x: 0, y: 10)
    }
}
