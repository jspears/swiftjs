
import {
  Viewable,
  Text,
  TextField,
  State,
  FocusState,
  Bound,
  False,
} from '@tswift/ui';

function validate(t: unknown) {
  return () => console.log('figure this out', t);
}

//import '@tswift/UI'

//https://developer.apple.com/documentation/swiftui/textfield
export class TextUpdate extends Viewable<{}> {
  @State username: string = '';
  @FocusState emailFieldIsFocused = False();

  body = (
    { $username, $emailFieldIsFocused }: Bound<this>,
    { emailFieldIsFocused, username }: this
  ) => [
    TextField({
      label: 'User name (email address)',
      text: $username,
    })
      .focused($emailFieldIsFocused)
      .onSubmit(validate({ name: username }))
      .textInputAutocapitalization('.never')
      .disableAutocorrection(true)
      .border('.secondary'),
    Text(username).foregroundColor(emailFieldIsFocused ? '.red' : '.blue'),
  ];
}
