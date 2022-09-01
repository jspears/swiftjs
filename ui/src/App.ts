import { swifty } from "@tswift/util";
import { h } from "preact";
import { Color } from "./Color";
import { Viewable } from "./View";
import type { View} from './View';

export class AppClass extends Viewable {

    constructor(...views:View[]){
        super(...views);
        this.background(Color.white);
        this.color(Color.primary);
        this.accentColor(Color.accentColor);
        this.foregroundColor(Color.primary);
    }
    
    render(){
        const style = this.asStyle({
            display:'flex',
            flex:'1',
            flexDirection:'column',
            overflow:'hidden',
            height:'100%',
            justifyContent: 'center',
            alignItems: 'center'
        });
        return h('div', {style}, [super.render()]);
    }
}

export const App = swifty(AppClass);