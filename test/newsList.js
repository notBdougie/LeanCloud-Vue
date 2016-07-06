const test = require('ava')
const helpers = require('./_helpers')

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