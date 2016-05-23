const _ = require('lodash')

const ReservedKeys = [
  '__v', '_id' // MongooseReservedKeys
]
const Methods = ['POST','DELETE','PUT']

/**
 * Sanitize the data of req.body
 */
exports.DataSanitizer = function(req, res, next) {
  
  // skipped if request data is empty
  // or not specified request methods
  if (!req.body || Methods.indexOf(req.method) === -1) 
    return next()

  // only inspect outermost level
  let sanitizedData
  if (_.isArray(req.body)) {
    sanitizedData = req.body.map(function (object) {
      return omitNonPersistentData(object, ReservedKeys)
    })
  } else {
    sanitizedData = omitNonPersistentData(req.body, ReservedKeys)
  }
  req.body = sanitizedData
  return next()
}

/**
 * Omit object keys which start with underline,
 * but not including the keys passed in
 */
function omitNonPersistentData (object, ignoredKeys=[]) {
  if (!_.isPlainObject(object)) return object
    
  return _.omitBy(object, function (value, key) {
    return ignoredKeys.indexOf(key) === -1 && _.startsWith(key, '_')
  })
}

exports.omitNonPersistentData = omitNonPersistentData