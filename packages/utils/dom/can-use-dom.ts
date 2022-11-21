/**
 * Checks, can use DOM api in current environment.
 *
 * @example
 * if (canUseDOM) {
 *   document.querySelector('...')
 * }
 */
export const canUseDOM =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';
