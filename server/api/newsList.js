const AV = require('leanengine')
const _ = require('lodash')

const News = require('../models').News
const Util = require('../lib/utils')

export function newsView (req, res, next) {
    let query = new AV.Query(News)
    query.descending('createdAt')
    query.include('channels')
    query.include('likedUsers')
    
    query.find()
    .then((results) => {
        Util.populateObjects(results, ['channels', 'likedUsers'])
        res.json(results)
    })
    .catch(next)
}
