require('babel-core/register')

const AV = require('leanengine')
const config = require('./lib/config')
const app = require('./lib/app')

AV.initialize(config.leancloud.APP_ID, config.leancloud.APP_KEY, config.leancloud.MASTER_KEY)
AV.Cloud.useMasterKey()

const PORT = parseInt(config.port)
app.listen(PORT, function () {
  console.log('\n----------------------------')
  console.log('Node app is running, \n\tENV: %s, \n\tPORT: %d', config.env, PORT)
  console.log('----------------------------\n')
})