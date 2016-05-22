const _ = require('lodash')

exports.DataSanitizer = function(req, res, next) {
  
  if (!req.body || ['POST','DELETE','PUT'].indexOf(req.method) === -1) 
    return next()

  if (_.isArray(req.body)) {
    req.body = req.body.map(omitValuesByKeys)
  } else {
    req.body = omitValuesByKeys(req.body)
  }
  return next()
}

function omitValuesByKeys (object) {
  if (!_.isPlainObject(object)) return object
    
  return _.omitBy(object, function (value, key) {
    return ['__v', '_id'].indexOf(key) === -1 && _.startsWith(key, '_')
  })
}