import { Viewable } from "./View";
import { Dot, fromKey, KeyOf, swifty } from "@tswift/util";
import images from "../images.json";
import { h } from "preact";
import { Color } from "./Color";
import { CSSProperties, HasToDataURI, SystemImageType } from "./types";
import { svg, toCSS, toUri } from "./svg";
import { unitFor } from "./unit";

class ImageScale {
  size: string;
  static small = new ImageScale(30);
  static medium = new ImageScale(50);
  static large = new ImageScale(100);
  constructor(size: number) {
    this.size = unitFor(size);
  }
}
export interface ImageConfig {
  systemName: SystemImageType;
  variableValue?: number;
}
class ImageClass extends Viewable<ImageConfig> implements HasToDataURI {
  _imageScale?: ImageScale;
  constructor(
    systemName: SystemImageType | ImageConfig,
    variableValue?: number
  ) {
    super(
      typeof systemName == "string" ? { systemName, variableValue } : systemName
    );
  }
  imageScale(scale: KeyOf<typeof ImageScale>) {
    this._imageScale = fromKey(ImageScale, scale);
    return this;
  }
  resizable() {
    return this;
  }
  toDataURI() {
    return toUri(this.asSVG());
  }
  asSVG() {
    const s = this._shadow;
    const textShadow = s ? `${s.x} ${s.y} ${s.radius} ${s.color + ""}` : "";
    const style = {
      fontFamily: "SF Pro",
      textShadow,
      opacity: this.config.variableValue || "1",
    };
    return h(FontSVG, {
      fill: (this._foregroundColor || Color.black).toString(),
      code: images[this.config.systemName],
      style,
    });
  }
  render() {
    if (this.config.systemName) {
      const width = this._imageScale?.size || "-webkit-fill-available";
      return h("div", {
        style: this.asStyle({
          backgroundRepeat: "no-repeat",
          aspectRatio: "1",
          width: width,
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundColor: "transparent",
          backgroundImage: toCSS(this.toDataURI()),
        }),
      });
    }
    return h("img", {}, []);
  }
}
/**
 * 
 * @param param0 <svg width="200" height="100">
  <rect x="0" y="0" width="200" height="100" stroke="red" stroke-width="3px" fill="white"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">TEXT</text>    
</svg>
 * @returns 
 */

const FontSVG = ({
  code,
  filter,
  style,
  fill,
}: {
  code: string;
  filter?: string;
  fill: string;
  style: CSSProperties;
}) => {
  return svg(
    {},
    h("rect", { x: 0, y: 0, width: 100, fill: "transparent", height: 100 }),
    h(
      "text",
      {
        // x: 15,
        // y: 75,
        // textLength:'1',
        x: "50%",
        y: "50%",
        ["dominant-baseline"]: "middle",
        ["text-anchor"]: "middle",

        filter,
        style: {
          fill,
          ["font-size"]: "50",
          ["font-family"]: "SF Pro",
          ...style,
        },
      },
      [code]
    )
  );
};
export const Image = swifty(ImageClass);
