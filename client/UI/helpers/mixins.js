export const bindBehaviorsMixin = {
    compiled: function bindBehaviorsMixin () {
        let vm = this;
        let behaviors = this.$options.behaviors || {};
        let moduleName = this.$options.name.toLowerCase();
        let $element = $(this.$el)

        // Register the behavior(method) as $behavior on the vm, with optional before/after hooks
        $.each(behaviors, function (index, behavior) {
            if($.isPlainObject(behavior)) {
                register(behavior);
            } else if(typeof behavior === 'string') {
                let methodName = camelize(behavior);
                vm['$' + methodName] = $element[moduleName].bind($element, behavior)
            }
        });

        function register(settings) {
            
            let behavior = settings.name;
            let after = $.isFunction(settings.after) ? settings.after.bind(vm) : $.noop;
            let method = $element[moduleName].bind($element, behavior);
            let before = $.isFunction(settings.before) ? settings.before.bind(vm) : function(done){ done() };

            vm['$' + behavior] = function() {
                let args = arguments;
                let done = function () {
                    method.apply($element, args);
                    after();
                };

                before(done);
            }
        }

    }
}

function camelize(behavior) {
    let result = '';
    behavior.split(' ').forEach(function (word, i) {
        i === 0
            ? result += word
            : result += word.charAt(0).toUpperCase() + word.substring(1);
    });
    return result;
}