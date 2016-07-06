const request = require('request-promise')
export const AV = require('leancloud-storage')
const config = require('../server/lib/config')

AV.initialize(config.leancloud.APP_ID, config.leancloud.APP_KEY)

const LC_Request = request.defaults({
    baseUrl: 'https://api.leancloud.cn/1.1',
    headers: {
        'X-LC-Id': config.leancloud.APP_ID,
        'X-LC-Key': config.leancloud.APP_KEY
    }
})

export let userCache = {
    // key: username
    // value: userData
}

export function localRequest (username) {
    let userData = userCache[username] || {}
    
    return request.defaults({
        baseUrl: 'http://localhost:' + config.port,
        headers: {
            'X-LC-Id': config.leancloud.APP_ID,
            'X-LC-Key': config.leancloud.APP_KEY,
            'X-LC-Session': userData.sessionToken
        },
        resolveWithFullResponse: true,
        jar: userData.jar,
        json: true
    })
}

export function login (username, password) {
    password = password || username

    return LC_Request({
            uri: '/login',
            qs: {
                username: username,
                password: password
            },
            json: true
        })
        .then((body) => {
            const user = body
            userCache[user.username] = {
                sessionToken: user.sessionToken,
                jar: request.jar()
            }
        })
}

export function loginAll (users) {
    const promises = users.map((user) => {
        return login(user.username, user.password)
    })
    return Promise.all(promises)
}