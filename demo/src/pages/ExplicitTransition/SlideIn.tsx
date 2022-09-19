import  {Transition}  from 'react-transition-group';
import {useState} from "preact/hooks";
const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 1 },
  entered:  { opacity: 1 },
  exiting:  { opacity: 0 },
  exited:  { opacity: 0 },
};

export const Slider = ({ in: inProp  = true}) => (
  <Transition in={inProp} timeout={duration}>
    {state => (
      <div style={{
        ...defaultStyle,
        ...transitionStyles[state]
      }}>
        I'm a fade Transition!
      </div>
    )}
  </Transition>
);
export const SlideIn = ()=>{
  const [state, setState] = useState(false);
  const onClick = ()=>{
    setState(!state);
    console.log('click');
  }
  return(<div>
    <button onClick={onClick}>Click</button>
    <Slider in={state}/>
  </div>);
 }