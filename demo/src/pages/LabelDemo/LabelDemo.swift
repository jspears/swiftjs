import SwiftUI

struct LabelDemo: View {
    var body: some View {
        Label {
            Text("Bob Loblaw")
                .font(.body)
                .foregroundColor(.primary)
            Text("Person at Law")
                .font(.subheadline)
                .foregroundColor(.secondary)
        } icon: {
            Circle()
                .fill(.blue)
                .frame(width: 44, height: 44, alignment: .center)
                .overlay(Text("BL"))
        }
    }
}

struct LabelDemo_Previews: PreviewProvider {
    static var previews: some View {
        LabelDemo()
    }
}
