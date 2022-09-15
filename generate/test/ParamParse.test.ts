import { ClosureImpl, Params } from "@tswift/generate";
import { expect } from "chai";
describe("ParamParse", function () {
  it("should parse '()=>Void'", () => {
    const invoked: string[] = [];
    const addType = (a: string) => {
      invoked.push(a);
    };
  });

  it("should parse 'func stuff(Abc)=>Void'", () => {
    const invoked: string[] = [];
    const addType = (a: string) => {
      invoked.push(a);
    };

    const close = ClosureImpl.parseMethod("func stuff(Abc)->Void", addType);
    expect(close.toString()).equal("(_:Abc)=>Void");
    expect(invoked).to.eql(["Abc", "Void"]);
  });

  it("should parse 'func stuff(a:[Abc])=>Void'", () => {
    const invoked: string[] = [];
    const addType = (a: string) => {
      invoked.push(a);
    };

    const close = ClosureImpl.parseMethod("func stuff([Abc])->Void", addType);
    expect(close.toString()).equal("(_:Abc[])=>Void");
    expect(invoked).to.eql(["Abc[]", "Void"]);
  });

  it("should parse 'func stuff(a:[Abc]?)=>Void'", () => {
    const invoked: string[] = [];
    const addType = (a: string) => {
      invoked.push(a);
    };

    const close = ClosureImpl.parseMethod("func stuff([Abc]?)->Void", addType);
    expect(close.toString()).equal("(_?:Abc[])=>Void");
    expect(invoked).to.eql(["Abc[]", "Void"]);
  });

  it("should parse 'func multiplyTwoInts(_ a: Int, _ b: Int) -> Int'", function () {
    const invoked: string[] = [];
    const addType = (a: string) => {
      invoked.push(a);
    };

    const resp = ClosureImpl.parseMethod("func multiplyTwoInts(_ a: Int, _ b: Int) -> Int", addType);
    expect(resp.returnType).to.eql("Int");
    expect(resp.params + "").to.eql("a:Int, b:Int");
    expect(invoked).to.eql(["Int", "Int", "Int"]);
    //console.dir(resp.parameters, {depth:10});
  });

  it("should parse 'func formUnion(AccessibilityTraits)'", function () {
    const [addType, verify] = oneArg("AccessibilityTraits", "Void");

    const resp = ClosureImpl.parseMethod("func formUnion(AccessibilityTraits)", addType);
    expect(resp.name).to.eql("formUnion");
    expect(resp.returnType).to.eql("Void");
    expect(resp.params + "").to.eql("_:AccessibilityTraits");
    verify();
  });
  it.skip('should parse "func insert(AccessibilityTraits) -> (inserted: Bool, memberAfterInsert: AccessibilityTraits)"', function () {
    const [addType, verify] = oneArg("Bool", "AccessibilityTraits", "Void");

    const ret = ClosureImpl.parseMethod(
      "func insert(AccessibilityTraits) -> (inserted: Bool, memberAfterInsert: AccessibilityTraits)",
      addType,
    );
    expect(ret.name).to.eql("insert");
    expect(ret.params + "").to.eql("_:AccessibilityTraits");
    verify();
  });
});

type AnyFn = (...args: any) => any;

const oneArg = <T extends AnyFn>(...expected: ReturnType<T>[]): [T, () => void] => {
  const result: ReturnType<T>[0][] = [];
  return [
    ((a) => {
      result.push(a);
      return null as ReturnType<T>;
    }) as T,
    () => expect(result).to.eql(expected),
  ];
};
