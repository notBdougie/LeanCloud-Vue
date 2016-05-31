import Vue from 'vue'

Vue.filter('ellipsis', function (value, length=10, ellipsis='...') {
  if (value.length <= length)
    return value
  return value.substr(0, length) + ellipsis
})