import { main, Viewable, Circle, Text, Label } from "@tswift/ui";

@main
export class LabelDemo extends Viewable {

    body = Label({
        icon: Circle()
            .fill('.blue')
            .frame({ width: 44, height: 44, alignment: '.center' })
            .overlay(Text("BL"))
    },

        Text("Bob Loblaw")
            .font('.body')
            .foregroundColor('.primary'),
        Text("Person at Law")
            .font('.subheadline')
            .foregroundColor('.secondary')
    )
}
