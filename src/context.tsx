import * as React from "react";

export default function $Context<ContextType>(defaultValue: any = {}) {
  const $ = React.createContext<any>({ data: defaultValue, ref: null });
  interface IContext {
    data: ContextType;
    ref: React.Component<IContextProp, IContext>;
  }
  interface IContextProp {
    value?: ContextType;
    children?: React.ReactNode;
    ref?: (ref: Context) => void;
  }
  class Context extends React.Component<IContextProp, IContext> {
    static Consumer: React.Consumer<IContext> = $.Consumer;
    public state: IContext = {
        data: this.props.value || defaultValue,
        ref: this
    };
    constructor(props: IContextProp) {
      super(props);
      if (this.props.ref){
        this.props.ref(this);
      }
    }
    public get data() {
      return this.state.data;
    }
    public set data(value: ContextType) {
      this.setState({
        data: value,
        ref: this
      });
    }
    public shouldComponentUpdate(nextProps:IContextProp,nextState:IContext){
      const isPropsUpdate = (nextProps !== this.props);
      if (isPropsUpdate){
        if (nextProps.value === nextState.data){
          return false
        }else{
          nextState.data = nextProps.value!;
          return true
        }
      }
      const isStateUpdate = (nextState !== this.state);
      return (isStateUpdate);
    }
    public render() {
      if (this.props.children) {
        return (
          <$.Provider value={this.state}>{this.props.children}</$.Provider>
        );
      } else {
        return <$.Provider value={this.state} />;
      }
    }
  }
  return Context;
}
// ==================== demo =================
