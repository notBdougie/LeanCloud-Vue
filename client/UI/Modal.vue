<template>
    <div v-el="modal" class="ui long modal">
        <i class="close icon"></i>
        <div class="header">
            <slot name="header">{{title}}</slot>
        </div>
        <slot name="body"></slot>
        <div class="actions">
            <slot name="actions">
                <div class="ui negative button">Cancel</div>
                <div class="ui positive right labeled icon button">OK<i class="checkmark icon"></i></div>
            </slot>
        </div>
    </div>
</template>

<script>
import {bindBehaviorsMixin} from './helpers/mixins'

export default {
    props: {
        title: {
            default: 'unknown title'
        },
        onApprove: Function
    },
    
    mixins: [bindBehaviorsMixin],
    
    compiled: function () {
        let vm = this
        let DefaultOptions = {
            observeChanges: true,
            detachable: false,
            onVisible: function () {
                $(vm.$el).modal("refresh")
            }
        }
        let options = Object.assign({}, DefaultOptions)
        
        // Todo: read all properties of this reference with keys
        // and merge them with default options
        options.onApprove = vm.onApprove || options.onApprove
        options.onDeny = vm.onDeny || options.onDeny
        $(vm.$el).modal(options)
    },

    behaviors: [
		'show',
        'hide',
        'toggle',
        'refresh',
        'is active'
    ],
    
    methods: {
    },

    replace: true
}
</script>

<style lang="scss" scoped>

</style>