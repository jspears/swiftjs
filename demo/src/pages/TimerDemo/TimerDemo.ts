import {Button, Viewable,Image, main, Font, State,VStack, Timer,Text, Bound} from "@tswift/ui";
@main
export class TimerDemo extends Viewable {
    @State  value = 0.0;
    timer = Timer.publish( 0.5);//.autoconnect()
    
    body = ({timer, value}:Bound<this>) => 
        VStack ({},
            Image( "rectangle.and.pencil.and.ellipsis", value)
                .imageScale('.large')
                .font(Font.system(60)),
            Image( "wifi", value)
                .imageScale('.large')
                .font(Font.system( 60)),
            Image("phone.down.waves.left.and.right", value)
                .imageScale('.large')
                .font(Font.system( 60)),
            Image( "shower.fill",  value)
                .imageScale('.large')
                .font(Font.system( 60))
                        )
        .onReceive(timer, ()=>{
            if (value < .99) {
                this.value = value + 0.25;
            } else {
                this.value = 0.0;
            }
        })
    
}
