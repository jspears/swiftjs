import { Num } from "@tswift/util";

export function isNum(v: unknown): v is Num {
  if (v === ".infinity") {
    return true;
  }

  if (typeof v === "number") {
    return true;
  }

  if (Number.isNaN(v)) {
    return false;
  }

  return Number(v) + "" === v;
}

export const unitFor = (t?: Num): string => {
  if (t == null) {
    return "";
  }
  if (t == 0){
    return '0';
  }
  if (t === ".infinity") {
    return "100%";
  }
  //So want to use units like an apple,
  // also want to be nice to peoples settings.
  // so this does the math.   Assumes that 1rem = 10px more or less.
  // so make sure html { font-size: 62.5% }
  return `${t / 10}rem`;
};

type AngleType = "deg" | "rad" | "grad" | "turn" ;

export type Angle = `${number}${AngleType}` | '0' | 0;

const angles =
  (type: AngleType) =>
  (num: Num): Angle =>
    num === ".infinity" ? `0${type}` : `${num}${type}`;

export const radians = angles("rad");
export const degrees = angles("deg");
export const gradians = angles("grad");
export const turns = angles("turn");
