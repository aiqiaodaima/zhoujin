<template>
  <a-tabs default-active-key="1" size="small" style="background: #ffffff;">
    <a-tab-pane key="1" tab="基本信息">
      <sub-acc-info :opt-type="comParam.optType" :acc-no="comParam.accNo" :prj-code="comParam.prjCode" :va="va"></sub-acc-info>
    </a-tab-pane>
    <a-tab-pane key="2" tab="投资限制" v-if="comParam.optType !== 'ADD'" :forceRender="true">
      <sub-acc-inv-lmt  :opt-type="comParam.optType" :acc-no="comParam.accNo" :prj-code="comParam.prjCode" :va="va" :foot="comParam.foot"></sub-acc-inv-lmt>
    </a-tab-pane>
    <a-tab-pane key="3" tab="关联受益人" v-if="comParam.optType !== 'ADD'" :forceRender="true">
      <sub-acc-bnf-rel  :opt-type="comParam.optType" :acc-no="comParam.accNo" :prj-code="comParam.prjCode":va="va" ></sub-acc-bnf-rel>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
  import SubAccInfo from './SubAccInfo'
  import SubAccInvLmt from './SubAccInvLmt'
  import SubAccBnfRel from './SubAccBnfRel'
  import { postAction } from '../../../api/manage'
  export default {
    name: 'SubAccInfoView',
    components: {
      SubAccBnfRel,
      SubAccInvLmt,
      SubAccInfo
    },
    data() {
      return {
        bkey:'',
        va:'',
        url:{
          save:'/subacc/save',
          find:'/subacc/find'
        },
        comParam:{
        optType:'',
          prjCode:'',
          accNo:'',
          va:'',
          foot:''
      }
      }

    },
    props:{
      // 审核单业务key
      businessKey:{
        default: ''
      }
    },
    created() {
      if(this.businessKey){
        this.bkey=this.businessKey
        this.comParam.optType = 'VIEW';
        this.loading = true;
        if(this.bkey.indexOf(':')>-1){
          this.bkey = this.bkey.split(':')[1];
        }
        postAction(this.url.find, { id:this.bkey}).then((res)=>{
          if(res.success){
            this.comParam.accNo = res.result.accNo;
            this.comParam.prjCode = res.result.prjCode;
            this.va='1'
            this.comParam.foot='1'
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
    },
    provide(){
      return{
        psToPage:this.toPage,
      }
    },
    methods: {
      toPage(compStr, param){
        this.comParam = param;
        this.loadComp(compStr);
      },
      loadComp(compStr){
        if(this.comps[compStr]){
          this.comp = this.comps[compStr];
        }else{
          let compImp = () => import('@/views/'+compStr+'.vue');
          this.comps[compStr] = compImp;
          this.comp = compImp;
        }
      },
    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less'
  .ant-anchor-ink{
    display: none!important;
  }
</style>