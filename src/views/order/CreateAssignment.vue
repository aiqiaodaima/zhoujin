/**
转让订单
 */

<template>
  <page-layout  title="认购申请-待提交">
    <BasicInformation slot="headerContent" :detailData='123' />
    <BasicInformationExtra slot="extra" :tranAmt='12345678' />
    <BasicInformationAction slot="action" @submit="submit" />
    <FlowProgress :current='current'/>
    <a-collapse accordion style="margin-top:12px" :bordered="false" :activeKey='`${current}`'>
      <a-collapse-panel header="请填写申请单" key="0">
        <CounterParty ref='counterParty'/>
        <FundSource ref='fundSource' />
        <OrderOther ref='orderOther'/>
      </a-collapse-panel>
      <a-collapse-panel header="申请单审核中" key="1" :bordered="false">
        <CheckFlow/>
      </a-collapse-panel>
      <a-collapse-panel header="请核对流水确认划款" key="2">
        <FlowTransfer ref='flowTransfer'/>
      </a-collapse-panel>
      <a-collapse-panel header="请确认交易份额" key="3">
        <FlowTransfer ref='flowTransfer'/>
      </a-collapse-panel>
    </a-collapse>
    <!-- 操作日志 -->
    <OperationLog/>
  </page-layout>
</template>

<script>
  import moment from 'moment';
  import PageLayout from '@/components/page/PageLayout'
  import { mapState, mapActions, mapMutations } from "vuex";
  import { BasicInformation,BasicInformationExtra,BasicInformationAction,FlowProgress,
    CounterParty,FundSource,OrderOther,OperationLog,CheckFlow,FlowTransfer
  } from './modules'
  
  export default {
    name: "CreateOrder",
    components: {
      PageLayout,
      BasicInformation,
      BasicInformationExtra,
      BasicInformationAction,
      FlowProgress,
      CounterParty,
      FundSource,
      OrderOther,
      OperationLog,
      CheckFlow,
      FlowTransfer
    },
    mixins: [],
    data () {
      return {
        fundSource:[],
        cacheData:[],
        editingId:'',
        fileList:[],
        checkFlow:[], //审核流程表格
      }
    },
    computed: {
      ...mapState("order", [
        "current"
      ]),
    },
    filters: {
    },
    methods:{
      moment,
      ...mapActions("order",["addSubscribe"]),
      submit() {
        const counterParty = this.$refs.counterParty.form
        const validateCounterParty = this.$refs.counterParty.validateCounterParty()
        const fundSource = this.$refs.fundSource.fundSource
        if( !validateCounterParty ){
          return
        }
        let param = {
          trxOrders: counterParty,
          trxOrdersTransbuyList: fundSource
        }
        this.addSubscribe(param)
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>