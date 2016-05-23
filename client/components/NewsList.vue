<template>
  <div class="ui loading segment" v-if="$loadingRouteData">
      <p>Loading..</p>
  </div>
  <div v-if="!$loadingRouteData">
    <div class="ui compact menu" style="flex-wrap: wrap;">
      <a class="item" @click="toCreate()">
        添加
      </a>
    </div>
  </div>
  <Modal title="添加新闻" :on-approve="saveForm" v-ref:modal>
      <div class="content" slot="body">
        <div>Implemented yourself.</div>
      </div>
      <div slot="actions">
          <div class="ui negative button">取消</div>
          <div class="ui positive right labeled icon button">确定<i class="checkmark icon"></i></div>
      </div>
  </Modal>
  <div class="ui divided items">
      <div class="item" v-for="news in newsList">
        <div class="image">
          <img :src="news.image">
        </div>
        <div class="content">
          <a class="header" v-link="news.url" target="_blank">{{news.title}}</a>
          <div class="meta">
            <span class="origin">{{news.origin}}</span>
            <span class="date">{{news.createdAt}}</span>
          </div>
          <div class="description">
            <p>{{news.excerpt}}</p>
          </div>
          <div class="extra">
            <div class="ui right floated primary button" @click="publish(news)">
              发布
              <i class="right chevron icon"></i>
            </div>
            <div class="ui label" v-for="channel in news.channels">
              {{channel.name}}
            </div>
          </div>
          <Message :messages="messages" :message-id="news.objectId"></Message>
        </div>
      </div>
  </div>

</template>

<script>
import Modal from '../UI/Modal'
import Message from '../UI/Message'

export default {
  data() {
    // note: changing this line won't causes changes
    // with hot-reload because the reloaded component
    // preserves its current state and we are modifying
    // its initial state.
    return {newsList: [], messages: []}
  },
  components: {
    Modal,
    Message
  },
  route: {
    data: function () {
      return this.$http.get('newsList').then(resp => {
        return {newsList: resp.data}
      })
    }
  },
  methods: {
    toCreate: function () {
      this.$refs.modal.$show()
    },
    publish: function (news) {
      this.messages.push({_id: news.objectId, text: '这是发布成功的信息'})
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
