import { Viewable } from './View';
import { swifty } from '@tswift/util';
import { h } from 'preact';
import {Text} from './Text';
class NavigationViewClass extends Viewable {
    
    render(){
        return h('div', {}, [
            Text(this._navigationTitle || '').font('.largeTitle').render(),
            super.render()
        ])
    }
}
export const NavigationView = swifty(NavigationViewClass);
