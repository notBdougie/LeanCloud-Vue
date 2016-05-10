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
  res.json(req.AV.user)
}

module.exports = exports