import { Published, ObservableObject, swifty, print } from "@tswift/util";
import { expect } from "chai";

class ContactClass extends ObservableObject {
  @Published name: string;
  @Published age: number;

  noChange: string = "nochange";

  constructor(name: string, age: number) {
    super();
    this.name = name;
    this.age = age;
  }

  haveBirthday() {
    this.age += 1;
    return this.age;
  }
  toString() {
    return `Contact[name:${this.name},age:${this.age},noChange:${this.noChange}]`;
  }
}
const Contact = swifty(ContactClass);

describe("ObservableObject", function () {
  it("should fire when changed", () => {
    const c = Contact("Bob", 2);
    const result: string[] = [];
    c.objectWillChange.sink((v: ContactClass) => {
      result.push(v.toString());
    });
    c.name = "Joe";
    expect(result).to.eql([`Contact[name:Bob,age:2,noChange:nochange]`]);
    result.length = 0;
    c.haveBirthday();
    expect(result).to.eql([`Contact[name:Joe,age:2,noChange:nochange]`]);
  });
  it("should send", function () {
    let john = Contact("John Appleseed", 24);
    const cancellable = john.objectWillChange.sink(() => print(`${john.age} will change`));
    print(john.haveBirthday());
  });
});
