// const pxtoremOptions = {
//   rootValue: 16, // we use 1rem = 16px (browser's default)
//   unitPrecision: 5,
//   propList: ['*', '!letter-spacing'],
//   selectorBlackList: [/^html[^body]+body$/, /^\.container/, /::-webkit-scrollbar/, /:export/], // ignore html,body {} rule (fix issue with min-width: 320px)
//   replace: true,
//   mediaQuery: false,
//   minPixelValue: 2,
//   // exclude: /node_modules/i
//   exclude: (fileName) => {
//     // console.log('fileName', fileName);
//     return false;
//   },
// };
// If you want to use other PostCSS plugins, see the following:
// https://tailwindcss.com/docs/using-with-preprocessors
module.exports = {
  plugins: {
    // 'flex-gap-polyfill': {}, // not working as expected
    tailwindcss: {},
    autoprefixer: {},
    // 'postcss-pxtorem': pxtoremOptions,
    '@thedutchcoder/postcss-rem-to-px': {
      baseValue: 16,
    },
  },
};
