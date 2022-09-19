import {main, Viewable,State,Button,withAnimation,Text, Bound, Animation, AnimationTool} from "@tswift/ui";
import {SlideIn} from './SlideIn';
import {h} from 'preact';

@main
export class ExplicitTransition extends Viewable {
    @State  showBanana = false
    
     body = ()=>[
        Button("Toggle",()=>
            withAnimation('.easeIn', ()=> this.showBanana = !this.showBanana )
        ),
        this.showBanana && Text("🍌")
                .transition('.slide') 
    ]
    // render(){
    //     return h(SlideIn, {}, this.renderExec());
    // }
    
}
