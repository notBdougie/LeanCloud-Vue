// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path')
const serverConfig = require('../server/lib/config')

module.exports = {
  serverConfig,
  build: {
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: serverConfig.portalPrefix === '/' ? '/' : (serverConfig.portalPrefix + '/'),
    productionSourceMap: true
  },
  dev: {
    port: 8080,
    proxyTable: {}
  }
}
