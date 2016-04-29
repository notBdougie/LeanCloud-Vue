var AV = require('leanengine')

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象

export const UseCase = AV.Object.extend('UseCase')

const PREFIX = 'AUR'
export const News = AV.Object.extend(`${PREFIX}News`)
export const Topic = AV.Object.extend(`${PREFIX}Topic`)
export const Channel = AV.Object.extend(`${PREFIX}Channel`)
export const NewsComment = AV.Object.extend(`${PREFIX}NewsComment`)
export const TopicComment = AV.Object.extend(`${PREFIX}TopicComment`)
export const StatusCounter = AV.Object.extend(`${PREFIX}StatusCounter`)