<template>
  <a-tabs default-active-key="1" size="small" style="background: #ffffff;">
    <a-tab-pane key="1" tab="基本信息">
      <!--:va="va" va='1'表示隐藏掉子组件中的返回按钮   项目视图中查看子账户信息专用-->
      <sub-acc-info :opt-type="optType" :acc-no="accNo" :prj-code="prjCode" :va="va"></sub-acc-info>
    </a-tab-pane>
    <a-tab-pane key="2" tab="投资限制" v-if="optType !== 'ADD'">
      <sub-acc-inv-lmt :opt-type="optType" :acc-no="accNo" :prj-code="prjCode" :va="va"></sub-acc-inv-lmt>
    </a-tab-pane>
    <a-tab-pane key="3" tab="关联受益人" v-if="optType !== 'ADD'" forceRender="true">
      <sub-acc-bnf-rel :opt-type="optType" :acc-no="accNo" :prj-code="prjCode" :va="va"></sub-acc-bnf-rel>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
  import SubAccInfo from './modules/SubAccInfo'
  import SubAccInvLmt from './modules/SubAccInvLmt'
  import SubAccBnfRel from './modules/SubAccBnfRel'
  export default {
    name: 'SubAccount',
    components: {
      SubAccBnfRel,
      SubAccInvLmt,
      SubAccInfo
    },
    data() {
      return {
          optType:'',
          accNo:'',
          prjCode:'',
          va:'1'

      }
    },
    created() {
      let that =this;
      if (that.$route.query.optType){
        that.optType=that.$route.query.optType;
        that.prjCode=that.$route.query.prjCode;
        that.accNo=that.$route.query.accNo;
      }
    },
    mounted() {

    },
    methods: {
    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less'
  .ant-anchor-ink{
    display: none!important;
  }
</style>