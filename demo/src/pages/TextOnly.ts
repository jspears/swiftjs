import { Viewable, Text } from "@tswift/ui";
import {run} from '../run';

class TextOnly extends Viewable {

    body = ()=>Text('hello');
}

run(new TextOnly());