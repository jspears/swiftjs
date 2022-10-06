import { Range } from "./types";

export type StrideStr = `${number}...${number}` | `${number}..<${number}`;

export class Stride implements Range{
  constructor(public from: number, public to: number, public step: number, public inclusive: boolean = false) {
    if (step == null) {
      if (to == null) {
        this.to = from;
        this.from = 0;
      }
      this.step = 1;
    } else {
      if (to == null) {
        this.to = from;
        this.from = 0;
      }
    }
  }

  *range() {
    let from = this.from,
      to = this.to,
      step = this.step;
    if (this.inclusive) {
      to += from < to ? step : -1 * step;
    }
    if (from > to) {
      for (; to <= from; from -= step) {
        yield from;
      }
    } else {
      for (; from < to; from += step) {
        yield from;
      }
    }
    return;
  }
}
interface StrideRange {
  from: number;
  to: number;
  inclusive: boolean;
}
export function toStride(fromOrStr: StrideStr | StrideRange): Stride {
  if (typeof fromOrStr === 'string') {
    const [_, start, op, end] = /(\d*)(?:\.{2,3})(<?)(\d*)/.exec(fromOrStr) || [];
    return new Stride(Number(start), Number(end), 1, op ? true : false);
  }
  return new Stride(fromOrStr.from, fromOrStr.to, 1, fromOrStr.inclusive)
}

export function *range<T>(fromOrStr: StrideStr | StrideRange, iter?: Iterable<T>) {
  const stride = toStride(fromOrStr);
  if (iter == null) {
    return stride.range();
  }
  if (Array.isArray(iter)) {
    for (const i of stride.range()) {
      if (i < iter.length) {
        yield iter[i];
      } else {
        return;
       }
    }
    return;
  } else {
    const it = iter[Symbol.iterator]();
    for (const i of stride.range()) {
      if (it.return) {
        return;
      }
      yield it.next();
    }
  }
}

export function* stride(fromOrStr: number | string, to?: number, step?: number) {
  let from: number;
  if (typeof fromOrStr === "string") {
    const [_, start, op, end] = /(\d*)(?:\.\.)(<?)(\d*)/.exec(fromOrStr) || [];
    from = Number(start);
    to = Number(end);
    if (!op) {
      to += 1;
    }
  } else {
    from = fromOrStr;
  }

  if (step == null) {
    if (to == null) {
      to = from;
      from = 0;
    }
    step = 1;
  } else {
    if (to == null) {
      to = from;
      from = 0;
    }
  }
  if (from > to) {
    for (; to <= from; from -= step) {
      yield from;
    }
  } else {
    for (; from < to; from += step) {
      yield from;
    }
  }
  return from;
}

interface Repeated<T> {
  count: number;
  repeatedValue: T;
}

export function* repeatElement<T>(element: T, count: number) {
  for (let i = 0; i < count; i++) {
    yield element;
  }
  return { count, repeatedValue: element };
}
