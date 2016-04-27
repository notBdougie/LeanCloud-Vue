const AV = require('leanengine')
const config = require('../lib/config')

exports.msgByUser = function(object) {
  let message = object.message
  let user = object.user
  console.log('push notification: user: ', user.id, 'message: ', message)
  
  const prod = config.env === 'development' ? 'dev' : 'prod'
  
  AV.Push.send({
    cql: "select * from _Installation where atUser='" + user.id + "'",
    prod: prod,
    expiration_interval: "86400", // 1 day
    data: {
      "alert": message,
      "badge": "Increment",
      "sound": "alarm.wav"
    }
  })
}