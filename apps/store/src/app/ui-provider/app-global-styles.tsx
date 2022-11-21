// import { css, Global as GlobalCss } from '@emotion/react';
import type { MantineTheme } from '@mantine/core';
import { Global } from '@mantine/core';
import { hexToRGB, toKebabCase } from '@steklo24/utils';
import { colors, spacing } from '@steklo24/config/theme';
import { getRootBackgroundColor, getRootColor, getThemeColor } from '@/shared/config';

const colorVariables = (theme: MantineTheme) => {
  const config = {
    rootBackground: getRootBackgroundColor(theme),
    rootColor: getRootColor(theme),
    // generate theme colors variables
    primary: theme.fn.primaryColor(),
    secondary: getThemeColor({ theme, color: 'rose' }),
    success: getThemeColor({ theme, color: 'green' }),
    danger: getThemeColor({ theme, color: 'rose' }),
    // generate gray variables
    ...Object.keys(colors.gray).reduce(
      (acc, curr) => ({
        ...acc,
        [`gray-${curr}`]: colors.gray[curr as unknown as keyof typeof colors.gray],
      }),
      {},
    ),
  };

  return Object.keys(config).reduce((acc, curr) => {
    const key = toKebabCase(curr);
    return {
      ...acc,
      [`--${key}`]: config[curr as keyof typeof config],
      [`--${key}-rgb`]: hexToRGB(config[curr as keyof typeof config]),
    };
  }, {});
};

const AppGlobalStyles = () => (
  <Global
    styles={(theme) => [
      {
        // variables
        ':root': {
          ...colorVariables(theme),
          // font-sizes variables
          ...Object.keys(theme.fontSizes).reduce(
            (acc: any, curr: any) => ({
              ...acc,
              [`--font-size-${curr}`]: `${theme.fontSizes[curr as keyof typeof theme.fontSizes]}px`,
            }),
            {},
          ),
          // spacing aliased only
          ...Object.keys(spacing.aliased).reduce(
            (acc: any, curr: any) => ({
              ...acc,
              [`--spacing-${curr}`]: `${spacing.aliased[curr as keyof typeof spacing.aliased]}px`,
            }),
            {},
          ),
          // custom lineHeights (TODO: configure at theme level)
          '--line-height-for-xs': '1.4',
          '--line-height-for-sm': '1.4',
          '--line-height-for-base': 'normal',
        },
        'html, body': {
          minWidth: '320px',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          msTextSizeAdjust: '100%',
          WebkitTextSizeAdjust: '100%',
          WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
        },
        body: {
          fontFamily: theme.fontFamily,
          fontSize: theme.fontSizes.md,
          fontWeight: 400,
          lineHeight: 'normal',
          textDecorationSkipInk: 'none',
        },
        // body: {
        //   fontFamily: 'var(--body-font-family)',
        //   fontSize: 'var(--body-font-size)',
        //   fontWeight: 'var(--body-font-weight)',
        //   lineHeight: 'var(--body-line-height)',
        //   color: 'var(--body-color)',
        //   textAlign: 'var(--body-text-align)',
        //   backgroundColor: 'var(--body-bg)',
        // },
        '.changing-color-scheme, .changing-color-scheme *': {
          transition: 'none !important',
        },
        'h1, h2, h3, h4, h5, h6': {
          fontWeight: 700,
          lineHeight: 1.2,
        },
        'button, a': {
          transitionDuration: '0.2s',
          transitionProperty:
            'background-color,border-color,color,fill,stroke,opacity,box-shadow,transform',
        },
        ':disabled': {
          pointerEvents: 'none',
        },
        // remove a gray border for images while loading (Safari)
        // uncomment when issue done (See: https://github.com/vercel/next.js/issues/40615)
        // '@media not all and (min-resolution:.001dpcm)': {
        //   'img[loading="lazy"]': { clipPath: 'inset(0.5px)' },
        // },
        // ...other global styles
      },
    ]}
  />
);

export { AppGlobalStyles };
