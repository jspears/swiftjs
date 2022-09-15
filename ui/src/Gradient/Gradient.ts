import { fromKey, has, isInstanceOf, ID, swifty } from "@tswift/util";
import { h, VNode } from "preact";
import { Color, ColorKey } from "../Color";
import { Angle } from "../unit";
import { UnitPoint, UnitPointKey, UnitPointType } from "../View/TransformMixin";
import { HasFill } from "../View/types";

class StopClass {
  public color: Color;
  constructor(color: ColorKey, public readonly location: number) {
    this.color = fromKey(Color, color);
  }

  get offset() {
    return this.location * 100 + "%";
  }

  render() {
    return h("stop", { offset: this.offset, ["stop-color"]: this.color + "" }, []);
  }
}

const percent = (v: number, total: number) => {
  if (total == 0 || v == 0) {
    return 0;
  }

  return v / total;
};

export interface LinearGradientConfig {
  colors?: ColorKey[];
  stops?: StopClass[];
  startPoint?: UnitPointKey;
  endPoint?: UnitPointKey;
}

class GradientClass {
  static Stop = swifty(StopClass);
  public stops?: StopClass[];
  constructor({ colors, stops }: { colors?: ColorKey[]; stops?: StopClass[] }) {
    this.stops =
      stops ?? colors?.map((v, idx) => GradientClass.Stop(fromKey(Color, v), percent(idx, colors.length - 1))) ?? [];
  }
}
export const Gradient = swifty(GradientClass);

abstract class BaseGradientClass implements HasFill {
  static _count = 0;
  _id?: string;

  get id(): string {
    if (!this._id) {
      this._id = this.nextId();
    }
    return this._id;
  }

  nextId() {
    return `${this.constructor.name}-${BaseGradientClass._count++}`;
  }

  toSVG() {
    return h(
      "svg",
      { viewBox: "0 0 100 100" },
      h("defs", {}, this.toSVGGradient()),
      h("rect", { height: "100%", width: "100%", fill: `url(#${this.id})` }, []),
    );
  }
  abstract toFill(): string;

  abstract toSVGGradient(): VNode<any>;
}

function point(v: string | number): string {
  if (typeof v === "string") {
    switch (v.replace(/^\.?/, ".")) {
      case ".zero":
        "0";
      case ".center":
        return "50%";
      case ".leading":
      case ".left":
      case ".top":
        return "0%";
      case ".trailing":
      case ".bottom":
      case ".right":
        return "100%";
    }
  }
  return `${v}%`;
}

export const LinearGradient = swifty(
  class LinearGradientClass extends BaseGradientClass {
    readonly startPoint?: UnitPointType;
    readonly endPoint?: UnitPointType;
    readonly gradient: GradientClass;
    constructor(config: LinearGradientConfig) {
      super();
      this.gradient = Gradient(config);
      this.startPoint = config.startPoint && fromKey(UnitPoint, config.startPoint);
      this.endPoint = config.endPoint && fromKey(UnitPoint, config.endPoint);
    }
    toFill(): string {
      let to = "";
      if (this.startPoint && this.endPoint) {
        to = this.startPoint.toDeg(this.endPoint) + ",";
      }
      return `linear-gradient(${to}${this.gradient.stops?.map((v) => v.color + " " + v.offset).join(",")})`;
    }
    toSVGGradient() {
      const opts = { id: this.id };
      if (this.endPoint && this.startPoint) {
        Object.assign(opts, {
          x1: point(this.startPoint.x),
          x2: point(this.endPoint.x),
          y1: point(this.startPoint.y),
          y2: point(this.endPoint.y),
        });
      }
      return h(
        "linearGradient",
        opts,
        this.gradient.stops?.map((v) => v.render()),
      );
    }
  },
);

interface RadialGradientConfig {
  gradient: GradientClass;
  center: UnitPointKey;
  startRadius: number;
  endRadius: number;
}

export const RadialGradient = swifty(
  class RadialGradientClass extends BaseGradientClass {
    readonly gradient: GradientClass;
    readonly startRadius?: number;
    readonly endRadius?: number;
    readonly center?: UnitPointType;
    constructor(config: RadialGradientConfig) {
      super();
      this.gradient = config.gradient;
      this.center = config.center && fromKey(UnitPoint, config.center);
      this.startRadius = config.startRadius;
      this.endRadius = config.endRadius;
    }
    toFill(): string {
      const css = `radial-gradient(${this.gradient.stops?.map((v) => v.color + " " + v.offset).join(",")})`;
      return css;
    }
    toSVGGradient() {
      return h(
        "radialGradient",
        {
          id: this.id,
          //            fr: this.startRadius + '%',
          r: this.startRadius + "%",
          cx: point(this.center.x),
          cy: point(this.center.y),
        },
        this.gradient.stops?.map((v) => v.render()),
      );
    }
  },
);

export function isGradient(v: unknown): v is BaseGradientClass {
  return isInstanceOf(v, BaseGradientClass);
}

type AngularGradientConfig = { center?: UnitPointKey } & (
  | { angle?: Angle; gradient: GradientClass }
  | { angle?: Angle; colors: ColorKey[] }
  | { angle?: Angle; stops: StopClass[] }
  | { startAngle: Angle; endAngle?: Angle; gradient: GradientClass }
  | { startAngle: Angle; endAngle?: Angle; colors: ColorKey[] }
  | { startAngle: Angle; endAngle?: Angle; stops: StopClass[] }
);

export const AngularGradient = swifty(
  class AngularGradient extends BaseGradientClass {
    readonly gradient?: GradientClass;
    readonly center: UnitPointType;
    readonly startAngle?: Angle = 0;
    readonly endAngle?: Angle;

    constructor(config: AngularGradientConfig) {
      super();
      if (config.center) {
        this.center = fromKey(UnitPoint, config.center);
      }
      if ("gradient" in config) {
        this.gradient = config.gradient;
      }
      if ("colors" in config) {
        this.gradient = Gradient(config);
      }
      if ("stops" in config) {
        this.gradient = Gradient(config);
      }
      if ("angle" in config) {
        this.startAngle = config.angle;
        this.endAngle = config.angle;
      }
      if ("startAngle" in config) {
        this.startAngle = config.startAngle;
      }
      if ("endAngle" in config) {
        this.endAngle = config.endAngle;
      }
      if (!this.endAngle) {
        this.endAngle = this.startAngle;
      }
    }
    toFill(): string {
      const stops = this.gradient?.stops;
      if (!stops) {
        return "";
      }
      //conic-gradient( from 0 at center center,red 0deg,orange 74deg,yellow 144deg,green 216deg,#007AFF 288deg,rgb(175,82,222) 360deg)
      let to = "";
      if (this.center) {
        to += `from ${this.startAngle} at ${this.center.x} ${this.center.y},`;
      }
      const css = `conic-gradient(${to} ${stops.map((v) => v.color + " " + v.location * 360 + "deg").join(",")})`;
      return css;
    }
    toSVGGradient() {
      return h("text", { id: this.id }, "Not implemented in SVG");
    }
  },
);
