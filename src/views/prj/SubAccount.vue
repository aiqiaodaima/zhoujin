<template>
  <a-tabs v-model="activeKey" size="small" style="background: #ffffff;">
    <a-tab-pane key="1" tab="基本信息">
      <sub-acc-info :opt-type="comParam.optType" :acc-no="comParam.accNo" :prj-code="comParam.prjCode" @updateActive="updateActive"></sub-acc-info>
    </a-tab-pane>
    <a-tab-pane key="2" tab="投资限制" v-if="comParam.optType !== 'ADD'">
      <sub-acc-inv-lmt :status="status" :prjStatus="prjStatus" :opt-type="comParam.optType" :acc-no="comParam.accNo" :prj-code="comParam.prjCode" ></sub-acc-inv-lmt>
    </a-tab-pane>    
    <a-tab-pane key="3" tab="关联受益人" v-if="comParam.optType !== 'ADD'" :forceRender="true">
      <sub-acc-bnf-rel :status="status" :prjStatus="prjStatus" :opt-type="comParam.optType" :acc-no="comParam.accNo" :prj-code="comParam.prjCode" ></sub-acc-bnf-rel>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
  import SubAccInfo from './modules/SubAccInfo'
  import SubAccInvLmt from './modules/SubAccInvLmt'
  import SubAccBnfRel from './modules/SubAccBnfRel'
  import { postAction } from '../../api/manage'
  export default {
    name: 'SubAccount',
    components: {
      SubAccBnfRel,
      SubAccInvLmt,
      SubAccInfo
    },
    data() {
      return {
        status:'',
        prjStatus:'',
        activeKey: '1'
      }
    },
    props:{
      comParam:{
        // optType:'',
        accNo:'',
        prjCode:''
      },
      // 审核单业务key
      businessKey:{
        default: ''
      }
    },
    created() {
      if (this.comParam.accNo){
        postAction('/subacc/find', { accNo: this.comParam.accNo, id:''}).then((res)=>{
          if(res.success){
            this.status = res.result.status;
          }else{
            this.$message.error(res.message);
          }
        }).catch(function(error){
          this.$message.error('数据加载失败！');
        }).finally(() => {
          this.loading = false;
        });

        postAction('/prj/findByPrjCode', { cli:{prjCode: this.comParam.prjCode}}).then((res)=>{
          if(res.success){
            console.log('cli===',res);
            this.prjStatus = res.result.cli.prjStatus;
          }else{
            this.$message.error(res.message);
          }
        }).catch(function(error){
          this.$message.error('数据加载失败！');
        }).finally(() => {
          this.loading = false;
        });
      }
    },
    mounted() {
      console.log('this.comParam',this.comParam);
      console.log('审核单业务key=====',this.businessKey);
    },
    methods: {
      updateActive(activeKey){
        this.activeKey = activeKey
      }
    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less'
  .ant-anchor-ink{
    display: none!important;
  }
</style>