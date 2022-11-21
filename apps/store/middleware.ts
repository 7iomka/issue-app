import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { appConfig } from '@steklo24/config/app';
import { routes, authURLs } from '@/shared/routes';

const redirectTo = (request: NextRequest, to: string, includeFrom = true) => {
  const toUrl = new URL(to, request.url);
  if (includeFrom) {
    toUrl.searchParams.set('from', request.nextUrl.pathname);
  }

  return NextResponse.redirect(toUrl);
};

export async function middleware(request: NextRequest) {
  // Setting cookies on the response
  const response = NextResponse.next();
  const pth = request.nextUrl.pathname;

  console.log('MIDDDLEWARE path to', pth);

  const isProtectedRoute = pth.startsWith(routes.account.main);
  const isAuthRoute = authURLs.some((url) => pth.startsWith(url));
  // skip public routes, except auth routes
  if (!isProtectedRoute && !isAuthRoute) {
    return response;
  }
  // Getting cookies from the request
  const token = request.cookies.get(appConfig.authKeys.token);

  // If user is authorized - disallow public auth pages
  if (!!token && isAuthRoute) {
    return redirectTo(request, routes.home);
  }

  // If token isn't present, redirect to login
  if (!token && isProtectedRoute) {
    console.log('REDIRECT TO LOGIN');
    return redirectTo(request, routes.login);
  }

  return response;
}

export const config = {
  // Now we have issue (https://github.com/vercel/next.js/issues/40498)
  // As hotfix we used gip for auth pages, and account pages too
  // This way static pages can't be affected
  // TODO: Fix when issue will be resolved
  // matcher: [],
  matcher: ['/regisiter', '/login', '/reset', '/account', '/account/:path*'],
};
