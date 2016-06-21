// require('babel-core/register')

// use logger globally
global.Logger = require('./lib/logger')

/* eslint-disable */
if (!process.env.NODE_ENV)
  throw "NODE_ENV is required."
/* eslint-enable */

const config = require('./lib/config')
const app = require('./lib/app')
const PORT = parseInt(config.port, 0)

// initialize leanengine
const AV = require('leanengine')
AV.initialize(config.leancloud.APP_ID, config.leancloud.APP_KEY, config.leancloud.MASTER_KEY)
AV.Cloud.useMasterKey()

app.listen(PORT, function () {
  console.log('\n----------------------------')
  console.log('Node app is running, \n\tENV: %s, \n\tPORT: %d, \n\tPORTAL PREFIX: %s', config.env, PORT, config.portalPrefix)
  console.log('----------------------------\n')
})