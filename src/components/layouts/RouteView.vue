<template>
  <div class="main">
  <!-- <keep-alive>
    <router-view v-if="keepAlive" />
  </keep-alive>
  <router-view v-if="!keepAlive" /> -->
   <router-view />
   <!-- <keep-alive>
      <router-view  :key="key"/>
    </keep-alive>  -->
  </div>
</template>

<script>
  export default {
    name: "RouteView",
    computed: {
      keepAlive () {
        return this.$route.meta.keepAlive
      },
      key() {
      // 加了时间戳必刷新
        // return (this.$route.path + new Date())
        return (this.$route.fullPath)
      }
    },
  }
</script>