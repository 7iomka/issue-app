const path = require('path');

const sassOptions = {
  // that is where can it be located imported scss/css (own or vendor)
  includePaths: [
    path.resolve(__dirname, '../../../'), // packages root
    path.resolve(__dirname, '../../../*/node_modules'), // packages modules
    path.resolve(__dirname, '../../../../apps'), // apps modules
    /*path.resolve(__dirname, '../../../../packages'), // packages modules*/
    path.resolve(__dirname, '../../../../apps/*/node_modules'), // apps modules
  ],
};

const sassLoaderOptions = {
  sassOptions,
  // additionalData: `@import "@steklo24/config/app/styles/resources.scss";`,
  additionalData: `@use "@steklo24/config/app/styles/resources.scss" as *;`,
};

module.exports = {
  sassOptions,
  sassLoaderOptions,
};
