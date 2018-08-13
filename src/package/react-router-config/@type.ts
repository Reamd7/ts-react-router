import * as React from "react";
import { IRouteComponentProps, Imatch } from "../react-router";
import { Location } from "history";

export interface IRouteConfigComponentProps<T> extends IRouteComponentProps<T> {
    route?: IRouteConfig;
}

export interface IRouteConfig {
    location?: Location;
    component?: React.ComponentType<IRouteConfigComponentProps<any> | {}>;
    path?: string;
    exact?: boolean;
    strict?: boolean;
    routes?: IRouteConfig[];
    key?:number|string;
    render?:(props:IRouteConfigComponentProps<any>)=>IRouteConfig['component']
}
export interface IMatchedRoute<T> {
    route: IRouteConfig;
    match: Imatch<T>;
}

export {ISwitchProps,IRouteComponentProps} from "../react-router"