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

exports.me = function(req, res) {
  let sessionToken = req.AV.user._sessionToken
  let user = req.AV.user.toJSON()
  user._sessionToken = sessionToken
  res.json(user)
}

module.exports = exports