//
//  ImageDemo.swift
//  playground
//
//  Created by Justin Spears on 9/13/22.
//

import SwiftUI

struct ImageDemo: View {
    var body: some View {
        VStack {
            Image(systemName: "rectangle.and.pencil.and.ellipsis")
            .imageScale(.small)
                .font(.system(size: 60))
            Image(systemName: "rectangle.and.pencil.and.ellipsis")
            .imageScale(.medium)
                .font(.system(size: 60))
            Image(systemName: "rectangle.and.pencil.and.ellipsis")
            .imageScale(.large)
                .font(.system(size: 60))
            }
    }
}

struct ImageDemo_Previews: PreviewProvider {
    static var previews: some View {
        ImageDemo()
    }
}
