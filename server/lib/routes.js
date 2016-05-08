const express = require('express')
const api = require('../api')
const config = require('./config')

module.exports = function (app) {
  
  const IsDevMode = app.get('env') === require('./constants').DEVELOPMENT
  
  // 后台接口
  app.use('/api', api)

  // 其他请求返回给前端处理
  app.use(require('connect-history-api-fallback')({
      verbose: IsDevMode,
      index: '/'
  }))

  // 开发热部署
  if (IsDevMode) {
    require('./compile')(app)
  }
  
  app.use('/', express.static(config.publicPath))
}