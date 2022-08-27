import { Num } from '@tswift/util';

export function isNum(v: unknown): v is Num {
  if (v === '.infinity') {
    return true;
  }
  if (typeof v === 'number') {
    return true;
  }
  return Number(v) + '' === v;
}

export const unitFor = (t?: Num): string => {
  if (!t) {
    return '';
  }
  if (t === '.infinity') {
    return '100%';
  }

  return `${t}px`;
};
