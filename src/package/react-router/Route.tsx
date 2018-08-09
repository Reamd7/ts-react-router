import * as H from "history";
import * as React from "react";
import { Imatch } from "./matchPath";
import matchPath from "./matchPath";
import * as warning from "warning";
import * as invariant from "invariant";
export interface IStaticContext {
  statusCode?: number;
}
export interface IRouteComponentProps< P,C extends IStaticContext = IStaticContext > extends React.Props<any>{
  history?: H.History;
  location?: H.Location;
  match?: Imatch<P>;
  staticContext?: C;
}
export interface IRouteProps {
  computedMatch?: Imatch<any>;
  location?: H.Location;
  component?: React.ComponentType<IRouteComponentProps<any>> | React.ComponentType<any>;
  render?: ((props: IRouteComponentProps<any>) => React.ReactNode);
  children?:((props: IRouteComponentProps<any>) => React.ReactNode)  | React.ReactNode;
  path?: string;
  exact?: boolean;
  sensitive?: boolean;
  strict?: boolean;
}
export interface I$RouteProps extends IRouteProps{
  context:IRouteContext
}
export interface I$RouteState {
  match:Imatch<any>|null
}
import { Context , IRouteContext } from "./context";

// ===========================================
const isEmptyChildren = (children: React.ReactNode) =>
  React.Children.count(children) === 0;

/**
 * The public API for matching a single path and rendering.
 */
export class $Route<T extends I$RouteProps = I$RouteProps> extends React.Component<T, any> {
  public props:T;
  public $context = this.props.context.data
  public $contextRef = this.props.context.ref
  
  public state:I$RouteState = {
    match: this.computeMatch(this.props, this.$context.router)
  };
  constructor(props:T){
    super(props);
    this.props = props;
    // ================= componentWillMount ==========
    warning(
      !(this.props.component && this.props.render),
      "You should not use <Route component> and <Route render> in the same route; <Route render> will be ignored"
    );

    warning(
      !(
        this.props.component &&
        this.props.children &&
        !isEmptyChildren(this.props.children)
      ),
      "You should not use <Route component> and <Route children> in the same route; <Route children> will be ignored"
    );

    warning(
      !(
        this.props.render &&
        this.props.children &&
        !isEmptyChildren(this.props.children)
      ),
      "You should not use <Route render> and <Route children> in the same route; <Route children> will be ignored"
    );
  }

  public computeMatch(props: I$RouteProps, router: IRouteContext["data"]["router"]):Imatch<any>|null {
    const { computedMatch, location, path, strict, exact, sensitive } = props;
    if (computedMatch) {return computedMatch}; // <Switch> already computed the match for us

    invariant(
      router,
      "You should not use <Route> or withRouter() outside a <Router>"
    );

    const { route } = router!;
    const pathname = (location || route!.location).pathname;

    return matchPath(pathname, { path, strict, exact, sensitive }, route.match);
  }
  public shouldComponentUpdate(nextProps:T,nextState:I$RouteState){
    console.log("Route Update")
    if (nextProps !== this.props){
      nextState.match = this.computeMatch(nextProps,this.$context.router)
      return true
    }
    return false
  }
  public render() {
    const { match } = this.state;
    const { children, component, render } = this.props;
    const { history, route, staticContext } = this.$context.router;
    const location = this.props.location || route.location;
    const props = { 
      match, 
      location, 
      history, 
      staticContext
    };      // TODO 有类型问题，这里有隐藏的Bug , 问题变为：staticContext 中的 staticContext 是啥来的

    if (component) {return match ? React.createElement(component, props) : null ;}

    if (render) {return match ? render({ match, location, history, staticContext}) : null;}

    if (typeof children === "function") {return match ? children({ match, location, history, staticContext }): null;}

    if (children && !isEmptyChildren(children)){
      return React.Children.only(children);
    }

    return null;
  }
}

export default function Route(props:IRouteProps){
  return (
    <Context.Consumer>
      {(context:IRouteContext)=>{
        console.log((window as any).context = context)
        return (<$Route {...props} context={context}/>)
      }}
    </Context.Consumer>
  )
}