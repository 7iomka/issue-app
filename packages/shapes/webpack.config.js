const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (env, argv) {
  const isProd = argv.mode === 'production';
  const staticDir = path.join(__dirname, 'dist');
  const outputDir = isProd
    ? path.resolve(__dirname, '../../apps/store/public/shapes')
    : path.join(__dirname, 'dist');

  return {
    entry: {
      basic: './src/basic.ts',
      "shapes_link_modul":"./modul_shapes/shapes_link_modul.ts",
      "shapes_modul":"./modul_shapes/shapes_modul.ts"
    },
    output: {
      path: outputDir,
      filename: './[name].js',
      //  clean: true,
     //publicPath: '/',
    },
    // devtool: 'inline-nosources-cheap-source-map',
    //  devtool: 'cheap-module-source-map',
    devtool: 'eval',
    /* devServer: {
    contentBase: './dist',
  }, */
    devServer: {
      static: {
        directory: staticDir,
      },
      compress: true,
      port: 9090,
      https:true
    },
    watch: isProd ? false : true,
    //devtool:'eval',
    plugins: [
      false 
      ? new HtmlWebpackPlugin({
        inject:false,
        template: 'dataHtmlOld.html'
      }) :
      new HtmlWebpackPlugin({
        inject:false,
        template: 'dataHtmlModul.html'
      }),
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      modules: [
        'src',
        'src/modul',
        'node_modules',
        'node_modules/three/examples/jsm/loaders',
        'node_modules/three/examples/jsm/controls',
        'node_modules/three/examples/jsm/effects',
      ],
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'ts-loader',
          exclude: '/node_modules/',
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader',
        },
      ],
    },
  };
};
