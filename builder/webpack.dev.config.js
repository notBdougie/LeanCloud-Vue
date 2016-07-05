const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.config')
const config = require('./config')

const {portalPrefix} = config.serverConfig
const hotMiddleware = `webpack-hot-middleware/client?path=${portalPrefix}__webpack_hmr&noInfo=true&reload=true`

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = [hotMiddleware].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
    output: {
        filename: '[name].js',
        pathinfo: true
    },
    devtool: '#eval-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: 'client/index.html',
            filename: 'index.html',
            favicon: 'client/favicon.ico'
        })
    ] 
})