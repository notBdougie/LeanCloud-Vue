const yaml = require('js-yaml')
const fs   = require('fs')
const AV = require('avoscloud-sdk')
const _ = require('lodash')

const config = require('../../server/lib/config')

// initialize leanengine
AV.initialize(config.leancloud.APP_ID, config.leancloud.APP_KEY, config.leancloud.MASTER_KEY)
AV.Cloud.useMasterKey()

// load data
const data = yaml.safeLoad(fs.readFileSync(__dirname + '/data.yml', 'utf8'))


export function addUsers () {
  let users = data.user
    
  return AV.Promise.all(users.map(function (_user) {
    var user = _user
    user.password = user.password || user.username
    // set avatar
    const file = AV.File.withURL(`avatar_${user.username}.jpg`, user.avatar || getAvatarUrl(user.username))
    
    return file.save().then((avatar) => {
      user.avatar = avatar
      // save user
      return register(user)
    })
  }))
  .catch((err) => {
    console.error(err)
  })
}

export function followUsers () {
  let followRelations = data.follow 
  return new AV.Query(AV.User).find((users) => {
    var promises = []
    for (let relation of followRelations) {
      var followee = _.find(users, function (user) {
        return user.get('username') === relation.username
      })
      if (!followee) {
        console.error(`cannot find followee: ${relation.username}`)
        continue
      }
      var followers = _.filter(users, (user) => {
        return _.find(relation.followers, {'username': user.get('username')})
      })
      
      for (let follower of followers) {
        console.log(`${follower.get('username')} following ${followee.get('username')}`)
        promises.push(follower.follow(followee))
      }
    }
    return AV.Promise.all(promises)
      .catch((err) => {
        console.error(err)
      })
  })
}

export function addChannels () {
  let channels = data.channel
  return AV.Promise.all(channels.map(function (_channel) { 
    var Channel = AV.Object.extend('AURChannel')
    var channel = new Channel()
    return channel.save(_channel)
  }))
}

export function addNews () {
  let newsList = data.news
  let News = AV.Object.extend('AURNews')
  var users, channels
  return AV.Promise.all([new AV.Query(AV.User).find(), new AV.Query('AURChannel').find()])
    .then((values) => {
      users = values[0]
      channels = values[1]
      
      return AV.Promise.all(newsList.map((newsData) => {
        newsData.likedUsers = newsData.likedUsers.map((username) => {
          return _.find(users, (user) => {
            return user.get('username') === username
          })
        })
        
        newsData.channels = newsData.channels.map((key) => {
          return _.find(channels, (channel) => {
            return channel.get('key') === key
          })
        })
        
        newsData.likeCount = newsData.likedUsers.length
        
        let news = new News()
        return news.save(newsData)
      }))
    })
  
}

export function testConnection () {
  var TestObject = AV.Object.extend('TestObject')
  var testObject = new TestObject()
  testObject.save({
    testabc: 'abc123'
  }).then(function() {
    console.log('LeanCloud works!')
  }).catch(function(err) {
    console.log('error:' + err)
  })
}

////////////////////////////

function getAvatarUrl (key) {
  return `https://api.adorable.io/avatars/285/${key}%40adorable.io`
}

function register (userData) {
  var user = new AV.User()
  user.set(userData)
  return user.signUp()
}

function login (username) {
    return AV.User.logIn(username, username)
}

function follow (followee) {
    return AV.User.current().follow(followee)
}

function getUser (username) {
    var query = new AV.Query(AV.User)
    query.equalTo('username', username)
    return query.first()
}

function sleep (time) {
    var promise = new AV.Promise()
        setTimeout(function() {
            promise.resolve()
        }, time)
    return promise
}

function nextThen () {
    var promise = new AV.Promise()
    promise.resolve()
    return promise
}