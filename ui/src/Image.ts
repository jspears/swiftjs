import { Viewable } from './View';
import { swifty } from '@jswift/util';

export interface ImageConfig {
  systemName?: string;
}
class ImageClass extends Viewable<ImageConfig> {
  resizable() {
    return this;
  }
}
export const Image = swifty(ImageClass);
