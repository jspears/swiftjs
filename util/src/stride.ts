
export function* stride(fromOrStr: number | string, to?: number, step?: number) {
  let from:number;
  if (typeof fromOrStr === 'string'){
    
    const [_, start, op, end ] =  /(\d*)(?:\.\.)(<?)(\d*)/.exec(fromOrStr) || [];
    from = Number(start);
    to = Number(end);
    if (!op){
      to+=1;
    }
  }else{
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
