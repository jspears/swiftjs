// import {MainScreen} from './MainScreen';

// console.log('hello', MainScreen);
import {
  Viewable,
  Text,
  Bool,
  TextField,
  State,
  FocusState,
  Bound,
} from "@jswift/ui";

function validate(t: unknown) {
  return () => console.log("figure this out", t);
}

//https://developer.apple.com/documentation/swiftui/textfield
export class TextFieldDemo extends Viewable<{}> {
  @State username: string = "";
  @FocusState emailFieldIsFocused: Bool = false;

  body = (
    { $username, $emailFieldIsFocused }: Bound<this>,
    { emailFieldIsFocused, username }: this
  ) => [
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
