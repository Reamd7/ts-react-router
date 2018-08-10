import * as pathToRegexp from "path-to-regexp";
import { IRouteProps } from "./Route";

export interface Imatch<P> {
  params: P;
  isExact: boolean;
  path: string;
  url: string;
}
interface IcompiledPattern {
  re:RegExp;
  keys:pathToRegexp.Key[]
}

const patternCache:{
  [pattern:string]:{
    [pattern:string]:IcompiledPattern
  }
} = {};

const cacheLimit = 10000;
let cacheCount = 0;

function compilePath(
  pattern: string,
  options: { end: boolean; strict: boolean; sensitive: boolean }
):IcompiledPattern{
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
  const cache = patternCache[cacheKey] || (patternCache[cacheKey] = {});

  if (cache[pattern]) {
    return cache[pattern];
  }
  const keys:pathToRegexp.Key[] = [];
  const re = pathToRegexp(pattern, keys, options);
  const compiledPattern = { re, keys };

  if (cacheCount < cacheLimit) {
    cache[pattern] = compiledPattern;
    cacheCount++;
  }

  return compiledPattern;
};

/**
 * Public API for matching a URL pathname to a path pattern.
 */
function matchPath<P extends {
  [key:string]:string|number
  [key:number]:string|number
} = any>(
  pathname: string,
  options: IRouteProps | string = {},
  parent: Imatch<P> | null = null
): Imatch<P> | null {
  if (typeof options === "string") {
    options = { path: options };
  }
  const { path, exact = false, strict = false, sensitive = false } = options;
  
  if (path == null) {
    return parent;
  }
  const { re, keys } = compilePath(path, { end: exact, strict, sensitive });

  const match = re.exec(pathname);
  if (!match) {
    return null;
  }
  const [url, ...values] = match;
  const isExact = pathname === url;

  if (exact && !isExact){
    return null;
  } 

  return {
    path, // the path pattern used to match
    url: path === "/" && url === "" ? "/" : url, // the matched portion of the URL
    isExact, // whether or not we matched exactly
    params:(()=>{
      const params:{
        [key:string]:string|number
        [key:number]:string|number
      }  = {};
      keys.forEach((key,index)=>{
        params[key.name] = values[index];
      });
      return (params as P);
    })()
  };
}
export default matchPath;
