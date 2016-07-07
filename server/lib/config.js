const path = require('path')
const _ = require('lodash')

const env = process.env.LEANCLOUD_APP_ENV
              || process.env.NODE_ENV
              || require('./constants').DEVELOPMENT 

const config = _.merge({
  env: env,
  root: path.resolve(__dirname, '../')
}, require('config'), {
  port: process.env.LEANCLOUD_APP_PORT
          || process.env.PORT
})

config.publicPath = path.join(config.root, '../dist')

// append trailing slash if not added
let portalPrefix = config.portalPrefix
config.portalPrefix = portalPrefix + (/.*\/$/.test(portalPrefix) ? '' : '/')

module.exports = config