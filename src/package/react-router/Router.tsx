import * as warning from "warning";
import * as invariant from "invariant";
import * as React from "react";
import * as H from "history";
import { Imatch } from "./matchPath";

interface IRouterProps extends React.Props<any> {
	history: H.History;
}
interface IRouterState {
	match: Imatch<any>;
	context: IContextType;
}
export interface IRouterChildContext<P> {
	router: {
		history: H.History;
		route: {
			location: H.Location;
			match: Imatch<P>;
		};
	};
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

	public ContextRef!: Context; // 组件实例化之后才有
	public history: H.History;
	
	public constructor(props: IRouterProps) {
		super(props);

		const { children, history } = props;

		// ============= this.history =================	
		this.InitHistory(history)
		// ============= this.state =================	
		const match = computeMatch(this.history.location.pathname);
		this.state = {
			match: match,
			context: {
				router: {
					history: this.history,
					route: {
						location: this.history.location,
						match: match
					}
				}
			}
		};
		// ========= $componentWillMount ========

		invariant(
			children == null || React.Children.count(children) === 1,
			"A <Router> may have only one child element"
		);

		// Do this here so we can setState when a <Redirect> changes the
		// location in componentWillMount. This happens e.g. when doing
		// server rendering using a <StaticRouter>.
		this.unlisten = this.history.listen(() => {
			this.setState({
				...this.state,
				match: computeMatch(this.history.location.pathname)
			});
		});
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
						el.apply(target,arguments);
						const location = target.location
						const match = computeMatch(location.pathname);
						this.setState({
							match: match,
							context: {
								router: {
									history: target,
									route: {
										location: location,
										match: match
									}
								}
							}
						});
					}).bind(this)
				}else{
					return el
				}
			}
		})
	}
	public render() {
		const children = this.props.children;

		if (children) {
			return (
				<Context value={this.state.context} ref={(context: Context) => {
						this.ContextRef = context;
					}}
				>{children}</Context>
			);
		} else {
			return (
				<Context value={this.state.context} ref={(context: Context) => {
						this.ContextRef = context;
					}} />
			);
		}
	}
	public shouldcomponentupdate(nextProps: IRouterProps,nextState:IRouterState) {
		warning(
			this.props.history === nextProps.history,
			"You cannot change <Router history>"
		);
		// 更新 Context , 本质上和以前的 getChildContext 等价
		this.InitHistory(nextProps.history)
		this.ContextRef.update({
			router: {
				...this.ContextRef.data.router,
				history: this.history,
				route: {
					location: this.history.location,
					match: computeMatch(this.history.location.pathname)
				}
			}
		});
	} 
	public componentWillUnmount() {
		this.unlisten();
	}
}
export default Router