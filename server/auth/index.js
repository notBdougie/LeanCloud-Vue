const AV = require('leanengine')
const {roleCache} = require('../lib/cache')

exports.member = function member (req, res, next) {
  if (!req.AV.user) {
    return next({
      status: 401,
      message: 'Unauthorized'
    })
  }

  next()
}

exports.admin = roleInspectorFactory('Admin')

function roleInspectorFactory (roleName) {
  return function roleInspector (req, res, next) {
    let user = req.AV.user
    let _userId = user.getObjectId()
    
    // Search from cache first
    let cachedRelation = isUserBelongTo(_userId, roleName)
    Logger.debug(`Querying role "${roleName}" with userid "${_userId}", result: ${cachedRelation}`)
    if (cachedRelation === true)
      return next()
    else if (cachedRelation === false)
      return next({
        status: 401,
        message: `Unauthorized ${roleName}`
      })

    // Search from internet if cache miss
    let query = new AV.Query(AV.Role)
    
    query.equalTo('users', user)  
    query.equalTo('name', roleName)
  
    query.count()
      .then(count => {
        if (count) {
          setUserRoles(_userId, roleName)
          return next()
        } else {
          setUserRoles(_userId)
          return next({
            status: 401,
            message: `Unauthorized ${roleName}`
          })
        }
      })
      .catch(next)
  } 
}

function setUserRoles (_userId, roleName) {
    let roleNames = getUserRoles(_userId)
    if (!roleNames)
      roleNames = []
    if (roleName)
      roleNames.push(roleName)
    roleCache.set(_userId, roleNames)
}

function getUserRoles (_userId) {
    return roleCache.get(_userId)
}

/**
 * @Returns:
 *  - true: User belongs to some role
 *  - false: User doesn't belong to some role
 *  - undefined: Relation is not cached yet
 */
function isUserBelongTo (_userId, roleName) {
    let roleNames = getUserRoles(_userId)
    if (Array.isArray(roleNames))
      return roleNames.indexOf(roleName) > -1
    else
      return undefined
}