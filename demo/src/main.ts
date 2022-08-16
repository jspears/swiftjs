// // import {MainScreen} from './MainScreen';

// // console.log('hello', MainScreen);
// import {render} from '@jswift/ui';
import { TextFieldDemo } from "./TextFieldDemo";
import { render } from "@jswift/ui";

// render('#app', new TextFieldDemo);

render(new TextFieldDemo(), document.querySelector("#app"));
