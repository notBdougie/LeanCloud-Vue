var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var path = require('path')
var AV = require('leanengine')

var cloud = require('../common/cloud')
var config = require('./config')

var app = express()

// 设置环境变量
app.set('env', config.env)

// 设置 view 引擎
app.set('views', path.join(config.root, 'views'))
app.set('view engine', 'ejs')

// 加载云代码方法
app.use(cloud)

// 启用 HTTPS（必须要放在 app.use 之后）
app.enable('trust proxy')
app.use(AV.Cloud.HttpsRedirect())

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// 加载 cookieSession 以支持 AV.User 的会话状态
// 默认 cookie 5 天后过期
app.use(AV.Cloud.CookieSession({ secret: config.secret, maxAge: 3600000 * 24 * 5, fetchUser: true }))

app.use((req, res, next) => {
    const sessionToken = req.headers['x-lc-session']
    Logger.debug(`req.AV.user: ${!!req.AV.user}, sessionToken: ${!!sessionToken}`)
    
    if (!sessionToken || req.AV.user)
      return next()
      
    AV.User.become(sessionToken, {
      success: function(user) {
        req.AV.user = user
        next()
      },
      error: next
    })
})

// 加载路由
require('./routes')(app)

// error handlers
app.use(function(err, req, res, next) { // eslint-disable-line
  
  var statusCode, message

  var type = typeof err
  switch (type) {
    case 'number':
      statusCode = err
      message = "Internal Server Error."
      break
    case 'string':
      statusCode = 400
      message = err
      break
    default:
      statusCode = err.status || 500
      message = err.message || err
  }
  if(statusCode === 500) {
    // 具体的错误代码详见：https://leancloud.cn/docs/error_code.html
    console.error(err.stack || ("Error: ", err))
  }
  res.status(statusCode)

  if (req.xhr) {
    return res.end(message)
  } else {
    if (app.get('env') === 'development') {
      res.render('error', {
        message: message,
        error: err
      })
    } else {
      res.render('error', {
        message: err.message,
        error: {}
      })
    }

  }
})

module.exports = app