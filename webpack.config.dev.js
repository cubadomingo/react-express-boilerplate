const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');

const PATHS = {
  app: path.join(__dirname, 'src/client'),
  build: path.join(__dirname, 'build'),
};

module.exports = {
  devtool: 'eval',
  entry: {
    app: [
      'react-hot-loader/patch',
      './src/client/index.jsx',
    ],
  },
  output: {
    path: PATHS.build,
    publicPath: '/',
    filename: '[name].js',
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src/client'), 'node_modules'],
    extensions: ['.js', '.jsx'],
  },
  performance: {
    hints: false,
  },
  devServer: {
    disableHostCheck: true,
    historyApiFallback: true,
    hot: true,
    stats: 'errors-only',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: HtmlWebpackTemplate,
      links: [{
        rel: 'stylesheet',
        href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css',
        integrity: 'sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ',
        crossorigin: 'anonymous',
      }],
      meta: [{
        charset: 'utf-8',
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      }],
      title: 'Demo App',
      appMountId: 'app',
      inject: false,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: "'development'",
      },
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
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
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'resolve-url-loader',
          },
        ],
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
            },
          },
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