import { Viewable } from "./View";
import { swifty } from "./utilit";

export interface TextEditorConfig {

}

class TextEditorClass extends Viewable<TextEditorConfig> {

}
export const TextEditor = swifty(TextEditorClass);    
    
