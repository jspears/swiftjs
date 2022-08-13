import { View, Viewable } from './View';
import { Text } from './Text';
import { Font } from './Font';
import { HStack } from './Stack';
import {State} from './PropertyWrapper'

export interface ContentOpts {

}

export class ContentView extends Viewable<ContentOpts> {

    @State
    name?:string;

    body = View(
        HStack({},
               Text('SwiftUI').font(Font.largeTitle),
               Text('Is Cool')
        )
     )
    

}