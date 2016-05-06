const webpack = require('webpack')
const webpackConfig = require('../../builder/webpack.dev.config')
const proxyMiddleware = require('http-proxy-middleware')
const compiler = webpack(webpackConfig)

const proxyTable = {}

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: console.log
})

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

module.exports = function (app) {
    // proxy api requests
    Object.keys(proxyTable).forEach(function (context) {
    let options = proxyTable[context]
    if (typeof options === 'string') {
        options = { target: options }
    }
    app.use(proxyMiddleware(context, options))
    })
    
    // serve webpack bundle output
    app.use(devMiddleware)

    // enable hot-reload and state-preserving
    // compilation error display
    app.use(hotMiddleware)
}