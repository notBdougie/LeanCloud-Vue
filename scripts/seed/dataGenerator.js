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

/**
roles:
  - name: Editor
  - name: Admin
    users:
      - chuyik
    roles:
      - Editor
 */
export function setRoles () {
  let roles = data.roles
  return AV.Promise.all(roles.map(function (_role) {
    
    let query = new AV.Query(AV.Role)
    query.equalTo('name', _role.name)
    return query.first()
      .then((result) => {
        // find and save role
        if (!result) {
          // let roleACL = new AV.ACL()
          // roleACL.setPublicReadAccess(true)
          let role = new AV.Role(_role.name)
          return role.save()
        } else {
          console.log('found role: ', result.get('name'))
          return nextThen(result)
        }
      })
      .then((role) => {
        let users = _role.users
        if (!users) {
          return nextThen(role)
        }
        // find users
        let userQuery = new AV.Query(AV.User)
        userQuery.containedIn('username', users)
        
        return userQuery.find(users).then((users) => {
          role.getUsers().add(users)
          return role.save()
        })
      })
  }))
  .then((results) => {
    // add roles relations
    console.log('roles: ', results.length)
    let promises = []
    roles.forEach((roleData) => {
      if (roleData.roles) {
        // find corresponding role object
        let roleObject = _.find(results, function (result) {
          return result.get('name') === roleData.name 
        })
        if (roleObject) {
          // find role objects to set
          let roleObjects = _.filter(results, (result) => {
            return _.includes(roleData.roles, result.get('name'))
          })
          console.log(`${roleObject.get('name')} has ${roleObjects.length} sub roles`)
          roleObject.getRoles().add(roleObjects)
          promises.push(roleObject.save())
        }
      }
    })
    return AV.Promise.all(promises)
  })
  .catch((err) => {
    console.error(err)
  })
}

export function addUsers () {
  let users = data.user
    
  return AV.Promise.all(users.map(function (_user) {
    let user = _user
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
    let promises = []
    for (let relation of followRelations) {
      let followee = _.find(users, function (user) {
        return user.get('username') === relation.username
      })
      if (!followee) {
        console.error(`cannot find followee: ${relation.username}`)
        continue
      }
      let followers = _.filter(users, (user) => {
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
    let Channel = AV.Object.extend('AURChannel')
    let channel = new Channel()
    return channel.save(_channel)
  }))
}

export function addNews () {
  let newsList = data.news
  let News = AV.Object.extend('AURNews')
  let users, channels
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
  let TestObject = AV.Object.extend('TestObject')
  let testObject = new TestObject()
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
  let user = new AV.User()
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
    let query = new AV.Query(AV.User)
    query.equalTo('username', username)
    return query.first()
}

function sleep (time) {
    let promise = new AV.Promise()
        setTimeout(function() {
            promise.resolve()
        }, time)
    return promise
}

function nextThen (value) {
    let promise = new AV.Promise()
    promise.resolve(value)
    return promise
}