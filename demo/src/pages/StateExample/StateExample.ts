import {Viewable, Text, Button, VStack, State} from '@tswift/ui'

export class StateExample extends Viewable {
    @State intValue = 0
  
     body = (_, self = this)=>
      VStack (
        Text(`intValue equals ${self.intValue}`),
  
        Button("Increment", ()=>{
          self.intValue += 1
        })
      )
    
}
  