import { main, Viewable, Text, TextField, State, FocusState, Bound, False } from "@tswift/ui";

function validate(t: unknown) {
  return () => console.log("figure this out", t);
}

//import '@tswift/UI'

//https://developer.apple.com/documentation/swiftui/textfield
@main
export class TextUpdate extends Viewable<{}> {
  @State username: string = "";
  @FocusState emailFieldIsFocused = false;

  body = ({ $username, $emailFieldIsFocused, emailFieldIsFocused, username }: Bound<this>) => [
    TextField({
      label: "User name (email address)",
      text: $username,
    })
      .focused($emailFieldIsFocused)
      .onSubmit(validate({ name: username }))
      .textInputAutocapitalization(".never")
      .disableAutocorrection(true)
      .border(".secondary"),
    Text(username).foregroundColor(emailFieldIsFocused ? ".red" : ".blue"),
  ];
}
