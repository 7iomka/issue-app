import { createStore } from 'effector';

export const $cookies = createStore<{ [key: string]: string }>({}, { serialize: 'ignore' });

export function serializeCookies(cookies: Record<string, string>) {
  return Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join(';');
}
