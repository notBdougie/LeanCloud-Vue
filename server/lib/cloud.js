var AV = require('leanengine');

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function(req, res) {
  res.success('Hello world!!');
});

module.exports = AV.Cloud;