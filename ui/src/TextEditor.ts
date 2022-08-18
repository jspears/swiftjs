import { Viewable } from './View';
import { swifty } from '@tswift/util';

export interface TextEditorConfig {}

class TextEditorClass extends Viewable<TextEditorConfig> {}
export const TextEditor = swifty(TextEditorClass);
