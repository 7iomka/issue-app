import { isClient } from './platform';

export function getRootRelativeURL(url: string | string[]) {
  if (Array.isArray(url)) {
    const urlSegments = url as string[];
    return urlSegments.length === 0
      ? '/'
      : `/${urlSegments.filter(Boolean).map(encodeURIComponent).join('/')}`;
  }

  if (!(url as string).startsWith('/')) {
    return `/${url}`;
  }

  return url;
}

// whole url with params (only clientside)
export const getLocationURL = (
  params?: URLSearchParams | { [key: string]: string | string[] | undefined } | string,
  includeOrigin?: boolean,
) => {
  let resParamsString = '';
  if (params instanceof URLSearchParams) {
    resParamsString.toString();
  } else if (typeof params === 'object' && Object.keys(params).length > 0) {
    resParamsString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');
  } else if (typeof params === 'string') {
    resParamsString = params;
  }

  return isClient()
    ? (includeOrigin ? window.location.origin : '') +
        window.location.pathname +
        (resParamsString ? `?${resParamsString}` : '') +
        (window.location.hash && window.location.hash !== '#' ? window.location.hash : '')
    : '';
};
