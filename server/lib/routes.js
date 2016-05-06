const express = require('express')
const auth = require('../auth')
const newsList = require('../api/newsList')
const newsView = require('../api/newsView')
const user = require('../api/user')
const config = require('./config')

module.exports = function (app) {

  // 静态目录
  if (app.get('env') === require('./constants').DEVELOPMENT) {
    // 开发热部署
    require('./compile')(app)
  } else {
    app.use('/', express.static(config.publicPath))
  }

  // 后台接口
  app.post('/api/login', user.login)
  app.post('/api/logout', user.logout)

  app.get('/api/newsView', newsView.newsView)

  // app.use(auth.member)

  app.get('/api/me', user.me)
  
  app.get('/api/newsList', newsList.find)
  app.get('/api/newsList/count', newsList.count)
  app.get('/api/newsList/search', newsList.search)
  app.get('/api/newsList/:_id', newsList.get)
  app.put('/api/newsList/:_id', newsList.put)


}