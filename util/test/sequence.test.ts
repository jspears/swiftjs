import { expect } from "chai";
import { KeyPath, sequence } from "@tswift/util";

type Tree = {
  value: string;
  next?: Tree;
};
const p: Tree = {
  value: "a",
  next: {
    value: "b",
    next: {
      value: "c",
    },
  },
};

type DeepTree = {
  value: string;
  next?: {
    cont: DeepTree;
  };
};
const d: DeepTree = {
  value: "a",
  next: {
    cont: {
      value: "b",
      next: {
        cont: {
          value: "c",
        },
      },
    },
  },
};

describe("sequence", function () {
  it("should return parents", () => {
    const loop: string[] = [];

    for (const l of sequence(p, (v) => v?.next)) {
      loop.push(l.value);
    }
    expect(loop).to.eql(["a", "b", "c"]);
  });
  it("should walk by property name", () => {
    const loop: string[] = [];

    for (const l of sequence(p, ".next")) {
      loop.push(l.value);
    }
    expect(loop).to.eql(["a", "b", "c"]);
  });
  it("should walk by property name deep", () => {
    const loop: string[] = [];

    for (const l of sequence(d, ".next.cont")) {
      loop.push(l.value);
    }
    expect(loop).to.eql(["a", "b", "c"]);
  });
});
