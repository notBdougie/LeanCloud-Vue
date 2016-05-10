<template lang="jade">
  #app
    navbar
    router-view(style="padding-top: 30px;")
</template>

<script>
  import Navbar from './components/NavBar';
  import CurrentUserProvider from './extensions/UserProvider'

  export default {
    components: {
      Navbar
    },
    ready: function () {
      CurrentUserProvider.installApp(this)
      CurrentUserProvider.loadFromServer()
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "./semantic/dist/semantic.css";
  @import "../node_modules/nprogress/nprogress.css";
  
  html {
    height: 100%;
  }

  body {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  #app {
    margin: 20px auto 0;
    max-width: 1000px;
    padding: 0 20px;
    font-family: -apple-system, "Helvetica Neue", "Arial", "PingFang SC", "Hiragino Sans GB", "STHeiti", "Microsoft YaHei", "Microsoft JhengHei", "Source Han Sans SC", "Noto Sans CJK SC", "Source Han Sans CN", "Noto Sans SC", "Source Han Sans TC", "Noto Sans CJK TC", "WenQuanYi Micro Hei", SimSun, sans-serif;
  }
</style>