<template>
    <!--
        Usage:
        
        <Message :messages="messages" :message-id="channel._id"></Message>
        
        <Message :message="{_id: 1, text: 'nihao'}"></Message>
    -->
    <div>
        <div class="ui message" v-if="obj"
            :class="{red: obj.isError}">
            <i class="close icon" @click="dismiss(obj)"></i>
            <p>{{obj.text}}</p>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        messages: Array,
        messageId: String,
        message: Object
    },
    
    compiled: function () {
        let vm = this
        let DefaultOptions = {
        }
        let options = Object.assign({}, DefaultOptions)
        
        $(vm.$el).modal(options)
    },
    
    computed: {
        obj: function () {
            let target
            if (this.messageId && this.messages && this.messages.length) {
                for (let i = 0; i < this.messages.length; i++) {
                    let message = this.messages[i]
                    if (message._id === this.messageId) {
                        target = message
                        break
                    }
                }
            } else {
                target = this.message
            }
            
            return target
        }
    },

    behaviors: [
    ],
    
    methods: {
        dismiss: function (obj) {
            if (obj._id && this.messages && this.messages.length) {
                // remove all messages with same id
                for (let i = this.messages.length - 1; i >= 0; i--) {
                    let message = this.messages[i]
                    if (message._id === obj._id) {
                        this.messages.splice(i, 1)
                    }
                }
            } else {
                this.message = undefined
            }
        }
    },

    replace: true
}
</script>

<style lang="scss" scoped>

</style>