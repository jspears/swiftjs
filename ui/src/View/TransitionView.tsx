import { View } from "./View";
import { h, FunctionComponent as FC, Component } from "preact";
import { useRef, useLayoutEffect, useEffect, useState } from "preact/hooks";
import { SwitchTransition, Transition, TransitionStatus } from "react-transition-group";
import { On } from "./EventsMixin";
import { AnyTransition, TransitionContext, TransitionStyles } from "../AnyTransition";
import { CSSProperties } from "../types";

export interface TransitionComponentProps extends TransitionStyles {
  onDisappear?: On;
  onAppear?: On;
  unmounted?: CSSProperties;
}

export const TransitionComponent:FC<TransitionComponentProps> = ({
    children,
    onAppear,
    onDisappear,
    style,
    duration,
    ...transitionStyles
}) =>{
  const nodeRef = useRef(null);

  const [in_,setIn] = useState(TransitionContext.transition());

  useEffect(()=>{
     return   TransitionContext.transition.sink(setIn)
  });
  const onTransition = (state:TransitionStatus) =>{
    const s = !transitionStyles[state] ? style : {...style, ...transitionStyles[state]};
    console.log('onTransition '+ state, s, duration, children?.length);
    return  ( <div style={s} ref={nodeRef} key={in_ ? 'in' :'out'}>
      hello
     {children}
    </div>)
  };
  console.log('render', in_);
  return (
    <Transition key='my-fine-key' in={in_} timeout={duration} onEntered={onAppear} onExited={onDisappear} >
    {onTransition}
  </Transition>);
}
// export class TransitionComponent extends Component<TransitionComponentProps, {in:boolean}> {
//    state = {
//     in:true
//   }
//   constructor(comp: TransitionComponentProps) {
//     super();
//     this.componentWillUnmount = TransitionContext.transition.sink((v) => {
//       console.log("component state cahnged");
//       this.setState({ in: v });
//     });
//   }
//   handleTransition = (state: TransitionStatus)=> {
//     console.log('state', state, this.state.in);
//     const stateCSS = this.props[state];
//     const s = stateCSS ? { ...this.props.style, ...stateCSS } : this.props.style;
//     return <div style={s}>{this.props.children}</div>;
//   }
//   render() {
//     console.log('render', this.props.duration);
//     return (
//       <SwitchTransition mode='out-in'>
//       <Transition in={this.state.in} timeout={this.props.duration} children={this.handleTransition}/>
//       </SwitchTransition>
//     );
//   }
// }
export class TransitionView extends View {
  constructor(
    private transition?: AnyTransition,
    private onAppear?: On,
    private onDisappear?: On,
    private child?: View,
  ) {
    super();
    this.style = this.transition.toStyle();
  }
  render() {
    return h(
      TransitionComponent,
      {
        onAppear: this.onAppear,
        onDisappear: this.onDisappear,
        ...this.style,
      },
      [this.child?.render()],
    );
  }
}
