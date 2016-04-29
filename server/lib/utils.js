const _ = require('lodash')

export function populateObject (object, key) {
    if (_.isArray(key)) {
        let keys = key
        _.each(keys, (key) => {
            _populateObject(object, key)
        })
    } else {
        _populateObject(object, key)
    }
}

export function populateObjects (objects, key) {
    objects.forEach(function (object) {
        populateObject(object, key)
    })
}

function _populateObject (object, key) {
    let arr = _.map(object.get(key), function(val) {
        return val.toJSON ? val.toJSON() : val
    })
    object.set(key, arr)
}