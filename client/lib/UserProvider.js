let currentUser = null
let vm = null

const UserProvider = {
  _loadingPromise: null,
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
    if (!this._loadingPromise) {
      this._loadingPromise = 
        vm.$http.get('me')
          .then(function (re) {
            re.data = re.data ? re.data : null
            UserProvider.setCurrentUser(re.data)
          })
          .catch(function (err) {
            console.error('Failed to login: ', err)
          })
    }
    return this._loadingPromise
  },
  logout: function () {
    UserProvider.setCurrentUser(null)
    return vm.$http.post('logout')
      .then(function () {
        vm.$router.go('/')
      })
      .catch(function (err) {
        console.error('Failed to logout: ', err)
      })
  }
}

export default UserProvider