import { URLValue } from './urlSchema';

export function isAbsoluteUrl(url: string) {
  // TODO: test
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

export type URLQueryParamsSource = ConstructorParameters<typeof URLSearchParams>[0];

export function queryParamsToString(queryParams: Partial<URLQueryParamsSource>) {

  // remove fields with undefined value
  if (queryParams)
    //@ts-ignore
    Object.keys(queryParams).forEach(key => queryParams[key] === undefined ? delete queryParams[key] : {});

  //@ts-ignore
  return (new URLSearchParams(queryParams))
    .toString();
}

export function appendQueryParams<T extends URLValue>(url: T, params: Record<string, string | string[]>): T {
  return withUrl(url, url => {
    const { searchParams } = url;

    Object
      .entries(params)
      .forEach(([key, value]) => {
        if (Array.isArray(value))
          value.forEach(v => searchParams.append(key, v));
        else
          searchParams.append(key, value);
      });

    return url;
  });
}

export function excludeQueryParams<T extends URLValue>(url: T, keys: string[]): T {
  return withUrl(url, url => {
    const { searchParams } = url;
    keys.forEach(key => searchParams.delete(key));
    return url;
  });
}

/**
 * Safe wrapper around URL constructor.
 */
export function toUrl(url: string | URL): URL | null {
  try {
    return new URL(url);
  } catch (err) {
    return null;
  }
}

export function toRelativeUrlString(url: string | URL): string | null {
  const urlObj = toUrl(url)
  if (!urlObj) return null;

  return (
    urlObj.pathname +
    urlObj.search +
    urlObj.hash
  );
}

/**
 * Utility pipeline for processing URL and returning the same output type as the input.
 * The following input/output mappings are supported:
 * - URL objects
 * - absolute URL strings
 * - relative URL strings
 */
export function withUrl<T extends URLValue>(url: T, executor: (url: URL) => URL): T {

  const isObject = url instanceof URL;
  const isString = typeof url === 'string';

  let isAbsoluteString = false;
  try {
    if (isString) {
      new URL(url);
      isAbsoluteString = true;
    }
  } catch (err) { }

  let urlObj: URL;
  if (!isAbsoluteString) {
    urlObj = new URL(url, 'http://localhost');
  } else {
    // here the url is either an URL already or an absolute URL
    // which was previously validated in the try..catch block above
    urlObj = new URL(url);
  }

  const resUrlObj = executor(urlObj);

  // return the result in the same format as the input
  if (isObject) {
    return resUrlObj as T;
  } else if (isAbsoluteString) {
    return resUrlObj.href as T;
  } else {
    return (
      resUrlObj.pathname +
      resUrlObj.search +
      resUrlObj.hash) as T;
  }
}