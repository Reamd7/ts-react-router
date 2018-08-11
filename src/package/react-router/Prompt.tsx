import * as React from "react";
import * as H from "history"
import { Context, IRouteContext } from './context';
export interface I$PromptProps extends IPromptProps{
  context:IRouteContext; // You should not use <Prompt> outside a <Router> , 需传递context参数。
}
import * as invariant from "invariant"
/**
 * The public API for prompting the user before navigating away
 * from a screen with a component.
 */
class $Prompt extends React.Component<I$PromptProps> {

  static defaultProps = {
    when: true
  };
  public $context = this.props.context.data
  public $contextRef = this.props.context.ref
  
  public unblock?: H.UnregisterCallback;   // TODO

  constructor(props:I$PromptProps){
    super(props)
    // =============================
    invariant(
      this.props.context.data.router,
      "You should not use <Prompt> outside a <Router>"
    );

    if (this.props.when) {this.enable(this.props.message);}
  }

  public enable(message:I$PromptProps["message"]) {
    if (this.unblock) {this.unblock();}
    this.unblock = this.$context.router.history.block(message);
  }
  public disable() {
    if (this.unblock) {
      this.unblock();
      this.unblock = undefined;
    }
  }


  shouldComponentUpdate(nextProps:IPromptProps,nextState:any) {
    if (nextProps.when) {
      if (!this.props.when || this.props.message !== nextProps.message){
        this.enable(nextProps.message);
      }
    } else {
      this.disable();
    }
    return false;
  }

  componentWillUnmount() {
    this.disable();
  }

  render() {
    return null;
  }
}
export interface IPromptProps{
  message: string | ((location: H.Location) => string | false);
  when?: boolean;
}
export function Prompt(props:IPromptProps){
  return (
    <Context.Consumer>
    {(context:IRouteContext)=>{
      return (<$Prompt {...props} context={context}/>)
    }}
    </Context.Consumer>
  )
}
export default Prompt;
