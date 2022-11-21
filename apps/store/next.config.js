const path = require('path');
const { withPlugins } = require('next-composed-plugins');
const { patchWebpackConfig } = require('next-global-css');
// const transpileModules = require('next-transpile-modules');
const { sassOptions, sassLoaderOptions } = require('@steklo24/config/app/styles/sass-options');
const { svgConfig } = require('@steklo24/icons/config');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  reactStrictMode: false,
  typescript: {
    // ignoreDevErrors: true,
    // ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  sassOptions: {
    ...sassOptions,
    additionalData: sassLoaderOptions.additionalData, // https://github.com/vercel/next.js/discussions/24105
  },
  webpack: (config, options) => {
    const { isServer, buildId, webpack } = options;
    svgConfig(config);
    patchWebpackConfig(config, options);
    // workspacesConfig(config);

    config.resolve.alias = {
      ...config.resolve?.alias,
      /**
       * Prevent using effector .mjs extension in "web" version of bundle
       * Otherwise, we can face different bugs when using effector
       */
      effector: path.resolve('../../node_modules/effector/effector.cjs.js'),
      'effector-react/scope': path.resolve('../../node_modules/effector-react/scope.js'),
      'effector-react': path.resolve('../../node_modules/effector-react/effector-react.cjs.js'),
    };
    return config;
  },
};

// const scopedPackages = [
//   '@steklo24/utils',
//   '@steklo24/hooks',
//   '@steklo24/icons',
//   '@steklo24/config',
//   '@steklo24/types',
// ];
// const plugins = [transpileModules([...scopedPackages])];
const plugins = [];

module.exports = withPlugins(nextConfig, plugins);
