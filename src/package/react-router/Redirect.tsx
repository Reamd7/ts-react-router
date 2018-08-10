import * as React from "react";
import * as warning from "warning";
import * as invariant from "invariant";
import { createLocation, locationsAreEqual } from "history";
import generatePath from "./generatePath";
import * as H from "history"
import { Imatch } from './matchPath';
import { Context, IRouteContext } from './context';
export interface I$RedirectProps extends IRedirectProps{
  context:IRouteContext   // "You should not use <Redirect> outside a <Router>"
}
/**
 * The public API for updating the location programmatically
 * with a component.
 */
class $Redirect extends React.Component<I$RedirectProps, any> {

  static defaultProps = {
    push: false
  };
  public $context = this.props.context.data
  public $contextRef = this.props.context.ref


  constructor(props:I$RedirectProps) {
    super(props);
    invariant(
      this.$context.router,
      "You should not use <Redirect> outside a <Router>"
    );

    if (this.isStatic()) {this.perform();} /** StsticContext Container */
  }
  isStatic() {
    return this.$context.router && this.$context.router.staticContext;
  }
  componentDidMount() {
    if (!this.isStatic()) {this.perform();}
  }

  componentDidUpdate(prevProps:I$RedirectProps) {
    const prevTo = createLocation(prevProps.to);
    const nextTo = createLocation(this.props.to);

    if (locationsAreEqual(prevTo, nextTo)) {
      warning(
        false,
        `You tried to redirect to the same route you're currently on: ` +
          `"${nextTo.pathname}${nextTo.search}"`
      );
      return;
    }

    this.perform();
  }

  computeTo({ computedMatch, to } = this.props) {
    if (computedMatch) {
      if (typeof to === "string") {
        return generatePath(to, computedMatch.params);
      } else {
        return {
          ...to,
          pathname: generatePath(to.pathname, computedMatch.params)
        };
      }
    }

    return to;
  }

  perform() {
    const { history } = this.$context.router;
    const { push } = this.props;
    const to:H.Path | H.LocationDescriptorObject = this.computeTo(this.props);

    if (push) {
      history.push(to as H.Path); // 这里报错的原因是因为，不知道甚么原因导致函数重载的类型识别失败，但其实是符合类型的。
    } else {
      history.replace(to as H.Path);
    }
  }

  render() {
    return null;
  }
}
export interface IRedirectProps{
  computedMatch?: Imatch<any>; // private, from <Switch> // todo
  to: H.LocationDescriptor;
  push?: boolean;
  from?: string;
  path?: string;
  exact?: boolean;
  strict?: boolean;
//  context:IRouteContext; // You should not use <Prompt> outside a <Router> , 需传递context参数。
}
export function Redirect(props:IRedirectProps){
  return (
    <Context.Consumer>
    {(context:IRouteContext)=>{
      return (<$Redirect {...props} context={context}/>)
    }}
    </Context.Consumer>
  )
}
export default Redirect;
