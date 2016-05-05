exports.member = function(req, res, next) {
    
  if (!req.AV.user) {
    return next({
      status: 401,
      message: 'Unauthorized'
    })
  }

  next()
}