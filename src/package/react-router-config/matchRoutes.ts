import matchPath from "../react-router/matchPath";
import { computeMatch } from "../react-router/Router";
import { IRouteConfig, IMatchedRoute } from "./@type";

// ensure we're using the exact code for default root match
// const { computeMatch } = Router.prototype;

function matchRoutes<T>(
  routes: IRouteConfig[],
  pathname: string,
  /*not public API*/ branch: Array<IMatchedRoute<T>> = []
): Array<IMatchedRoute<T>> {
  routes.some(function(route: IRouteConfig){
    const match = route.path
      ? matchPath(pathname, route)
      : branch.length
        ? branch[branch.length - 1].match // use parent match
        : computeMatch(pathname); // use default "root" match

    if (match) {
      branch.push({ route, match });

      if (route.routes) {
        matchRoutes(route.routes, pathname, branch);
      }
    }

    return Boolean(match);
  });

  return branch;
}

export default matchRoutes;
