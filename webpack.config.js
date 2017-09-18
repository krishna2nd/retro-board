const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const languages = require('./app/i18n/languages.json');

const staticFolder = path.resolve(__dirname, 'assets');
const momentFilter = languages.map(lang => lang.iso).join('|');

module.exports = {
  entry: [
    'react-hot-loader/patch',
    './app/index.jsx'
  ],
  output: {
    path: staticFolder,
    publicPath: 'http://localhost:8080/assets/',
    filename: 'app.js'
  },
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
    modules: [
      path.resolve('./app'),
      'node_modules',
      path.resolve(__dirname, './node_modules')
    ],
    alias: {
      '../../theme.config$': path.join(__dirname, 'retrospected-theme/theme.config')
    }
  },
  module: {
    rules: [
      { enforce: 'pre', test: /(\.jsx|\.js)$/, use: ['eslint-loader'] },

      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      {
        test: /(\.jsx|\.js)$/,
        use: [
          'babel-loader',
          'semantic-ui-react-less-loader'
        ],
        exclude: /node_modules\/(?!(semantic-ui-react|ANOTHER-ONE)\/).*/
      },
      { test: /\.svg$/, loader: 'url-loader?limit=10' },
      { test: /\.png$/, loader: 'url-loader?limit=10000&mimetype=image/png' },
      { test: /\.jpg$/, loader: 'url-loader?limit=10000&mimetype=image/jpeg' },
      {
        test: /(\.scss)$/,
        use: [
          'style-loader',
          'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          {
            loader: 'sass-loader?sourceMap',
            options: {
              data: `@import "${path.resolve(__dirname, 'app/theme.scss')}";`
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'less-loader' // compiles Less to CSS
        }]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/fontwoff'
      },
      {
        test: /\.gif$|\.ttf$|\.eot$/,
        use: 'file-loader?name=[name].[ext]?[hash]'
      }
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, new RegExp(momentFilter)),
    new ExtractTextPlugin({ filename: 'style.css', allChunks: true }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEVELOPMENT__: true,
      __DEVTOOLS__: false,
      __USE_GA__: false,
      __GA_ID__: null
    }),
    new webpack.ProvidePlugin({
      React: 'react'
    })
  ]
};
