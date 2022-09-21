import SwiftUI
//https://www.hackingwithswift.com/quick-start/swiftui/how-to-use-observedobject-to-manage-state-from-external-objects
class UserProgress: ObservableObject {
    @Published var score = 0
}


struct InnerView: View {
    @ObservedObject var progress: UserProgress

    var body: some View {
        Button("Increase Score") {
            progress.score += 1
        }
    }
}

struct ObservableObjectDemo: View {
    @StateObject var progress = UserProgress()

    var body: some View {
        VStack {
            Text("Your score is \(progress.score)")
            InnerView(progress: progress)
        }
    }
}
