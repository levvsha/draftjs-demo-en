var path = require('path');
var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var rootPath = path.resolve(__dirname , '..');
var outPath = path.resolve(__dirname, '../public');

module.exports = {
  context: path.resolve(__dirname , '..'),
  devtool: 'source-map',
  entry: [
    './src/app.js'
  ],
  output: {
    path: outPath,
    filename: '[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.styl|\.css/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                localIdentName: '[local]',
                sourceMap: true
              }
            },
            {
              loader: 'autoprefixer-loader'
            },
            {
              loader: 'stylus-loader',
              options: {
                sourceMap: true,
              }
            }
          ],

        })
      },
      {
        test: /\.woff$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[path][name].[ext]',
          mimetype: 'application/font-woff'
        }
      },
      {
        test: /\.woff2$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[path][name].[ext]',
          mimetype: 'application/font-woff'
        }
      },
      {
        test: /\.ttf$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[path][name].[ext]',
          mimetype: 'application/octet-stream'
        }
      },
      {
        test: /\.eot$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.svg$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[path][name].[ext]',
          mimetype: 'image/svg+xml'
        }
      }
    ]
  },
  resolve: {
    modules: [
      'src',
      'node_modules'
    ],
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: '../public/index.html',
      template: './webpack/index.tpl.ejs',
    }),
    new CleanPlugin(outPath, {
      root: rootPath
    }),
    new ExtractTextPlugin({
      filename: '[name].[hash].css'
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      mangle: true,
      compress: {
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: false
      }
    })
  ],
  target: 'web',
  stats: {
    colors: true,
    hash: false,
    version: false,
    chunks: false,
    children: false
  }
}
