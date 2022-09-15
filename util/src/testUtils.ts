import { expect } from "chai";
/**
 * Makes a little mock function so you can test the output async.
 *
 * @param expected expected arguments for the number invocations
 * @returns
 */
export const mockFn = <P extends any[]>(...expected: P[]): [(...args: P) => any, () => void] => {
  const args: P[] = [];
  return [
    (...a: P) => {
      args.push(a);
      return null as any;
    },
    () => expect(args).to.eql(expected),
  ];
};
