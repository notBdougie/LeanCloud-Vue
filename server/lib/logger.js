const bunyan = require('bunyan')
const config = require('./config')

const Logger = bunyan.createLogger({
    level: config.logLevel,
    name: require('../../package.json').name,
    serializers: bunyan.stdSerializers
})

module.exports = Logger
