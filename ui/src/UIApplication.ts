export class UIApplication {
  static get shared() {
    if (_shared) {
      _shared = new UIApplication();
    }
    return _shared;
  }
  endEditing = () => {
    return this;
  };
}
let _shared: UIApplication;
