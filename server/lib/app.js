const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path')
const AV = require('leanengine')
const multer = require('multer')

const cloud = require('../common/cloud')
const config = require('./config')

const app = express()

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

// 接收请求头部传递的 Session Token
app.use((req, res, next) => {
    const sessionToken = req.headers['x-lc-session']
    
    if (!sessionToken || req.AV.user)
      return next()
      
    Logger.debug(`req.AV.user: ${!!req.AV.user}, sessionToken: ${!!sessionToken}`)
      
    AV.User.become(sessionToken, {
      success: function(user) {
        req.AV.user = user
        next()
      },
      error: next
    })
})

// 处理 multipart/form-data
app.use(multer().fields([]))

// 加载路由
require('./routes')(app)

// 错误处理
app.use(function(err, req, res, next) { // eslint-disable-line
  
  let error = {}
  
  const type = typeof err
  switch (type) {
    case 'number':
      error.status = err
      error.message = "Internal Server Error."
      break
    case 'string':
      error.status = 400
      error.message = err
      break
    default:
      error = err
      error.status = err.status || 500
      error.message = err.message || err.statusTest || "Unknown Error."
  }
  
  // 具体的错误代码详见：https://leancloud.cn/docs/error_code.html
  if(error.status === 500)
    console.error(error.stack || ("Error: ", error))
  error.stack = undefined
  
  res.status(error.status)
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    return res.json(error)
  } else {
    return res.render('error', {error})
  }
})

module.exports = app