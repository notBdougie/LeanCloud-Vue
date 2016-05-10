<script>
  import Vue from 'vue'
  
  var currentUser = null
  var vm = null
  var UserProvider = {
    installApp: function (AppVm) {
      vm = AppVm
    },
    setCurrentUser: function (user) {
      currentUser = user
      vm.$dispatch('onCurrentUserChanged', currentUser)
      vm.$broadcast('onCurrentUserChanged', currentUser)
    },
    getCurrentUser: function () {
      return currentUser
    },
    loadFromServer: function () {
      Vue.http.get('me').then(function (re) {
        re.data = re.data ? re.data : null
        UserProvider.setCurrentUser(re.data)
      }, function (err) {
        console.error(err)
      })
    },
    logout: function () {
      Vue.http.get('logout').then(function (re) {
        UserProvider.setCurrentUser(null)
      }, function (err) {
        console.error(err)
      })
    }
  }
  export default UserProvider
</script>