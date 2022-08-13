import { Viewable } from "./View";
import { swifty } from "./utilit";

export interface ImageConfig {
    systemName?:string;
    
}
class ImageClass extends Viewable<ImageConfig> {


}
export const Image = swifty(ImageClass);    
    
