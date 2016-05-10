<template>

  <div class="ui container register-page">
    <h1 class="ui header"><i class="add user icon"></i> 用户注册</h1>
    <form class="ui form" action="register" method="post" v-auto-form>
        <div class="ui internally celled column grid">
        <div class="row">
            <div class="column">
                <div class="field">
                <label>电子邮箱</label>
                <input type="email" name="email" placeholder="登录唯一标识符">
                </div>
                <div class="field">
                <label>昵称</label>
                <input type="text" name="name" placeholder="别人怎么称呼你">
                </div>
                <div class="field">
                <label>密码</label>
                <input type="password" name="password" placeholder="">
                </div>
                <div class="field">
                <label>重复密码</label>
                <input type="password" name="password_confirmation" placeholder="">
                </div>
                <button class="ui primary button" type="submit">注册</button>
            </div>
        </div>
        </div>
    </form>
  </div>

</template>

<script>
  import '../extensions/AutoForm'
  import UserProvider from '../extensions/UserProvider'
  export default {
    data () {
      return {}
    },
    events: {
      onFormComplete: function (form, response) {
        UserProvider.setCurrentUser(response.data)
      }
    },
    methods: {},
    components: {}
  }
</script>
