<script>
  import Vue from 'vue'

  Vue.directive('auto-form', {
    params: ['action', 'v-response-type', 'model'],
    bind: function () {
      var params = this.params
      var form = this.el
      var vm = this.vm

      // Prepare error boxes
      prepareErrorBoxes(form)
      // Prepare $watch
      form.unwatchFuncs = prepareWatch(vm, form)
      form.classList.add('auto-form')

      vm.$onAutoFormSubmit = function (event) {
        removeFormErrors(form)
        form.classList.add('loading')
        // fires before we do anything
        vm.$dispatch('beforeFormSubmit', form)

        // Use model data if passed 
        var data = params.model || new window.FormData(event.target)
        
        // Send update in RESTful
        var _id = data._id || (data.get && data.get('_id'))
        var method = vm.method || (_id ? 'put' : 'post')
        var action = _id ? params.action + '/' + _id : params.action   

        // Send request
        vm.$http({
            url: action,
            method: method,
            data: data,
            upload: {
                onprogress: (evt) => {
                    if (evt.lengthComputable) {
                        // create a new lazy property for percent
                        evt.percent = (evt.loaded / evt.total) * 100
                        vm.$dispatch('onFormProgress', form, evt)
                    }
                }
            }
        })
        .then(function (response) {
            afterSubmit(form, vm)
            vm.$dispatch('onFormComplete', form, response)
        }, function (response) {
            afterSubmit(form, vm)
            serverFormErrors(form, response)
            vm.$dispatch('onFormError', form, response)
            vm.$broadcast('onFormErrorGlobal', form, response)
        })

        event.preventDefault()
        event.stopPropagation()
      }
      form.addEventListener('submit', vm.$onAutoFormSubmit)
    },
    unbind: function () {
      var form = this.el
      var vm = this.vm
      form.removeEventListener('submit', vm.$onAutoFormSubmit)
      var unwatchFuncs = form.unwatchFuncs
      for (var i = 0; i < unwatchFuncs.length; i++) {
        var func = unwatchFuncs[i]
        func()
      }
    }
  })
  function afterSubmit (form, vm) {
    form.classList.remove('loading')
    // we have setup all the stuff we needed to
    vm.$dispatch('afterFormSubmit', form)
  }
  function emptyDom (dom) {
    while (dom.childNodes.length) {
      var childNode = dom.childNodes[0]
      dom.removeChild(childNode)
    }
  }
  function prepareWatch (vm, form) {
    var unwatchFuncs = []
    var fields = form.querySelectorAll('[v-model]')
    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      (function (field) {
        var modelName = field.attributes.getNamedItem('v-model').value
        unwatchFuncs.push(vm.$watch(modelName, function (newValue, oldValue) {
          removeFormError(form, field.name)
        }))
      })(field)
    }
    return unwatchFuncs
  }
  function prepareErrorBoxes (form) {
    var bigErrorNode = document.createElement('div')
    bigErrorNode.className = 'ui error message error-box'
    form.insertBefore(bigErrorNode, form.firstChild)
    var fieldDoms = form.getElementsByClassName('field')
    for (var i = 0; i < fieldDoms.length; i++) {
      var fieldDom = fieldDoms[i]
      var field = fieldDom.querySelector('[name]')
      if (field) {
        var fieldName = field.name
        var errorNode = document.createElement('div')
        errorNode.className = 'ui basic red pointing prompt label transition error-label field-error-' + fieldName
        fieldDom.appendChild(errorNode)
      }
    }
    // bigErrorNode.style.display = 'none'
  }
  function serverFormErrors (form, response) {
    var remainingErrors = {}
    if (response.status >= 400) {

      if (typeof response.data === 'string') {
        response.data = [response.data]
      }
      var errors = {unknown: []}

      if (response.data) {
        // work with AndrewKeig/express-validation
        if (response.data.errors) {
          for (var i = 0; i < response.data.errors.length; i++) {
            var errorObj = response.data.errors[i]
            if (errorObj.field) {
              errors[errorObj.field] = errorObj.messages
            } else {
              errors.unknown.push(errorObj)
            }
          }
        } else {
          // work with leancloud
          if (response.data.code) {
            errors.unknown.push(`Response: ${response.data.message}`)
            errors.unknown.push(`Error Code: ${response.data.code}`)
          }
          // other unknown responses
          else {
            errors.unknown.push(response.data.message || response.data)
          }
        }
      }
      for (var key in errors) {
        if (errors.hasOwnProperty(key)) {
          var fieldInput = form.querySelector('[name="' + key + '"]')
          var fieldDom = fieldInput ? fieldInput.parentNode : null
          if (!fieldDom) {
            remainingErrors[key] = errors[key]
            continue
          }
          appendFormError(fieldDom, errors[key])
        }
      }
      appendBundleErrors(form, remainingErrors)
    }
  }
  function appendFormError (fieldDom, errors) {
    fieldDom.classList.add('error')
    if (typeof errors === 'string') {
      errors = [errors]
    }
    var errorNode = fieldDom.querySelector('.error-label')
    for (var i = 0; i < errors.length; i++) {
      var textNode = document.createTextNode(errors[i])
      errorNode.appendChild(textNode)
      errorNode.appendChild(document.createElement('br'))
    }
    errorNode.classList.add('full-display')
    errorNode.classList.add('basic')
  }
  function appendBundleErrors (form, errors) {
    if (typeof errors === 'string') {
      errors = [errors]
    }
    if (errors) {
      form.classList.add('error')
      var errorBox = form.querySelector('.error-box')
      var hasErrors = false
      for (var key in errors) {
        if (errors.hasOwnProperty(key)) {
          var errorItems = errors[key]
          if (typeof errorItems === 'string') {
            errorItems = [errorItems]
          }
          for (var i = 0; i < errorItems.length; i++) {
            var pNode = document.createElement('p')
            pNode.appendChild(document.createTextNode(errorItems[i]))
            errorBox.appendChild(pNode)
            hasErrors = true
          }
        }
      }
      if (hasErrors) {
        errorBox.classList.add('full-display')
      }
    }
  }
  function removeFormError (form, field_name) {
    var field = form.querySelector('.field-error-' + field_name)
    if (!field) return
    
    emptyDom(field)
    field.classList.remove('full-display')
    field.parentNode.classList.remove('error')
  }
  function removeFormErrors (form) {
    form.classList.remove('error')
    var fieldDoms = form.querySelectorAll('.field.error')
    for (var i = 0; i < fieldDoms.length; i++) {
      var fieldDom = fieldDoms[i]
      fieldDom.classList.remove('error')
    }
    var errorLabels = form.querySelectorAll('.error-label')
    for (i = 0; i < errorLabels.length; i++) {
      var errorLabel = errorLabels[i]
      emptyDom(errorLabel)
      errorLabel.classList.remove('full-display')
    }
    var errorBox = form.querySelector('.error-box')
    emptyDom(errorBox)
    errorBox.classList.remove('full-display')
  }
</script>

<style lang="scss">
  .auto-form {
    // .error-box {
    //   display: block !important;
    // }
    .ui.label.error-label, .error-box {
      -webkit-transition: padding-top .3s, padding-bottom .3s, opacity .3s, height .3s;
      -moz-transition: padding-top .3s, padding-bottom .3s, opacity .3s, height .3s;
      -ms-transition: padding-top .3s, padding-bottom .3s, opacity .3s, height .3s;
      -o-transition: padding-top .3s, padding-bottom .3s, opacity .3s, height .3s;
      transition: padding-top .3s, padding-bottom .3s, opacity .3s, height .3s;
      line-height: 1.5em;
      opacity: 0;
      height: 0;
      padding: 0;
      margin-top: 0;
      overflow: hidden;
      &.full-display {
        opacity: 1;
        height: auto;
        margin-top: 12px;
        padding: 0.5833em 0.833em;
        overflow: visible;
      }
    }
  }
</style>