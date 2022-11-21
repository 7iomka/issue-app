const path = require('path');

const workspacesConfig = (config) => {
  /*
   * Modify the Next.js webpack config to allow workspace libs to use css modules.
   * Note: This would be easier if Next.js exposes css-loader and sass-loader on `defaultLoaders`.
   */

  // Include workspace `packages` in css/sass loaders
  const includes = [path.resolve(__dirname, '../../packages')];

  const nextCssLoaders = config.module.rules.find((rule) => typeof rule.oneOf === 'object');

  // webpack config is not as expected
  if (!nextCssLoaders) return config;

  /*
   *  1. Modify css loader to enable module support for workspace libs
   */
  const nextCssLoader = nextCssLoaders.oneOf.find(
    (rule) => rule.sideEffects === false && regexEqual(rule.test, /\.module\.css$/),
  );
  // Might not be found if Next.js webpack config changes in the future
  if (nextCssLoader) {
    nextCssLoader.issuer.or = nextCssLoader.issuer.and
      ? nextCssLoader.issuer.and.concat(includes)
      : includes;
    delete nextCssLoader.issuer.and;
  }

  /*
   *  2. Modify sass loader to enable module support for workspace libs
   */
  const nextSassLoader = nextCssLoaders.oneOf.find(
    (rule) => rule.sideEffects === false && regexEqual(rule.test, /\.module\.(scss|sass)$/),
  );
  // Might not be found if Next.js webpack config changes in the future
  if (nextSassLoader) {
    nextSassLoader.issuer.or = nextSassLoader.issuer.and
      ? nextSassLoader.issuer.and.concat(includes)
      : includes;
    delete nextSassLoader.issuer.and;
  }

  /*
   *  3. Modify error loader to ignore css modules used by workspace libs
   */
  const nextErrorCssModuleLoader = nextCssLoaders.oneOf.find(
    (rule) =>
      rule.use &&
      rule.use.loader === 'error-loader' &&
      rule.use.options &&
      (rule.use.options.reason ===
        'CSS Modules \u001b[1mcannot\u001b[22m be imported from within \u001b[1mnode_modules\u001b[22m.\n' +
          'Read more: https://err.sh/next.js/css-modules-npm' ||
        rule.use.options.reason ===
          'CSS Modules cannot be imported from within node_modules.\nRead more: https://err.sh/next.js/css-modules-npm'),
  );
  // Might not be found if Next.js webpack config changes in the future
  if (nextErrorCssModuleLoader) {
    nextErrorCssModuleLoader.exclude = includes;
  }

  /**
   * 4. Modify css loader to allow global css from node_modules to be imported from workspace libs
   */
  const nextGlobalCssLoader = nextCssLoaders.oneOf.find((rule) =>
    rule.include?.and?.find((include) => regexEqual(include, /node_modules/)),
  );
  // Might not be found if Next.js webpack config changes in the future
  if (nextGlobalCssLoader) {
    nextGlobalCssLoader.issuer.or = nextGlobalCssLoader.issuer.and
      ? nextGlobalCssLoader.issuer.and.concat(includes)
      : includes;
    delete nextGlobalCssLoader.issuer.and;
  }

  return config;
};

function regexEqual(x, y) {
  return (
    x instanceof RegExp &&
    y instanceof RegExp &&
    x.source === y.source &&
    x.global === y.global &&
    x.ignoreCase === y.ignoreCase &&
    x.multiline === y.multiline
  );
}

module.exports = {
  workspacesConfig,
};
