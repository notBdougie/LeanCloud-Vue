import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const router = new VueRouter({
  history: true,
  saveScrollPosition: true
})

// Router Map
router.map({
    '/': {
        component: require('../components/Home')
    },
    '/newsList': {
        component: require('../components/NewsList')
    },
    '*': {
        component: require('../components/NotFound')
    }
})

export default router
