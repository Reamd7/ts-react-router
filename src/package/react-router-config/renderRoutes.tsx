import * as React from "react";
import Switch from "../react-router/Switch";
import Route from "../react-router/Route";
import { IRouteConfig, ISwitchProps } from "./@type";
const renderRoutes = (routes:IRouteConfig[] | undefined, extraProps:any = {}, switchProps:ISwitchProps = {}) =>
  routes ? (
    <Switch {...switchProps}>
      {routes.map((route:IRouteConfig, i) => (
        <Route
          key={route.key || i}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          render={props =>
            (route.render) ? (
              route.render({ ...props, ...extraProps, route: route })
            ) : (
              (route.component) ? 
                <route.component {...props} {...extraProps} route={route} /> : 
                null
            )
          }
        />
      ))}
    </Switch>
  ) : null;

export default renderRoutes;
