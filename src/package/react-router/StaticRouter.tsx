
import * as invariant from "invariant";
import * as React from "react";
import { createLocation, createPath } from "history";
import Router from "./Router";
import * as H from "history"
export interface IStaticRouterContext {
  url?: string;
  action?: 'PUSH' | 'REPLACE';
  location?: H.Location;
}
export interface IStaticRouterProps {
  basename?: string;
  location?: H.LocationDescriptor;
  context?: IStaticRouterContext;
  ins?:(ref:Router)=>void;
}

const addLeadingSlash = (path:string) => {
  return path.charAt(0) === "/" ? path : "/" + path;
};

const addBasename = (basename:string, location:H.Location) => {
  if (!basename) {
    return location;
  }
  return {
    ...location,
    pathname: addLeadingSlash(basename) + location.pathname
  };
};

function stripBasename(basename:string, location:H.Location){
  if (!basename) {return location};

  const base = addLeadingSlash(basename);

  if (location.pathname.indexOf(base) !== 0) {return location};

  return {
    ...location,
    pathname: location.pathname.substr(base.length)
  };
};

const createURL = (location:H.LocationDescriptorObject) =>
  typeof location === "string" ? location : createPath(location);

const staticHandler = (methodName:string) => (param?:any) => {
  invariant(false, "You cannot %s with <StaticRouter>", methodName);
};

const noop = () => {};

/**
 * The public top-level API for a "static" <Router>, so-called because it
 * can't actually change the current location. Instead, it just records
 * location changes in a context object. Useful mainly in testing and
 * server-rendering scenarios.
 */
class StaticRouter extends React.Component<IStaticRouterProps, any> {
  // static propTypes = {
  //   basename: PropTypes.string,
  //   context: PropTypes.object.isRequired,
  //   location: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  // };
  // static childContextTypes = {
  //   router: PropTypes.object.isRequired
  // };
  static defaultProps = {
    basename: "",
    location: "/",
    context:{}
  };

  public routerRef!:Router;
  public createHref: ((path:H.LocationDescriptorObject)=>string)
  public handlePush: ((location:H.LocationDescriptorObject)=>void)
  public handleReplace: ((location:H.LocationDescriptorObject)=>void)
  constructor(props:IStaticRouterProps){
    super(props);
    const self = this;
    this.createHref = (path:H.LocationDescriptorObject) => addLeadingSlash(self.props.basename + createURL(path));
    this.handlePush = (location:H.LocationDescriptorObject) => {
      const context = self.props.context!
      const basename = self.props.basename! // 因为不支持defaultProp所以被强迫非空类型断言
      context.action = "PUSH";
      context.location = addBasename(basename, createLocation(location));
      context.url = createURL(context.location!);
    };
    this.handleReplace = (location:H.LocationDescriptorObject) => {
      const context = self.props.context!
      const basename = self.props.basename! // 因为不支持defaultProp所以被强迫非空类型断言
      context.action = "REPLACE";
      context.location = addBasename(basename, createLocation(location));
      context.url = createURL(context.location!);
    };
  }
  
  handleListen = (param?:any) => noop;

  handleBlock = (param?:any) => noop;

  // componentWillMount() {
  //   warning(
  //     !this.props.history,
  //     "<StaticRouter> ignores the history prop. To use a custom history, " +
  //       "use `import { Router }` instead of `import { StaticRouter as Router }`."
  //   );
  // }

  render() {
    const { basename, location,context, ...props } = this.props;

    const history = {
      createHref: this.createHref,
      action: 'POP',
      location: stripBasename(basename!, createLocation(location!)),
      push: this.handlePush,
      replace: this.handleReplace,
      go: staticHandler("go"),
      goBack: staticHandler("goBack"),
      goForward: staticHandler("goForward"),
      listen: this.handleListen,
      block: this.handleBlock,
      length:0
    };
    return <Router {...props} staticContext={context} history={(history as H.History)} ins={this.props.ins}/>;
  }
  // =================================================

    
  public shouldcomponentupdate(nextProps: IStaticRouterProps) {

    // 更新 Context , 本质上和以前的 getChildContext 等价
    this.routerRef.ContextRef.update({
      router: {
        ...this.routerRef.ContextRef.data.router,
        staticContext: nextProps.context
      }
    });
  } 
}

export default StaticRouter;
