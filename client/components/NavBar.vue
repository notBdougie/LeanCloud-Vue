<template>
  <div class="ui secondary pointing menu">
    <!-- Main -->
    <a class="item" v-for="menu in menus" v-link="menu">
      {{menu.text}}
    </a>
    
    <!-- Aside -->
    <div class="right menu">
      <a class="item" v-if="isLogin">{{user.name}}</a>
      <a class="item" v-if="isLogin" @click="logout(event)">退出</a>
      <a class="item" v-if="!isLogin" v-link="{path: '/login', activeClass: 'active'}">登录</a>
      <a class="item" v-if="!isLogin" v-link="{path: '/register', activeClass: 'active'}">注册</a>
    </div>
  </div>
</template>

<script>
import UserProvider from '../extensions/UserProvider'
export default {
  props: {
    menuData: {
      type: Object,
      default: () => {return [
        {path: '/', text: '主页', exact: true},
        {path: '/newsList', text: '新闻列表'},
        {path: '/wronggg', text: '错误地址'}
      ]}
    }
  },
  data() {
    let user = UserProvider.getCurrentUser()
    
    this.menuData.forEach((menu) => {
      menu.activeClass = menu.activeClass || 'active'
    })
    
    return {
      menus: this.menuData,
      isLogin: user !== null
    }
  },
  events: {
    onCurrentUserChanged: function (user) {
      this.isLogin = user !== null
      this.user = user
    }
  },
  methods: {
    logout: function (event) {
      UserProvider.logout()
    }
  }
};
</script>

<style lang="scss" scoped>

</style>