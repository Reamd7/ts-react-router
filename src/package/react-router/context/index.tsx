import * as React from "react";
import "proxy-polyfill"

import { Imatch } from "../matchPath";
import * as H from "history";
export interface IContextType {
  router: {
    history: H.History;
    route: {
      location: H.Location;
      match: Imatch<any>;
    };
    staticContext?: {
      url?: string;
      action?: "PUSH" | "REPLACE";
      location?: H.Location;
      statusCode?: number;
    };
  };
}
const defaultValue = {};
const $ = React.createContext<any>({ data: defaultValue, ref: null });
export interface IRouteContext {
  data: IContextType;
  ref: Context;
}
interface IContextProp extends React.Props<Context>{
  value: IContextType;
}
export class Context extends React.Component<IContextProp, IRouteContext> {
  static Consumer: React.Consumer<IRouteContext> = $.Consumer;
  public props:IContextProp;
  public state: IRouteContext = {
    data:this.props.value,
    ref:this
  }

  public get data() {
    return this.state.data;
  }
  public set data(value: IContextType) {
    this.setState({
      data: value,
      ref: this
    });
  }
  public update = (value: IContextType) => {
    this.data = value;
  };
  public shouldComponentUpdate(nextProps:IContextProp,nextState:IRouteContext){
    const isPropsUpdate = (nextProps !== this.props);
    if (isPropsUpdate){
      if (nextProps.value.router === nextState.data.router){
        return false
      }else{
        nextState.data.router = nextProps.value.router;
        return true
      }
    }
    const isStateUpdate = (nextState !== this.state);
    return (isStateUpdate);
  }
  public render() {
    if (this.props.children) {
      return <$.Provider value={this.state}>{this.props.children}</$.Provider>;
    } else {
      return <$.Provider value={this.state} />;
    }
  }
}

/**
 * 因为编写这个统一的管理的Context 进行数据状态管理，
 * 所以有两点，甚么组件是用来初始化Context 的
 * 甚么组件是用来调用Context 的，以及其update 方法。
 *
 * Router 中
 * - generatePath/matchPath/withRouter 是工具函数
 * - MemoryRouter 直接调用Router.没有对Context 进行修改
 * - Prompt 使用Context
 * - Redirect 使用Context
 * - Route 使用Context 也有ChildContext 以及更新时修改，但是Route 必须使用在Router 中
 * - Router 使用Context  也有ChildContext 以及更新时修改
 * - StaticRouter Router的封装，不使用Context 也有getChildContext
 * - Switch 使用 Context
 */
