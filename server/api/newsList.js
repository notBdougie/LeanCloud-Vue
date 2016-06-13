const AV = require('leanengine')
const _ = require('lodash')

const push = require('../common/push')
const News = require('../models').News
const Util = require('../lib/utils')

const IncludedKeys = ['channels', 'likedUsers']

exports.find = (req, res, next) => {
  
  const query = new AV.Query(News)
  query.descending('createdAt')
  query.include(IncludedKeys)
  
  // 分页处理见 paging.js 
  query.skip(req.pagingSkip)
  query.limit(req.pagingLimit)

  query.find()
    .then(results => {
      // 主动序列化 json 列
      // 见 Util.populateObjects 注释
      Util.populateObjects(results, IncludedKeys)
      res.json(results)
    })
    .catch(next)
}

exports.count = (req, res, next) => {
  const query = new AV.Query(News)

  query.count()
    .then(number => {
      res.send({
        count: number
      })
    })
    .catch(next)
}

exports.get = (req, res, next) => {
  const _id = req.params._id

  getNews(_id, true)
    .then(result => {
      res.json(result)
    })
    .catch(next)
}

/**
 * Search params:
 *   queryString
 *   limit
 *   sid
 */
exports.search = (req, res, next) => {
  const query = new AV.SearchQuery('News')
  const queryString = req.query.queryString || '*'
  const sid = req.query.sid || ''
  const limit = req.query.limit || 10

  // Search Order
  const builder = new AV.SearchSortBuilder()
  builder.descending('createdAt')
  query.sortBy(builder)

  query.sid(sid)
  query.queryString(queryString)
  query.limit(limit)

  query.find()
    .then(function(results) {
      res.json({
        data: results,
        total: query.hits(),
        hasMore: query.hasMore(),
        sid: query._sid
      })
    })
    .catch(next)
}

exports.put = function (req, res, next) {
  const _id = req.params._id
  const title = req.body.title
  const desc = req.body.desc
  
  /**
   * 已提交：submitted
   * 已通过：passed
   * 已拒绝：rejected
   */
  const status = req.body.status || ''

  // 查询
  getNews(_id)
    // 保存
    .then(result => {
      return result.save({
        title: title,
        desc: desc,
        status: status,
        featured: status === 'passed'
      })
    })
    // 再查询，同时推送通知
    .then(result => {
      
      if (status === 'passed') {
        const user = result.get('atUser')
        push.msgByUser({
          user: user,
          message: '恭喜，您提交的新闻「' + result.get("title") + '」已被接收！'
        })
      }

      return getNews(_id, true)
    })
    // 返回
    .then(result => {
      Util.populateObject(result, IncludedKeys)
      res.json(result)
    })
    .catch(next)
}


exports.post = function(req, res, next) {
  const data = req.body
  const news = new News()
  news.save(data)
    .then(result => {
      res.json(result)
    })
    .catch(next)
}

function getNews (_id, isPopulateAll) {
  const query = new AV.Query(getNews)

  if (isPopulateAll)
    query.include(IncludedKeys)
  
  return new AV.Promise(function(resolve, reject) {
    query.get(_id, {
      success: result => {
        if (isPopulateAll)
          Util.populateObject(result, IncludedKeys)

        resolve(result)
      },
      error: reject
    })
  });
}

