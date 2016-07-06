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
        component: require('../components/Home'),
        public: true
    },
    '/newsList': {
        component: require('../components/NewsList')
    },
    '/login': {
        name: 'login',
        component: require('../components/Login'),
        public: true
    },
    '/register': {
        component: require('../components/Register'),
        public: true
    },
    '*': {
        component: require('../components/NotFound'),
        public: true
    }
})

router.beforeEach(function ({from, to, next}) {

    if (to.public)
        return next()

    // Redirect to login page if route is not public and user not logged in
    let returnUrl
    if (from.name === 'login')
        returnUrl = from.query.returnUrl || to.path
    else if (to.name === 'login')
        returnUrl = to.query.returnUrl
    else
        returnUrl = to.path
    
    console.log("returnUrl: ", returnUrl)

    if (UserProvider.getCurrentUser()) {
        // user is logged in
        return next()
    } else {
        // try to load from server
        return new Promise(resolve => {
            UserProvider.loadFromServer()
                .then(() => {
                    resolve(!!UserProvider.getCurrentUser())

                    if (!UserProvider.getCurrentUser()) {
                        Vue.nextTick(() => {
                            router.go({name: 'login', query: {returnUrl}})
                        })
                    }
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
