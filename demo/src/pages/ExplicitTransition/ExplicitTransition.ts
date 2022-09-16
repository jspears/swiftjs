import {main, Viewable,State,Button,withAnimation,Text, Bound} from "@tswift/ui";

@main
export class ExplicitTransition extends Viewable {
    @State  showBanana = false
    
     body = ()=>[
        Button("Toggle",()=>
            withAnimation('.easeInOut', ()=> this.showBanana = !this.showBanana )
        ),
        this.showBanana && Text("🍌")
                .transition('.slide')
    ]
    
}
