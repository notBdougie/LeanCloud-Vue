let currentUser = null
let vm = null

const UserProvider = {
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
    return vm.$http.get('me')
      .then(function (re) {
        re.data = re.data ? re.data : null
        UserProvider.setCurrentUser(re.data)
      })
      .catch(function (err) {
        console.error('Failed to login: ', err)
      })
  },
  logout: function () {
    return vm.$http.post('logout')
      .then(function () {
        UserProvider.setCurrentUser(null)
        vm.$router.redirect('/')
      })
      .catch(function (err) {
        console.error('Failed to logout: ', err)
      })
  }
}

export default UserProvider