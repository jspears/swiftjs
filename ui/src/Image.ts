import { Viewable } from "./View";
import { swifty } from "@tswift/util";

export interface ImageConfig {
  systemName?: string;
}
class ImageClass extends Viewable<ImageConfig> {
  resizable() {
    return this;
  }
}
export const Image = swifty(ImageClass);
