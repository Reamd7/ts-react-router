import * as React from "react";
// export default function $Context<ContextType>(defaultValue: any = {}) {
//   const $ = React.createContext<any>({ data: defaultValue, ref: null });
//   interface RouteContext {
//     data: ContextType;
//     ref: React.Component<ContextProp, RouteContext>;
//   }
//   interface ContextProp {
//     value?: ContextType;
//     children?: React.ReactNode;
//     ref?: (ref: Context) => void;
//   }
//   class Context extends React.Component<ContextProp, RouteContext> {
//     static Consumer: React.Consumer<RouteContext> = $.Consumer;
//     public state: RouteContext;
//     constructor(props: ContextProp) {
//       super(props);
//       this.state = {
//         data: props.value || defaultValue,
//         ref: this
//       };
//       this.props.ref && this.props.ref(this);
//     }
//     public get data() {
//       return this.state.data;
//     }
//     public set data(value: ContextType) {
//       this.setState({
//         data: value,
//         ref: this
//       });
//     }
//     render() {
//       if (this.props.children) {
//         return (
//           <$.Provider value={this.state}>{this.props.children}</$.Provider>
//         );
//       } else {
//         return <$.Provider value={this.state} />;
//       }
//     }
//   }
//   return Context;
// }
// //=====================================
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
      location?: object;
      statusCode?: number;
    };
  };
}
const defaultValue = {};
const $ = React.createContext<any>({ data: defaultValue, ref: null });
export interface IRouteContext {
  data: IContextType;
  ref: React.Component<IContextProp, IRouteContext>;
}
interface IContextProp {
  value: IContextType;
  children?: React.ReactNode;
  ref?: (ref: Context) => void;
}
export class Context extends React.Component<IContextProp, IRouteContext> {
  static Consumer: React.Consumer<IRouteContext> = $.Consumer;
  public state: IRouteContext = {
    data: this.props.value,
    ref: this
  };
  public constructor(props: IContextProp) {
    super(props);
    if (this.props.ref){
        this.props.ref(this);
    }
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
