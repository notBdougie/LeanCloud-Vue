const webpack = require('webpack')
const _ = require('lodash')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.config')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./builder/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = _.merge(baseWebpackConfig, {
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