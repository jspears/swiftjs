//
//  Settings.swift
//  TodoAppSwiftUI3
//
//  Created by Roman Luzgin on 12.07.21.
//

import { AppStorage, Button, Bound, Color, Environment, Form, FocusState, NavigationView, TextField, Viewable, swifty } from "@jswift/ui"

export class SettingsClass extends Viewable {

    @FocusState userNameIsFocused: boolean = false;
    @Environment('.dismiss') dismiss?: () => void;
    @AppStorage("userName") username = ""

    body = ({ $username, dismiss, $userNameIsFocused }: Bound<this>) =>

        NavigationView(
            Form(
                TextField({ label: "Username", text: $username })
                    .focused($userNameIsFocused)
                    .submitLabel('.done')
            )
                .navigationBarItems({ trailing: Button({ label: "Done", action: dismiss }).accentColor('.indigo') })
                .onSubmit(() => {
                    this.userNameIsFocused = false
                    dismiss?.() // we can use dismiss on submit if needed, especially if there is only one settings field
                })
        )

}
export const Settings = swifty(SettingsClass);
// struct Settings_Previews: PreviewProvider {
//     static var previews: some View {
//         Settings()
//     }
// }
