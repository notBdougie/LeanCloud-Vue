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
            return pointer && pointer.toJSON ? pointer.toJSON() : pointer
        })    
    } else {
        data = pointer && pointer.toJSON ? pointer.toJSON() : pointer
    }
    object.set(key, data)
}

/**
 * Select fields by keys from parsed/raw result
 * 
 * @export
 * @param result {Object} Raw data or parsed LeanCloud object
 * @param key {String}
 * @param fields {[String]}
 */
function selectFields (result, key, fields) {
    fields = fields.concat(['__type', 'className'])
    let value = _getValue (result, key)
    if (_.isArray(value)) {
        _setValue(result, key, value.map(o => { return _.pick(o, fields) }))
    } else {
        _setValue(result, key, _.pick(value, fields))
    }
    return result
}

function _getValue (result, key) {
    return result.get ? result.get(key) : result[key]
}

function _setValue (result, key, value) {
    if (result.set) {
        result.set(key, value)
    } else {
        result[key] = value 
    }
}

module.exports = {
    populateObject,
    populateObjects,
    selectFields    
}