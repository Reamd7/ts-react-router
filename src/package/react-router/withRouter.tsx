import * as React from "react";
import hoistStatics from "./hoist-non-react-statics";
import * as Route from "./Route";
// export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/**
 * A public higher-order component to access the imperative API
 */

interface IWrapperProp extends Route.IRouteComponentProps<any>, React.Props<any>{
  wrappedComponentRef?:React.Ref<any>
}
interface IComponentProp extends IWrapperProp{
  [key:string]:any
}
interface IComponentConstructor<P extends IComponentProp = IComponentProp>{
  WrappedComponent:React.ComponentType<P>
}
function withRouter<P = {},Component = {}>(
  Component: React.ComponentType<IWrapperProp & P>
):React.ComponentType<IWrapperProp & P> & IComponentConstructor & Component{
  class Wrapper extends React.Component<IWrapperProp>{
    static displayName = `withRouter(${Component.displayName ||  (Component).name})`;
    static WrappedComponent = Component;
    render(){
      const { wrappedComponentRef, ...remainingProps } = this.props;
      return (
        <Route.default
          children={routeComponentProps => (
            <Component
              {...remainingProps}
              {...routeComponentProps}
              ref={wrappedComponentRef}
            />
          )}
        />
      );
    }
  }

  return hoistStatics(Wrapper, Component);
}


export default withRouter;
