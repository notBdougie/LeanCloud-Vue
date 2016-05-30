const _ = require('lodash')

const MAX_PER_PAGE = 10
const DEFAULT_PAGE_NUM = 1

/**
 * Parse paging query /xxx?per_page=5&page=1
 * 
 *  per_page -> req.pagingLimit
 *  page -> req.pagingPage
 */
function preparePaging (req, res, next) {
    if (req.method !== 'GET') return next()
    
    const limit = _.max([parseInt(req.query.per_page), MAX_PER_PAGE])
    const page = parseInt(req.query.page) || DEFAULT_PAGE_NUM
    req.pagingLimit = limit
    req.pagingPage = page
    req.pagingSkip = (page - 1) * limit
    
    delete req.query.per_page
    delete req.query.page
    next()
}

module.exports = preparePaging