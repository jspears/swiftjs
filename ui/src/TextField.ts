import { Viewable } from "./View";
import { isBindable, swifty } from "./utilit";
import { Bindable, Bound, KeyOf } from "./types";

export class TextInputAutocapitalization {
    static characters = new TextInputAutocapitalization
    //Defines an autocapitalizing behavior that will capitalize every letter.
    static sentences = new TextInputAutocapitalization
    //Defines an autocapitalizing behavior that will capitalize the first letter in every sentence.
    static words = new TextInputAutocapitalization
    //Defines an autocapitalizing behavior that will capitalize the first letter of every word.
    static never = new TextInputAutocapitalization
}

export interface TextFieldConfig {
    label: string;
    text: Bindable<string> | string
}
function debind<T>(v:Bindable<T>|T):T{
    if (isBindable<T>(v)){
        return v();
    }
    return v;
}

class TextFieldClass extends Viewable<TextFieldConfig> {
    focused(focus?: boolean | Bindable<boolean>): this {
        return this;
    }
    submitLabel(key: string) {
        return this
    }
    onSubmit(fn: () => unknown) {
        return this;
    }
    disableAutocorrection(disable:boolean){
        return this;
    }
    textInputAutocapitalization(v:KeyOf<typeof TextInputAutocapitalization>) {
        return this;

    }
    render(): HTMLElement | DocumentFragment | Text | undefined {
        const input = document.createElement('input');
        if (this.config.label){
            input.setAttribute('attribute', this.config.label)
        }
        input.setAttribute('value', debind(this.config.text) || '');
        input.addEventListener('change', (e)=>{
            const element = e.target as HTMLInputElement;

            if (typeof this.config.text === 'function'){
                this.config.text?.(element?.value);
            }
        });
        
        return input;


    }
}
export const TextField = swifty(TextFieldClass);

