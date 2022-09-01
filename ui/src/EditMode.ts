import { BoolType, False } from "@tswift/util";

export class EditMode {
  static active = new EditMode("active");
  static inactive = new EditMode("inactive");
  static transient = new EditMode("transient");
  private editing = False();

  constructor(public name: string) {}
  get wrappedValue() {
    const self = this;
    return {
      get isEditing(): boolean {
        return self.isEditing();
      },
      set isEditing(val: boolean) {
        self.isEditing(val);
      },
    };
  }

  get isEditing(): BoolType {
    return this.editing;
  }
}
