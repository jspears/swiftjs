import {Viewable, Text, Button, VStack, State} from '@tswift/ui'
import {run} from '../run';

class StateExample extends Viewable {
    @State intValue = 0
  
     body = (_, self = this)=>
      VStack (
        Text(`intValue equals ${self.intValue}`),
  
        Button("Increment", ()=>{
          self.intValue += 1
        })
      )
    
}

run(new StateExample);
  