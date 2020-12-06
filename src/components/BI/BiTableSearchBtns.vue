/** 
  表格的搜索，重置，是否显示高级
  searchQuery 查询按钮的回调
  searchReset 重置按钮的回调
  isAdvanced 是否需要高级
*/
<template>
  <span class="table-page-search-submitButtons">
    <a-button type="primary" @click="()=>{this.$emit('searchQuery')}">查询</a-button>
    <a-button class="btn-right"  @click="()=>{this.$emit('searchReset')}">重置</a-button>
    <a @click="toggleAdvanced" class="btn-right" v-if="isAdvanced">
      {{ advanced ? '收起' : '展开' }}
      <a-icon :type="advanced ? 'up' : 'down'"/>
    </a>
  </span>
</template>

<script>
  export default {
    name: "BiTableSearchBtns",
    props: {
      isAdvanced:{
        default: true
      }
    },
    data () {
      return {
        // 高级搜索 展开/关闭
        advanced: this.value || false,
      }
    },
    created () {
      
    },
    methods: {
      toggleAdvanced () {
        this.advanced = !this.advanced
        this.$emit('input', this.advanced)
      },
    },
    watch: {
      
    }
  }
</script>

<style lang="scss" scoped>
  .search {
    margin-bottom: 54px;
  }

  .fold {
    width: calc(100% - 216px);
    display: inline-block
  }

  .operator {
    margin-bottom: 18px;
  }
  .btn-right {
    margin-left: 8px;
  }

  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>