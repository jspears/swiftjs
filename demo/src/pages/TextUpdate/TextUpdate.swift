//
//  File.swift
//  playground
//
//  https://developer.apple.com/documentation/swiftui/textfield

import Foundation
import SwiftUI

struct TextFieldDemo : View {
    @State private var username: String = ""
    @FocusState private var emailFieldIsFocused: Bool

    var body: some View {
        TextField(
            "User name (email address)",
            text: $username
        )
        .focused($emailFieldIsFocused)
        .onSubmit {
           // validate(name: username)
        }
        .textInputAutocapitalization(.never)
        .disableAutocorrection(true)
        .border(.secondary)

        Text(username)
            .foregroundColor(emailFieldIsFocused ? .red : .blue)
    }
}
