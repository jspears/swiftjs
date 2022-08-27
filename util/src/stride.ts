export function* stride(start: number, end?: number, step?: number) {
  if (step == null) {
    if (end == null) {
      end = start;
      start = 0;
    }
    step = 1;
  } else {
    if (end == null) {
      end = start;
      start = 0;
    }
  }
  if (start > end) {
    for (; end <= start; start -= step) {
      yield start;
    }
  } else {
    for (; start < end; start += step) {
      yield start;
    }
  }
  return start;
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
