const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


const PATHS = {
  app: path.join(__dirname, 'src/client'),
  build: path.join(__dirname, 'build/client'),
};

module.exports = {
  devtool: 'source-map',
  entry: {
    app: ['./src/client/index.jsx'],
  },
  output: {
    path: PATHS.build,
    publicPath: '/',
    filename: 'bundle.js',
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src/client'), 'node_modules'],
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new HtmlWebpackPlugin({
      template: HtmlWebpackTemplate,
      links: [{
        rel: 'stylesheet',
        href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css',
        integrity: 'sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ',
        crossorigin: 'anonymous',
      }],
      title: 'Demo App',
      appMountId: 'app',
      mobile: true,
      inject: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      mangle: true,
      compress: {
        warnings: false, // Suppress uglification warnings
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
      },
      output: {
        comments: false,
      },
      exclude: [/\.min\.js$/gi], // skip pre-minified libs
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0,
    }),
    new ExtractTextPlugin({
      filename: '[name].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /(js|jsx)$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'eslint-loader',
          },
        ],
      },
      {
        test: /\.(css)$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'resolve-url-loader',
            },
          ],
          fallback: 'style-loader',
        }),
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                import: true,
                importLoaders: 1,
                localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
              },
            },
            {
              loader: 'resolve-url-loader',
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
          fallback: 'style-loader',
        }),
      },
      {
        test: /\.(jpg|png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 25000,
            },
          },
        ],
      },
    ],
  },
};