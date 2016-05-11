<template>

  <div class="ui container register-page">
    <h1 class="ui header"><i class="add user icon"></i> 用户登录</h1>
    <form class="ui form" action="login" method="post" v-auto-form>
        <div class="ui internally celled two column grid">
            <div class="row">
                <div class="column">
                    <div class="field">
                        <label>用户名</label>
                        <input type="text" name="username" placeholder="" value="nick">
                    </div>
                    <div class="field">
                        <label>密码</label>
                        <input type="password" name="password" placeholder="" value="nick">
                    </div>
                    <button class="ui primary button" type="submit">登录</button>
                    <!--<button class="ui link button" type="button" @click="forgotPassword(event)">忘记密码</button>-->
                </div>
            </div>
        </form>

    </div>
    
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
        this.$router.go('/')
      }
    },
    methods: {
      forgotPassword: function (event) {
        window.alert('TODO forgotPassowrd()')
      }
    },
    components: {}
  }
</script>