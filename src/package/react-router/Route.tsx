import * as H from "history";
import * as React from "react";
import  { Imatch } from "./matchPath";
export interface IStaticContext {
  statusCode?: number;
}
export interface IRouteComponentProps<
  P,
  C extends IStaticContext = IStaticContext
> extends React.Props<any> {
  history?: H.History;
  location?: H.Location;
  match?: Imatch<P>;
  staticContext?: C;
}
export interface IRouteProps extends React.Props<any> {
  computedMatch?: Imatch<any>;
  location?: H.Location;
  component?:
    | React.ComponentType<IRouteComponentProps<any>>
    | React.ComponentType<any>;
  render?: ((props: IRouteComponentProps<any>) => React.ReactNode);
  children?:
    | ((props: IRouteComponentProps<any>) => React.ReactNode)
    | React.ReactNode;
  path?: string;
  exact?: boolean;
  sensitive?: boolean;
  strict?: boolean;
}
