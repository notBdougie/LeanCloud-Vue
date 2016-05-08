<template lang="jade">
  div.navbar
    p navbar
    a(v-link="{ path: '/' }") Home
    a(v-link="{ path: '/newsList' }") Go to newsList
</template>

<script>
export default {
  data() {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'Hello World!',
    };
  },
};
</script>

<style lang="scss" scoped>
    .navbar {
        width: 100%;
        background-color: red;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
    }
</style>