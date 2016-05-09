import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import RouterConfig from './router';

Vue.use(VueRouter)
Vue.use(require('vue-resource'))

const router = new VueRouter({
  history: true,
  saveScrollPosition: true
})

RouterConfig(router)

router.start(App, 'app')