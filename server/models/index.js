var AV = require('leanengine')

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象

exports.UseCase = AV.Object.extend('UseCase')

const PREFIX = 'AUR'
exports.News = AV.Object.extend(`${PREFIX}News`)
exports.Topic = AV.Object.extend(`${PREFIX}Topic`)
exports.Channel = AV.Object.extend(`${PREFIX}Channel`)
exports.NewsComment = AV.Object.extend(`${PREFIX}NewsComment`)
exports.TopicComment = AV.Object.extend(`${PREFIX}TopicComment`)
exports.StatusCounter = AV.Object.extend(`${PREFIX}StatusCounter`)