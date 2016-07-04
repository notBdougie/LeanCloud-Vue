import Vue from 'vue'
import VueRouter from 'vue-router'
import UserProvider from '../lib/UserProvider'

let root = process.env.serverConfig.portalPrefix

Vue.use(VueRouter)
const router = new VueRouter({
  history: true,
  saveScrollPosition: true,
  root: root
})

// Router Map
router.map({
    '/': {
        component: require('../components/Home')
    },
    '/newsList': {
        component: require('../components/NewsList')
    },
    '/login': {
        component: require('../components/Login')
    },
    '/register': {
        component: require('../components/Register')
    },
    '*': {
        component: require('../components/NotFound')
    }
})

// Redirect to login page if route is not public and user not logged in
router.beforeEach(function ({to, next}) {
    if (to.public)
        return next()
    
    let user = UserProvider.getCurrentUser()
    if (user) {
        // user is logged in
        return next()
    } else {
        // try to load from server
        return new Promise(resolve => {
            UserProvider.loadFromServer()
                .then(() => {
                    resolve(!!UserProvider.getCurrentUser())
                })
                .catch(() => {
                    resolve(false)
                })
        })
    }
})

// Broadcast an event on route changed 
router.afterEach(function ({to}) {
    let vm = to.router.app
    vm.$dispatch('onRouteChanged', to)
    vm.$broadcast('onRouteChanged', to)
})

export default router
