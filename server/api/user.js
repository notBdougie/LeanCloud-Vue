const AV = require('leanengine')

exports.login = function(req, res, next) {
  const username = req.body.username
  const password = req.body.password

  AV.User.logIn(username, password, {
    success: function(user) {
      res.json(user)
    },
    error: function(user, err) {
      next(err)
    }
  })
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

  // Convert AVUser to plain JSON object
  let result = user.toJSON()
  result._sessionToken = sessionToken

  // Query the user's roles
  let query = new AV.Query(AV.Role)
  query.equalTo('users', user)

  query.find()
    .then(roles => {
      if (!roles) {
        result._roles = []
      } else {
        result._roles = roles.map(role => {
          return role.get('name')
        })
      }

      res.json(result)
    })
    .catch(next)
}

module.exports = exports