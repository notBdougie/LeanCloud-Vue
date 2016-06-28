const LRU = require("lru-cache")

const roleCache = LRU({ 
    max: 500,
    length: n => {return n.length},
    maxAge: 1000 * 60 * 60 // 1 Hour 
})

module.exports = {
    roleCache
}