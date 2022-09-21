import { View } from "./View";
import { h, FunctionComponent as FC, Component } from "preact";
import { useRef, useLayoutEffect, useEffect, useState } from "preact/hooks";
import { SwitchTransition, Transition, TransitionStatus } from "react-transition-group";
import { On } from "./EventsMixin";
import { AnyTransition, TransitionContext, TransitionStyles } from "../AnyTransition";
import { CSSProperties } from "../types";

export interface TransitionComponentProps {
  onDisappear?: On;
  onAppear?: On;
  transition?: AnyTransition
}

export const TransitionComponent:FC<TransitionComponentProps> = ({
    children,
    onAppear,
    onDisappear,
    transition,
}) =>{
  const [style, setStyle] = useState<CSSProperties>({});
  useEffect(()=>{
     return transition?.styles(setStyle)
  });
  return <div style={style}>
    {children}
  </div>
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
  }
  toggle() {
    return this.transition?.toggle();
  }
  render() {
    return h(
      TransitionComponent,
      {
        onAppear: this.onAppear,
        onDisappear: this.onDisappear,
        transition: this.transition,
      },
      [this.child?.render()],
    );
  }
}
