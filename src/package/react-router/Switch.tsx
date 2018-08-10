import * as React from "react";
import * as warning from "warning";
import matchPath from "./matchPath";
import * as H from 'history';
import { IRouteProps } from './Route';
import { IRedirectProps } from './Redirect';
import { IRouteContext,Context } from './context';
import * as invariant from "invariant";

export interface I$SwitchProps extends ISwitchProps{
  context:IRouteContext
}
export interface ISwitchProps {
  children?: React.ReactNode;
  location?: H.Location;
}

/**
 * The public API for rendering the first <Route> that matches.
 */
class $Switch extends React.Component<I$SwitchProps, any> {
  // static contextTypes = {
  //   router: PropTypes.shape({
  //     route: PropTypes.object.isRequired
  //   }).isRequired
  // };

  // static propTypes = {
  //   children: PropTypes.node,
  //   location: PropTypes.object
  // };
  public $context:IRouteContext["data"] = this.props.context.data;
  public constructor(props:I$SwitchProps){
    super(props)
    invariant(
      this.$context.router,
      "You should not use <Switch> outside a <Router>"
    );
  }
  shouldComponentUpdate(nextProps:I$SwitchProps,nextState:{}) {
    warning(
      !(nextProps.location && !this.props.location),
      '<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'
    );

    warning(
      !(!nextProps.location && this.props.location),
      '<Switch> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.'
    );
    return true
  }

  render() {
    const { route } = this.$context.router;
    const children  = this.props.children;
    const location = this.props.location || route.location;

    let match!:(IRouteContext["data"]['router']['route']['match']) | null;
    let child!:React.ReactElement<any>;
      
    React.Children.forEach(children, element => {
      if (match == null && React.isValidElement(element)) {
        const {
          path: pathProp,
          exact,
          strict,
          sensitive,
          from
        } = (element.props as IRouteProps & IRedirectProps); // 必须是这两种组件作为子组件
        const path = pathProp || from;

        child = element;
        match = matchPath(
          location.pathname,
          { path, exact, strict, sensitive },
          route.match
        );
      }
    });

    return match
      ? React.cloneElement(child, { location, computedMatch: match })
      : null;
  }
}
function Switch (props:ISwitchProps) {
  return (
    <Context.Consumer>
      {(context)=>{
        return <$Switch {...props} context={context} />
      }}
    </Context.Consumer>
  )
}
export default Switch;
