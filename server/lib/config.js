const path = require('path')
const _ = require('lodash')

const env = process.env.NODE_ENV || require('./constants').DEVELOPMENT 

const config = _.merge({
  env: env,
  root: path.resolve(__dirname, '../'),
  port: process.env.LC_APP_PORT || process.env.PORT || 3000,
  assetsEntry: 'assets'
}, require('config'))

config.publicPath = path.join(config.root, '../dist')

module.exports = config