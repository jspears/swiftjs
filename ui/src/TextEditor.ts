import { Viewable } from "./View";
import { swifty } from "@jswift/util";

export interface TextEditorConfig {

}

class TextEditorClass extends Viewable<TextEditorConfig> {

}
export const TextEditor = swifty(TextEditorClass);    
    
