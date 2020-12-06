<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <!-- <img v-if="navTheme === 'dark'" src="~@/assets/logo-white.png" alt="logo"> -->
      <!-- <img v-else src="~@/assets/logo@2x.png" alt="logo"> -->
      <img :src='require(`@/assets/${logoImg}.png`)' alt="logo">
      <!-- <h1 v-if="showTitle">{{ title }}</h1> -->
    </router-link>
  </div>
</template>

<script>
  import { mixin } from '@/utils/mixin.js'

  export default {
    name: 'Logo',
    data(){
      return {
        logoImg: CUSTOMIZE_CONFIG.logoImg || 'bi-logo',
      }
    },
    mixins: [mixin],
    props: {
      title: {
        type: String,
        default: '家族信托',
        required: false
      },
      showTitle: {
        type: Boolean,
        default: true,
        required: false
      }
    },
    methods:{
    
    },
    created(){
     
    }
   
  }
</script>
<style lang="less" scoped>
  /*缩小首页布 局顶部的高度*/
  @height: 59px;

  .sider {
    box-shadow: none !important;
    .logo {
      padding-left: 0px !important;
      height: @height !important;
      line-height: @height !important;
      box-shadow: none !important;
      transition: background 300ms;

      a {
        color: white;
        &:hover {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }

    &.light .logo {
      background-color: @primary-color;
    }
  }
  img {
    height: 40px !important;
  }
</style>