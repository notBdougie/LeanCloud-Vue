const express = require('express')

const auth = require('../auth')
const newsList = require('./newsList')
const newsView = require('./newsView')
const user = require('./user')

const router = express.Router()

// 免权限接口
router.post('/login', user.login)
router.post('/logout', user.logout)

router.get('/newsView', newsView.newsView)

// 校验权限
router.use(auth.member)

// 权限接口
router.get('/me', user.me)

router.get('/newsList', newsList.find)
router.get('/newsList/count', newsList.count)
router.get('/newsList/search', newsList.search)
router.get('/newsList/:_id', newsList.get)
router.put('/newsList/:_id', newsList.put)

module.exports = router