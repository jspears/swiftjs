//
//  ToggleDemo.swift
//  playground
//
//  Created by Justin Spears on 9/12/22.
//

import SwiftUI

struct ToggleDemo: View {
    @State private var isShuffling = false;
    
    @State private var isRepeating = false;
    
    @State private var isEnhanced = false;
    
    var body: some View {
        HStack {
            Toggle(isOn: $isShuffling) {
                Label("Shuffle", systemImage: "shuffle")
            }
            Toggle(isOn: $isRepeating) {
                Label("Repeat", systemImage: "repeat")
            }

            Divider()

            Toggle("Enhance Sound", isOn: $isEnhanced)
                .toggleStyle(.automatic) // Set the style automatically here.
        }
        .toggleStyle(.button)
    }
}

struct ToggleDemo_Previews: PreviewProvider {
    static var previews: some View {
        ToggleDemo()
    }
}
