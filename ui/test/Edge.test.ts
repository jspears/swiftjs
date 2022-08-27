import { Edge, EdgeSet } from '@tswift/ui';
import { expect } from 'chai';

describe('Edge', function () {
  it('should iterate', function () {
    const all: Edge[] = [];
    for (const e of EdgeSet) {
      all.push(e);
    }
    expect(all).to.eql([Edge.top, Edge.trailing, Edge.bottom, Edge.leading]);
  });

  it('should iterate horizontal', function () {
    const all: Edge[] = [];
    for (const e of EdgeSet.horizontal) {
      all.push(e);
    }
    expect(all).to.eql([Edge.leading, Edge.trailing]);
  });

  it('should iterate vertical', function () {
    const all: Edge[] = [];
    for (const e of EdgeSet.vertical) {
      all.push(e);
    }
    expect(all).to.eql([Edge.top, Edge.bottom]);
  });
});
