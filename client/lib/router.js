import Vue from 'vue'
import VueRouter from 'vue-router'

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

export default router
