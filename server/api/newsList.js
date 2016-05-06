const AV = require('leanengine')
const _ = require('lodash')

const push = require('../common/push')
const UseCase = require('../models').UseCase

exports.find = function(req, res, next) {

  const pageLimit = req.query.pageLimit || 10
  const pageIndex = req.query.pageIndex || 0

  const query = new AV.Query(UseCase)
  query.descending('createdAt')
  query.skip(pageIndex * pageLimit)
  query.limit(pageLimit)
  query.include('categories')
  query.include('screenshots')

  query.find()
    .then(function(results) {
      // 主动序列化 json 列
      // 见：https://leancloud.cn/docs/leanengine_faq.html#为什么查询_include_没有生效_
      results.forEach(function (result) {
        populateObject(result, 'categories')
      })
      res.json(results)
    })
    .catch(next)
}

exports.count = function(req, res, next) {
  const query = new AV.Query(UseCase)

  query.count()
    .then(function(number) {
      res.send({
        count: number
      })
    })
    .catch(next)
}

exports.get = function(req, res, next) {
  const _id = req.params._id

  getUseCase(_id, true)
    .then(function(result) {
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
exports.search = function(req, res, next) {
  const query = new AV.SearchQuery('UseCase')
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

  query.find().then(function(results) {
    res.json({
      data: results,
      total: query.hits(),
      hasMore: query.hasMore(),
      sid: query._sid
    })
    //处理 results 结果
  }).catch(next)
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
  getUseCase(_id)
    // 保存
    .then(function(result) {
      return result.save({
        title: title,
        desc: desc,
        status: status,
        featured: status === 'passed'
      })
    })
    // 再查询，同时推送通知
    .then(function(result) {
      
      if (status === 'passed') {
        const user = result.get('atUser')
        push.msgByUser({
          user: user,
          message: '恭喜，您提交的H5案例「' + result.get("title") + '」已被设为精选！'
        })
      }

      return getUseCase(_id, true)
    })
    // 返回
    .then(function(result) {
      populateUseCase(result)
      res.json(result)
    })
    .catch(next)
}


// 新增 Todo 项目
// router.post('/', function(req, res, next) {
//   const content = req.body.content
//   const todo = new Todo()
//   todo.set('content', content)
//   todo.save(null, {
//     success: function(todo) {
//       res.redirect('/todos')
//     },
//     error: function(err) {
//       next(err)
//     }
//   })
// })

function getUseCase (_id, isPopulateAll) {  // jshint ignore:line
  const query = new AV.Query(UseCase)
  if (isPopulateAll) {
    query.include('screenshots')
    query.include('categories')
    query.include('likes')
  }

  return new AV.Promise(function(resolve, reject) {
    query.get(_id, {
      success: function(result) {
        if (isPopulateAll)
          populateUseCase(result)

        resolve(result)
      },
      error: reject
    })
  });
}

function populateUseCase (result) {  // jshint ignore:line
  populateObject(result, 'categories')
  populateObject(result, 'likes')
  return result
}

function populateObject (result, key) {  // jshint ignore:line
  const arr = _.map(result.get(key), function(val) {
    return val.toJSON ? val.toJSON() : val
  })
  result.set(key, arr)
}


