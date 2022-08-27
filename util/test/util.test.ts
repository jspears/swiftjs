import { keyPath, watchable } from '@tswift/util';
import { expect } from 'chai';

describe('util', function () {
  it('keyPath', function () {
    expect(keyPath({ a: { stuff: 1 } }, 'a.stuff')).to.eql(1);
    expect(keyPath({ a: { stuff: 1 } }, '.a.stuff')).to.eql(1);
    expect(keyPath({ a: 1 }, 'a')).to.eql(1);
    expect(keyPath({ a: 1 }, '.a')).to.eql(1);
    expect(keyPath({ a: { stuff: 1 } }, '.a.stuff')).to.eql(1);
    expect(keyPath({ a: { stuff: 1 } }, '.b.stuff')).to.be.undefined;
  });
  it('watchable', function () {
    const watch = watchable(1);

    expect(watch()).to.eql(1);
    const [listen, verify] = mockFn([2], [3]);
    watch.on(listen);
    watch(2);
    watch(3);
    verify();
    watch.clear();
    verify();
    const [listen2, verifyUnsub] = mockFn([2]);
    //unsubscribe after adding.
    const unsub = watch.on(listen2);
    watch(2);
    unsub();
    watch(3);
    verifyUnsub();
    verify();
  });
});

/**
 * Makes a little mock function so you can test the output async.
 *
 * @param expected expected arguments for the number invocations
 * @returns
 */
const mockFn = <P extends any[]>(
  ...expected: P[]
): [(...args: P) => any, () => void] => {
  const args: P[] = [];
  return [
    (...a: P) => {
      args.push(a);
      return null as any;
    },
    () => expect(args).to.eql(expected),
  ];
};
