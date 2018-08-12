import * as warning from "warning";
import * as invariant from "invariant";
import * as React from "react";
import * as H from "history";
import { Imatch } from "./matchPath";

interface IRouterProps extends React.Props<any> {
	history: H.History;
	ins?:(ref:Router)=>void
	staticContext?:IContextType['router']['staticContext']
}
interface IRouterState {
	match: Imatch<any>;
}
import { Context, IContextType } from "./context";

function computeMatch(pathname: string): Imatch<any> {
	return {
		path: "/",
		url: "/",
		params: {},
		isExact: pathname === "/"
	};
}
/**
 * The public API for putting history on context.
 *
 * React 对 history 模块的封装
 *
 */
class Router extends React.Component<IRouterProps, IRouterState> {
	public state: IRouterState;
	public unlisten: H.UnregisterCallback;

	public ContextRef: Context; // 组件实例化之后才有
	public history: H.History;
	public initContext:IContextType; // 初始化 Context

	public constructor(props: IRouterProps) {
		super(props);
		
		// ============= this.history =================	
		this.InitHistory(props.history)
		// ============= this.state =================	
		const history = this.history
		const match = computeMatch(history.location.pathname);
		this.state = {
			match: match,
		};
		this.initContext = {
			router: {
				history: history,
				route: {
					get location(){return history.location},
					match: match
				}
			}
		};
		if (this.props.staticContext){
			this.initContext.router.staticContext = this.props.staticContext
		}
		// ========= $componentWillMount ========
		const children = props.children;
		invariant(
			children == null || React.Children.count(children) === 1,
			"A <Router> may have only one child element"
		);

		// Do this here so we can setState when a <Redirect> changes the
		// location in componentWillMount. This happens e.g. when doing
		// server rendering using a <StaticRouter>.
		this.unlisten = history.listen(() => {
			this.setState({
				...this.state,
				match: computeMatch(this.history.location.pathname)
			});
		});
		if (this.props.ins){
			this.props.ins(this)
		}
	}
	/**
	 * 这个设计的目的是满足 使用 history 中的方法修改 History 对象时候，组件能够实时修改
	 * @param history 
	 */
	public InitHistory(history:H.History){
		this.history = new Proxy(history,{
			get:(target,props)=>{
				const el = target[props];
				if (props === "push" || props === "replace"){
					return (function(this:Router){
						const history = this.history;
						el.apply(history,arguments);

						const location = history.location;
						const match = computeMatch(location.pathname);
						// 需要注意的是，
						// 这里的更新除了渲染后用户自定义操作history 外，
						// 还可能因为Redirect 中的重定向在渲染前被调用。
						this.ContextRef.update({ 
							router: {
								history: history,
								route: {
									get location(){return location},
									match: match
								}
							}
						});
						this.state.match = match // 
					}).bind(this)
				}else{
					return el
				}
			}
		})
	}
	public render() {
		/** ins props 优于 ref ,因为ins 是自定义的属性能够在render 之前就将属性定义好， */
		return (
			<Context children={this.props.children} value={this.initContext} ins={(context: Context) => {
					this.ContextRef = context;
			}}/>
		);
	}
	public shouldcomponentupdate(nextProps: IRouterProps,nextState:IRouterState) {
		warning(
			this.props.history === nextProps.history,
			"You cannot change <Router history>"
		);
		// 更新 Context , 本质上和以前的 getChildContext 等价
		this.InitHistory(nextProps.history)
		const history = this.history;
		const location = history.location;
		const match = computeMatch(location.pathname);
		const Context:IContextType = {
			router: {
				history: history,
				route: {
					get location(){return location},
					match: match
				}
			}
		}
		if (nextProps.staticContext){
			Context.router.staticContext = nextProps.staticContext
		}
		this.ContextRef.update(Context);
		nextState.match = match
	} 
	public componentWillUnmount() {
		this.unlisten();
	}
}
export default Router