const AV = require('leanengine')
const {RoleCache} = require('../lib/cache')

/**
 * Find all roles the user belongs to
 */
function getUserRoles (user) {
    // Search from cache first
    let userObjectId = user.getObjectId()
    let roleNames = RoleCache.get(userObjectId)

    console.log('cache found: ' + !!roleNames)
    console.log(roleNames)
    if (roleNames)
        return AV.Promise.as(roleNames)

    // Search from internet if cache miss
    let query = new AV.Query(AV.Role)
    query.equalTo('users', user)

    return query.find()
        .then(roles => {
            let roleNames = getRoleNames(roles)
            RoleCache.set(userObjectId, roleNames)
            return AV.Promise.as(roleNames)
        })
}

function getRoleNames (roles) {
  let roleNames = [] 
  if (roles)
    roles.forEach(role => {
      roleNames.push(role.get('name'))
      roleNames = roleNames.concat(getRoleNames(role.roles))
    })
  return roleNames
}

function isUserBelongTo (user, roleName) {
    return getUserRoles(user)
        .then(roleNames => {
            return AV.Promise.as(roleNames.indexOf(roleName) > -1)
        })
}

module.exports = {
    getUserRoles,
    isUserBelongTo
}