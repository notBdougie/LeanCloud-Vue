const AV = require('leanengine')
const _ = require('lodash')

const News = require('../models').News
const Util = require('../lib/utils')

exports.newsView = function newsView (req, res, next) {
    let query = new AV.Query(News)
    query.descending('createdAt')
    query.include('channels', 'likedUsers')
    
    let user = req.AV.user
    new AV.Promise((resolve) => {
        if (user) {
            Logger.debug('user logged in: ', user.get('username'))
            
            let followeeQuery = user.followeeQuery()
            followeeQuery.find().then((users) => {
                resolve(users)
            })
        } else {
            AV.Promise.as().then(() => {
                resolve()
            })
        }
    })
    .then((followees) => {
        Logger.debug('followees: ', followees ? followees.length : '')
        
        // let followeeIds = _.map(followees, (followee) => {
        //     console.log(followee.id)
        //     return followee.id
        // })
        // console.log(followeeIds)
        // query.containsAll('likedUsers', followees)
        
        query.find()
            .then((results) => {
                // _.each(results, (result) => {
                //     console.log(result.get('likedUsers'))
                // })
                // _.map(followees, 'objectId')
                // Util.populateObjects(results, ['channels', 'likedUsers'])
                res.json(results)
            })
            .catch(next)
    })
}
