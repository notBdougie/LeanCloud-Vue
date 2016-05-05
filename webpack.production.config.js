var webpack = require('webpack')
var WebpackMd5Hash = require('webpack-md5-hash')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var config = require('./webpack.base.config')

config.output.hash = true
config.output.filename = "[name].[chunkhash].js"

config.plugins = [
  new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production")
      }
    }),
  new WebpackMd5Hash(),
  new HtmlWebpackPlugin({
    template: 'client/index.html',
    filename: '../index.html',
	  favicon: 'client/favicon.ico',
    inject: 'body'
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    }
  }),
  ...config.plugins]

module.exports = config