//
//  ExplicitTransitionView.swift
//  playground
//
//  Created by Justin Spears on 9/15/22.
//
// [from](https://swiftontap.com/withanimation(_:_:))

import SwiftUI
struct ExplicitTransition: View {
    @State var showBanana = false
    
    var body: some View {
        Button("Toggle") {
            withAnimation(.easeInOut) { showBanana.toggle() }
        }.padding()
        if showBanana {
            Text("🍌")
                .padding()
                .transition(.slide)
        }
    }
    
}
