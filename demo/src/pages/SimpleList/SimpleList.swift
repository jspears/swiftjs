

import Foundation
import SwiftUI
struct Ocean: Identifiable {
    let name: String
    let id = UUID()
}

struct SimpleListView : View {

    private var oceans = [
        Ocean(name: "Pacific"),
        Ocean(name: "Atlantic"),
        Ocean(name: "Indian"),
        Ocean(name: "Southern"),
        Ocean(name: "Arctic")
    ]

    var body: some View {
        List(oceans) {
            Text($0.name)
        }
    }
}
