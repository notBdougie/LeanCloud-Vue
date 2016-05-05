var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var config = require('./webpack.base.config')

config.output.filename = "[name].js"
config.output.pathinfo = true

config.entry = ['webpack-hot-middleware/client?reload=true', ...config.entry]

config.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
        template: 'client/index.html',
        filename: 'index.html',
        favicon: 'client/favicon.ico'
    }),
    ...config.plugins]

module.exports = config