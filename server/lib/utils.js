const _ = require('lodash')


/**
 * 解决 LeanCloud 查询 include 没有生效的问题
 * 
 * @export
 * @param object LeanCloud 对象
 * @param key include 的字段
 */
function populateObject (object, key) {
    if (_.isArray(key)) {
        let keys = key
        _.each(keys, (key) => {
            _populateObject(object, key)
        })
    } else {
        _populateObject(object, key)
    }
}

function populateObjects (objects, key) {
    objects.forEach(function (object) {
        populateObject(object, key)
    })
}

function _populateObject (object, key) {
    let pointer = object.get(key)
    let data
    if (_.isArray(pointer)) {
        let pointers = pointer
        data = _.map(pointers, function(pointer) {
            return pointer.toJSON ? pointer.toJSON() : pointer
        })    
    } else {
        data = pointer.toJSON ? pointer.toJSON() : pointer
    }
    object.set(key, data)
}

exports.populateObject = populateObject
exports.populateObjects = populateObjects