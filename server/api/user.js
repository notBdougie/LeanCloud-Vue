const AV = require('leanengine')
const {getUserRoles} = require('../common/role')

exports.login = function(req, res, next) {
  const username = req.body.username
  const password = req.body.password
  let result

  AV.User.logIn(username, password)
    .then(function (user) {
      result = user.toJSON()
      return getUserRoles(user)
    })
    .then(function (roleNames) {
      result._roles = roleNames
      res.json(result)
    })
    .catch(next)
}

exports.logout = function(req, res) {
  AV.User.logOut()
  res.end()
}

/**
 * Return current user data.
 * But these fields are also included:
 *  _roles
 *  _sessionToken
 */
exports.me = function(req, res, next) {
  let sessionToken = req.AV.user._sessionToken
  let user = req.AV.user

  let result = user.toJSON()
  result._sessionToken = sessionToken

  getUserRoles(user)
    .then(function (roleNames) {
      result._roles = roleNames
      res.json(result)
    })
    .catch(next)
}

module.exports = exports