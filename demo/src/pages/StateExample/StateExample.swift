
import Foundation
import SwiftUI

struct StateContentView: View {
    @StateObject private var state: ContentViewState = .init()
    var body: some View {
        VStack {
            Text(state.count.description)
            Button("Count Up") { state.countUp() }
            Button("Reset") { state.reset() }
        }
        .onReceive(state.$count) { count in
            print(count)
        }
    }
}

final class ContentViewState: ObservableObject {
    @Published private(set) var count: Int = 0
    
    func countUp() {
        count += 1
    }
    
    func reset() {
        count = 0
    }
}
