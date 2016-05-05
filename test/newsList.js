const test = require('ava')
const AV = require('avoscloud-sdk')
// const supertest = require('supertest')

const config = require('../server/lib/config')
const helpers = require('./_helpers')

AV.initialize(config.leancloud.APP_ID, config.leancloud.APP_KEY)

test.before(() => {
    return helpers.loginAll([
        {username: 'nickfans1'}
    ])
})


test('my passing test', t => {
    return helpers.localRequest('nickfans1')({
        uri: '/api/newsView'
    })
    .then((resp) => {
        let newsList = resp.body
        console.log(newsList.length)
        console.log(newsList[0].likedUsers)
    })
})