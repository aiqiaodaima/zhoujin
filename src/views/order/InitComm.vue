/** 
  认购订单
*/
<template>
  <page-layout  :title="`初始委托-${statusName}`">
    <BasicInformation slot="headerContent" :detailData='detailData' />
    <BasicInformationExtra slot="extra" :tranAmt='tranAmt' />
    <BasicInformationAction slot="action" @submit="submit" />
    <FlowProgress />
    <a-collapse accordion style="margin-top:12px" :bordered="false" :activeKey='`${current}`'>
      <a-collapse-panel header="请填写申请单" key="0">
        <CounterParty ref='counterParty' :disabled='status!=="80"' :form='counterParty'/>
        <FundSource ref='fundSource' :disabled='status!=="80"' :fundSource='fundSource'/>
        <OrderOther ref='orderOther' :disabled='status!=="80"'/>
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
  import PageLayout from '@/components/page/PageLayout'
  import { mapState, mapActions, mapMutations } from "vuex";
  import { BasicInformation,BasicInformationExtra,BasicInformationAction,FlowProgress,
    CounterParty,FundSource,OrderOther,OperationLog,CheckFlow,FlowTransfer
  } from './modules'
  import { addSubscribe,getSubscribeInfo,} from '@/api/BiApi'
  export default {
    name: "InitComm",
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
        fundSource:[],//资金来源
        fileList:[],
        checkFlow:[], //审核流程表格
        counterParty: {
          proCode:'', //资产名称
          issuerBran: '',//发行机构
          tranAccNo: '',//资金交收账户
          expReturnRate: '0',//年化预期收益率
          moneyDirezione: '',//资金投向
          enddayCalType: '',//头尾处理
          planPayDt: new Date().toLocaleDateString().split('/').join('-'), //申请交易日期
          deciMaker: '', // 投资决策人
          planTranDt: '',// 起息日
          planExpireDt: '',// 到期日
          trustCapitaleUse: '',//信托资金约定用途
          cDivflag: '',//收益分配方式
        }, // 交易对手
        detailData: {
          odrCode: '',
          createBy: '',
          createDt: '',
          deciMaker: '',
          planPayDt: '',
        },//信息
        tranAmt: '0', //总金额
      }
    },
    computed: {
      ...mapState("order", [
        "current","statusName","status"
      ]),
    },
    filters: {
    },
    methods:{
      ...mapMutations("order",["SET_status",]),
      submit() {
        const counterParty = this.$refs.counterParty.form
        const validateCounterParty = this.$refs.counterParty.validateCounterParty()
        const fundSource = this.$refs.fundSource.fundSource
        if( !validateCounterParty ){
          return
        }
        if( !fundSource.length ){
          this.$message.warning('请至少添加一条资金来源！')
          return
        }
        const trxOrders =  {
            "tranCurCode":"156",
            "imStyle":1,
            "iswkf":"Y",
            "accType":"ACC",
            "odrtypeCode":"INV",
            "trantypeCode":"INV01",
            "status":"80",
            "conAdoptYn":"Y",
            "recAdoptYn":"Y",
            "crmAdoptYn":"Y",
            "expReturnRate":"0",
            "invlmtComment":"",
            "planId":"",
            "mobilityComment":"",
            "odrCode":"",
            "applyInfoId":"",
            "deciMaker":"",
            "deciMakerOth":"",
            "memo":"",
            "planPayDt":"",
            "planTranDt":"",
            "planExpireDt":"",
            "proCode":"",
            "tranAccNo":"",
            "tranaccName":"Vicki0422投资项目001固定收益8.8每月15号付息",
            "tranaccOpenBank":"中国工商银行股份有限公司崇州永康西路支行",
            "tranaccOpenAddress":"中国工商银行股份有限公司崇州永康西路支行",
            "tranaccOpenSubbank":"中国工商银行股份有限公司崇州永康西路支行",
            "deciMakerType":"IM",
            "planFeeRate":"0",
            "planFee":"0",
            "planTransferFee":"0",
            "planRebateRate":"0",
            "shareType":"A",
            "priceYn":"Y"
          }
        let param = {
          trxOrders:  {...trxOrders,...counterParty,status:this.status},
          trxOrdersTransbuyList: fundSource
        }
        // param = {
        //   "trxOrders": {
        //     "tranCurCode":"156",
        //     "imStyle":1,
        //     "iswkf":"Y",
        //     "accType":"ACC",
        //     "odrtypeCode":"INV",
        //     "trantypeCode":"INV01",
        //     "status":"00",
        //     "conAdoptYn":"Y",
        //     "recAdoptYn":"Y",
        //     "crmAdoptYn":"Y",
        //     "expReturnRate":"0",
        //     "invlmtComment":"",
        //     "planId":"",
        //     "mobilityComment":"",
        //     "odrCode":"",
        //     "applyInfoId":"",
        //     "deciMaker":"",
        //     "deciMakerOth":"",
        //     "memo":"",
        //     "planPayDt":"2020-05-04",
        //     "planTranDt":"2020-05-30",
        //     "planExpireDt":"2199-12-31",
        //     "proCode":"q9nNHpmLnKc14BFO",
        //     "tranAccNo":"110101199003092472",
        //     "tranaccName":"Vicki0422投资项目001固定收益8.8每月15号付息",
        //     "tranaccOpenBank":"中国工商银行股份有限公司崇州永康西路支行",
        //     "tranaccOpenAddress":"中国工商银行股份有限公司崇州永康西路支行",
        //     "tranaccOpenSubbank":"中国工商银行股份有限公司崇州永康西路支行",
        //     "deciMakerType":"IM",
        //     "planFeeRate":"0",
        //     "planFee":"0",
        //     "planTransferFee":"0",
        //     "planRebateRate":"0",
        //     "shareType":"A",
        //     "priceYn":"Y"
        //   },
        //   "trxOrdersTransbuyList": [{
        //       "prjCode": "010020201Pf54BQ",
        //       "accNo": "010020201Pf54BQACCnkQf5U",
        //       "planTranAmt":"100"
        //     }
        //   ]
        // }
        this.addSubscribe(param)
      },
      // 提交认购订单
      async addSubscribe(data) {
        // const { result } = await addSubscribe(data)
        this.$message.success('提交成功')
        this.getSubscribeInfo({batchId:result.batchId})
      },
      // 获取认购详情
      async getSubscribeInfo(data) {
        const { result } = await getSubscribeInfo(data) 
        let { trxOrders,trxOrdersTransbuyList } = result
        this.SET_status(trxOrders.status)
        this.detailData = {...trxOrdersTransbuyList[0],deciMaker:trxOrders.deciMaker}
        this.counterParty = trxOrders
        let fundSource = []
        for (let { prjCode,accNo,planTranAmt } of trxOrdersTransbuyList) {
          fundSource.push({
            editable: false,
            isNew: false,
            prjCode,
            // trustPrjCode: '',
            accNo,
            aviAmt: '',
            bankCardBalanceDto:'',
            planTranAmt,
            key: fundSource.length
          })
        }
        this.fundSource = fundSource
      },
    },
    created(){
      // 获取详情
      // this.getSubscribeInfo({batchId:'25f9734d195a471b98cfd88e3625931b'})
    }
  }
</script>

<style lang="stylus" scoped>

</style>