var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var config = require('./webpack.base.config')

config.output.filename = "[name].js"
config.output.pathinfo = true

config.entry = ['webpack-hot-middleware/client?reload=true', ...config.entry]

config.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
        template: 'app/index.html',
        filename: 'index.html',
        favicon: 'app/favicon.ico'
    }),
    ...config.plugins]

module.exports = config