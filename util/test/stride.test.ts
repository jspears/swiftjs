import { expect } from "chai";
import { repeatElement, stride } from "@tswift/util";

describe("stride", function () {
  it("should go from 1 to 10", function () {
    const nums: number[] = [];
    for (const num of stride(10)) {
      nums.push(num);
    }
    expect(nums).to.eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
  it("should go from 5 to 1", function () {
    const nums: number[] = [];
    for (const num of stride(5, 1)) {
      nums.push(num);
    }
    expect(nums).to.eql([5, 4, 3, 2, 1]);
  });
  it("should go from 1 to 10 step 3", function () {
    const nums: number[] = [];
    for (const num of stride(0, 10, 3)) {
      nums.push(num);
    }
    expect(nums).to.eql([0, 3, 6, 9]);
  });
  it("should spread", function () {
    expect([...stride(0, 3)]).to.eql([0, 1, 2]);
  });
  it("shoud parse 0..<3", function () {
    expect([...stride("0..<3")]).to.eql([0, 1, 2]);
  });
  it("shoud parse 0..3", function () {
    expect([...stride("0..3")]).to.eql([0, 1, 2, 3]);
  });
  it("shoud parse 2..3", function () {
    expect([...stride("2..3")]).to.eql([2, 3]);
  });
});
describe("repeatElement", function () {
  it("should repeat", function () {
    expect([...repeatElement("a", 3)]).to.eql(["a", "a", "a"]);
  });
});
