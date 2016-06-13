const express = require('express')

const api = require('../api')
const config = require('./config')
const DataSanitizer = require('./sanitizer').DataSanitizer

module.exports = function (app) {
  
  const IsDevMode = app.get('env') === require('./constants').DEVELOPMENT
  
  // 过滤掉 _ 开头的数据
  app.use(DataSanitizer)
  
  // 后台接口
  app.use('/api', require('./paging'), api)

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