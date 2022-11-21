/* eslint-disable @typescript-eslint/ban-types */
import type { Tuple } from '@mantine/core';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import { colors } from '@steklo24/config/theme';

import { isBrowser } from '@steklo24/utils';
import { gapPolyfillPlugin } from './stylis-gap-polyfill-plugin';

type ColorKey = keyof typeof colors;

type MantineColors = {
  [key in ColorKey]: Tuple<string, 10>;
};

const mantineColors = Object.fromEntries(
  Object.entries(colors).map(([k, v]) => [k, Object.values(v)]),
) as MantineColors;

type CustomColors = keyof typeof mantineColors | (string & {}); // <<

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<CustomColors, Tuple<string, 10>>;
  }
}

// On the client side, Create a meta tag at the top of the <head> and set it as insertionPoint.
// This assures that styles are loaded first.
// It allows developers to easily override styles with other styling solutions, like CSS modules.
// See: https://github.com/emotion-js/emotion/issues/2790 if global styles will cause issues
function createEmotionCache() {
  let insertionPoint;

  if (isBrowser()) {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      'meta[name="emotion-insertion-point"]',
    );
    insertionPoint = emotionInsertionPoint ?? undefined;
  }

  return createCache({
    key: 'mantine',
    insertionPoint,
    prepend: true,
    stylisPlugins: [prefixer, gapPolyfillPlugin],
  });
}

const mantineEmotionCache = createEmotionCache();

export type { MantineColors };
export { mantineColors, mantineEmotionCache };
