import { Int } from '@jswift/util';
import { swifty } from '@jswift/util';

interface RangeType {
  lowerBound?: Int;
  upperBound?: Int;
  location: Int;
  length: Int;
  contains(v: Int): boolean;
  formUnion(v: RangeType): RangeType | undefined;
  intersection(v: RangeType): RangeType | undefined;
  union(range: RangeType): RangeType | undefined;
}

class RangeClass implements RangeType {
  public lowerBound?: Int;
  public upperBound?: Int;

  constructor(public location: Int, public length: Int) {}
  contains(val: Int): boolean {
    return true;
  }
  formUnion(v: RangeType): RangeType | undefined {
    return;
  }
  intersection(t: RangeType): RangeType | undefined {
    return;
  }
  union(range: RangeType): RangeType | undefined {
    return;
  }
}

export const Range = swifty(RangeClass);
