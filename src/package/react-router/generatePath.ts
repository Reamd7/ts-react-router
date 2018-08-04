import * as pathToRegexp from "path-to-regexp";

interface ICache{
  [pattern:string]:pathToRegexp.PathFunction
}
interface IpatternCache{
  [pattern:string]:ICache
}
const patternCache:IpatternCache = {};
const cacheLimit = 10000;
let cacheCount = 0;

const compileGenerator = (pattern:string) => {
  const cacheKey = pattern;
  const cache = patternCache[cacheKey] || (patternCache[cacheKey] = {});

  if (cache[pattern]) {
    return cache[pattern]}

  const compiledGenerator = pathToRegexp.compile(pattern);

  if (cacheCount < cacheLimit) {
    cache[pattern] = compiledGenerator;
    cacheCount++;
  }

  return compiledGenerator;
};

/**
 * Public API for generating a URL pathname from a pattern and parameters.
 */
const generatePath = (pattern = "/", params: { [paramName: string]: string | number | boolean } = {}):string => {
  if (pattern === "/") {
    return pattern;
  }
  const generator = compileGenerator(pattern);
  // return generator(params, { pretty: true });
  return generator(params);
};

export default generatePath;
