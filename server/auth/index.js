const Role = require('../common/role')

exports.member = function member (req, res, next) {
  
  if (!req.AV.user)
    return next({
      status: 401,
      message: 'Unauthorized'
    })

  next()
}

exports.admin = roleInspectorFactory('Admin')

function roleInspectorFactory (roleName) {
  return function roleInspector (req, res, next) {
    let user = req.AV.user
    
    Logger.debug(`Querying role "${roleName}" with userid "${user.getObjectId()}"`)
    Role.isUserBelongTo(user, roleName)
      .then(function () {
        next()
      })
      .catch(function () {
        next({
          status: 401,
          message: `Unauthorized ${roleName}`
        })
      })
  } 
}