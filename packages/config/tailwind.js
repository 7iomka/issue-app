// const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require('tailwindcss/plugin');
const { corePlugins } = require('tailwindcss/lib/corePlugins');
// const colors = require('tailwindcss/colors');

const bootstrapGridPlugin = require('tailwind-bootstrap-grid');
const cssVariablesPlugin = require('@mertasan/tailwindcss-variables');
const aspectRatioPlugin = require('@tailwindcss/aspect-ratio');
const lineClampPlugin = require('@tailwindcss/line-clamp');

const {
  customTypography,
  customUtilities,
  customComponents,
  colors,
  breakpointsWithPxUnit,
  containerMaxWidths,
  themeColorKeys,
  spacing,
  radiusWithPxUnit,
  shadow,
  transition,
  fontSizes,
  fontFamily,
} = require('./theme');

const round = (value, precision = 5) => {
  const power = Math.pow(10, precision);
  return Math.round(value * power + Number.EPSILON * power) / power;
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '.color-scheme-dark'], // custom class instead of default 'dark'
  // content paths always resolved by tailwind relative to root of every project
  content: [
    './src/**/*.{ts,tsx,html}',
    './pages/**/*.{ts,tsx,html}',
    '../../packages/**/*.{ts,tsx}',
  ],
  important: true,
  theme: {
    colors: {
      ...colors,
      // put back non-palette tailwind static colors
      inherit: 'inherit',
      current: 'currentColor',
      transparent: 'transparent',
      black: '#000',
      white: '#fff',

      ...themeColorKeys.reduce((acc, curr) => {
        return {
          ...acc,
          [curr]: `rgba(var(--${curr}-rgb), <alpha-value>)`,
          [`${curr}-active`]: `rgba(var(--${curr}-active-rgb), <alpha-value>)`,
          [`${curr}-light`]: `rgba(var(--${curr}-light-rgb), <alpha-value>)`,
          [`${curr}-inverse`]: `rgba(var(--${curr}-inverse-rgb), <alpha-value>)`,
        };
      }, {}),
      gray: {
        ...Object.keys(colors.gray).reduce((acc, curr) => {
          return {
            ...acc,
            [curr]: `rgba(var(--gray-${curr}-rgb), <alpha-value>)`,
          };
        }, {}),
      },
    },
    fontSize: {
      ...fontSizes,
    },
    // We add some advanced variables from tailwind settings in addition to css variables declared in styles
    variables: {
      DEFAULT: {
        // gray colors
        gray: colors.gray, // TLDR: can be inverted for darkmode if needed
        // neutral colors (variations of gray to extend limit of 10 colors per shade)
        neutral: colors.neutral,
        // shadow (workaround, https://github.com/mertasan/tailwindcss-variables/issues/25)
        ...Object.keys(shadow).reduce((acc, curr) => {
          return {
            ...acc,
            [`shadow-${curr}`]: shadow[curr],
          };
        }, {}),
        // transiton
        ...Object.keys(transition).reduce((acc, curr) => {
          return {
            ...acc,
            [`transition-${curr}`]: transition[curr],
          };
        }, {}),
        // radius
        ...Object.keys(radiusWithPxUnit).reduce((acc, curr) => {
          return {
            ...acc,
            [`radius-${curr}`]: radiusWithPxUnit[curr],
          };
        }, {}),
      },
    },
    // Configure variables for dark mode (optional)
    // darkVariables: {
    // },
    // own screens
    screens: breakpointsWithPxUnit,
    // Border radius (.rounded-xxx)
    borderRadius: radiusWithPxUnit,
    spacing: spacing.withPxUnit,
    boxShadow: Object.keys(shadow).reduce((acc, curr) => {
      return {
        ...acc,
        // get shadows values from css variables
        [curr]: `var(--shadow-${curr})`,
      };
    }, {}),
    aspectRatio: {
      // auto: 'auto',
      // square: '1 / 1',
      // video: '16 / 9',
      ...Array.from(Array(21).keys()).reduce((acc, curr) => {
        return {
          ...acc,
          [`${curr + 1}`]: `${curr + 1}`, // from 1 to 21
        };
      }, {}),
    },
    extend: {
      fontFamily: {
        ...fontFamily,
        sans: fontFamily.base, // alias
      },
      maxWidth: {
        // Add .max-width-container-xxx
        ...Object.keys(containerMaxWidths).reduce(
          (prev, curr) => ({ ...prev, [`container-${curr}`]: containerMaxWidths[curr] }),
          {},
        ),
      },
      // Add custom variants
      lineHeight: {
        ...Array.from({ length: 100 }, (_, i) => round(1 + i * 0.01)).reduce((acc, curr) => {
          return {
            ...acc,
            [`${curr}`.replace('.', '-')]: `${curr}`, // usage: leading-1-5 (line-height: 1.5)
          };
        }, {}),
      },
    },
  },
  plugins: [
    // we use this plugin only for add some css-vars from tailwind config
    // as a base we use css files for this purpose
    cssVariablesPlugin({
      darkToRoot: true,
      darkSelector: '.color-scheme-dark',
      colorVariables: true,
    }),
    bootstrapGridPlugin({
      containerMaxWidths,
      gridGutters: spacing.withPxUnit,
    }),
    aspectRatioPlugin,
    lineClampPlugin,
    // Adding custom utilities here
    plugin(function (cfg) {
      const { addComponents, addUtilities, addBase, theme, postcss } = cfg;
      addComponents(customTypography);
      customComponents.map((cmp) => addComponents(cmp({ theme })));
      customUtilities.map((cmp) => addUtilities(cmp({ theme })));
    }),
  ],
  corePlugins: {
    ...corePlugins,
    container: false, // use bootstrap grid implementation instead
    preflight: false, // disable preflight, and include modified version (prevent conflict with @emotion prepend)
  },
};
