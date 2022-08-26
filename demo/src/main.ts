// // import {MainScreen} from './MainScreen';

// // console.log('hello', MainScreen);
// import {render} from '@tswift/ui';
import { TextFieldDemo } from './TextFieldDemo';
import { render } from '@tswift/ui';
import { SimpleList } from './SimpleList';
import { OceanList } from './OceanList';
import './style.css';
import { Component, h } from 'preact';
import Png from './SimpleList.png';

// render('#app', new TextFieldDemo);
const Demo = {
  TextFieldDemo,
  OceanList,
  SimpleList,
} as const;
const app = document.querySelector('#app');

setup(app as HTMLDivElement);
render(new Demo.SimpleList(), app);

function setup(app: HTMLDivElement) {
  if (app == null || app.parentElement == null) {
    return;
  }
  const check = document.createElement('input', {});
  check.setAttribute('type', 'checkbox');
  const label = document.createElement('label');
  label.innerHTML = 'Background';
  app.parentElement.insertBefore(label, app);
  app.parentElement.insertBefore(check, label);
  const style = {
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '-17px 26px',
    backgroundImage: `url(${Png})`,
    minWidth: '300px',
    minHeight: '300px',
  };
  check.addEventListener('change', (e) => {
    const ul = app.querySelector('ul') as HTMLUListElement;
    if (ul) {
      if ((e.target as HTMLInputElement).checked) {
        Object.assign(ul.style, {
          opacity: '.5',
          background: 'pink',
        });
        Object.assign(app.style, style);
      } else {
        Object.assign(ul.style, {
          opacity: 'unset',
          background: '#fff',
        });
        Object.assign(app.style, { background: 'none' });
      }
    }
  });
  Object.assign(app.style, style);
}
