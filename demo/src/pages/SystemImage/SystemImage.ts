import {main, Viewable, Image, Bound} from "@tswift/ui";

@main
export class SystemImage extends Viewable {

    body = (self:Bound<this>)=>{
        return Image("cloud.sun.rain.fill")
//        .font(.system(size: 400))
        .foregroundColor('.blue')
            .shadow({ color: '.purple', radius: 10, x: 0, y: 10 })

    }
}
