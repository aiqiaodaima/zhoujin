/**CounterPartyAdjust
*/
资金调帐
<template>
  <div>
    <!-- 审核单中看订单信息 -->
    <div v-if="businessKey">
      <CounterPartyAdjust ref='counterParty' :disabled='status!=80' title='申请单信息' :form='counterParty' :payDisabled="payDisabled.disabled" :rcvDisabled = "rcvDisabled.disabled" @changePrjCode="changePrjCode"/>
      <FundSource ref='fundSource' :disabled='status!=80' :fundSource='fundSource' :fundSourceItem='fundSourceItem' :hasProCode='false' :getCusAccFlag='false'/>
      <OrderOther ref='orderOther' :disabled='status!=80'/>
    </div>
    <page-layout v-if="!businessKey" :title="`资金调帐-${statusName}`" >
      <BasicInformation slot="headerContent" :detailData='detailData'/>
      <BasicInformationExtra slot="extra" :sumAmt='sumAmt'/>
      <BasicInformationAction slot="action"
        @submit="submit"
        @tempSave="tempSave"
        @comfirmTransfer="comfirmTransfer"
        @cancleOrder="cancleOrder"
        @mandatoryWithdrawal="mandatoryWithdrawal"
      />
      <FlowProgress :steps="steps"/>
      <a-collapse accordion style="margin-top:12px" :bordered="false" :activeKey='`${current}`' @change="changeCollapse">
        <a-collapse-panel header="请填写申请单" key="0">
          <CounterPartyAdjust ref='counterParty' :disabled='status!=80&&status!=="5"' title='申请单信息' :form='counterParty' :payDisabled="payDisabled.disabled" :rcvDisabled = "rcvDisabled.disabled" @changePrjCode="changePrjCode"/>
          <FundSource ref='fundSource' :disabled='status!=80&&status!=="5"' :fundSource='fundSource' :fundSourceItem='fundSourceItem' :hasProCode='false' :getCusAccFlag='false'/>
          <OrderOther ref='orderOther' :disabled='status!=80&&status!=="5"'/>
        </a-collapse-panel>
        <a-collapse-panel header="申请单审核中" key="1" :bordered="false" v-if="current>0">
          <WkfAuditHis ref="wkfAuditHis" @pageInited="hisPageInited"/>
        </a-collapse-panel>
        <a-collapse-panel header="核对流水确认划款" key="2" v-if="current>1">
          <FlowTransferAdjust ref='flowTransferAdjust' :disabled='status!=="10"' :flowTransferAdjust="flowTransferAdjust" @handleUpdate="getAdjustInfo" :flowTransferAdjustItem="flowTransferAdjustItem"/>
        </a-collapse-panel>
      </a-collapse>
      <!-- 操作日志 -->
      <OperationLog/>
      <WkfNextUserModal ref="wkfUserForm" @complete="wkfUserComplete"/>
    </page-layout>
  </div>
</template>

<script>
  import PageLayout from '@/components/page/PageLayout'
  import { mapState, mapActions, mapMutations } from "vuex";
  import { BasicInformation,BasicInformationExtra,BasicInformationAction,FlowProgress,
    CounterPartyAdjust,FundSource,OrderOther,OperationLog,CheckFlow,FlowTransferAdjust
  } from './modules'
  import { findAviAmt,doSaveAdjust,getAdjustInfo,confirmOrCancelAdjust } from '@/api/BiApi'
  import WkfNextUserModal from '@views/activiti/modules/WkfNextUserModal';
  import WkfAuditHis from '@views/activiti/modules/WkfAuditHis';
  import biUploadMixin from '@mixins/biUploadMixin'

  const steps = [
    {
      id: '0',
      name: '请填写申请单',
      status:['80']
    },
    {
      id: '1',
      name: '申请审核中',
      status:['0']
    },
    {
      id: '2',
      name: '核对流水确认到账',
      status:['10']
    },
    {
      id: '3',
      name: '交易完成',
      status:['15','20','25','60','50','55']
    }
  ]

  export default {
    name: "CapitalAdjustment",
    components: {
      PageLayout,
      BasicInformation,
      BasicInformationExtra,
      BasicInformationAction,
      FlowProgress,
      CounterPartyAdjust,
      FundSource,
      OrderOther,
      OperationLog,
      CheckFlow,
      FlowTransferAdjust,
      WkfNextUserModal,
      WkfAuditHis
    },
    data(){
      return {
        steps: steps,
        counterParty: {
          orderType:'LOA1402',
          prjCode: '',//项目名称
          trustPrjName:'',
          totalAmtDate: '',
          savingBalDate: '',
          payDt: new Date().toLocaleDateString().split('/').join('-'),//申请交易日期
          tranCurCode: '',
          payAmt: '',
          payAccName: '',
          payAccNo: '',
          rcvAccName: '',
          rcvAccNo: '',
          payAccOpenBank: '',
          rcvAccOpenBank: '',
          rcvBankCode: '',
          payBankCode: '',
          memo: ''
        },
        fundSource:[],//资金来源
        flowTransferAdjust:[],
        fundSourceItem: {
          editable: true,
          isNew: true,
          accNo: '', //子账户
          totalAmt: '--',
          updateDate: '--',
          planTranAmt:0,
        },
        flowTransferAdjustItem: {
          accName:'',
          accNo:'',
          tranDt:'',
          tranAmt:'',
          mappedAmt: ''
        },

        detailData: {
          batchId: '',
          odrCode: '',
          createBy: '',
          createDt: '',
          payDt: '',
        },
        sumAmt: 0, //总金额
        rcvDisabled: {
          disabled: false
        },
        payDisabled: {
          disabled: false
        }

      }
    },
    computed: {
      ...mapState("order", [
        "current","statusName","status","batchId","taskId"
      ]),
    },
    watch:{
      current: {
        handler(val){
          this.changeCollapse(val)
        },
        immediate: true,
        deep: true
      }
    },
    mixins: [biUploadMixin],
    methods: {
      ...mapMutations("order",["SET_status","RESET_STATE","SET_batchId","SET_bankCardBalanceDto",'SET_taskId']),
      ...mapActions("order",["addOrdersOptLogs","ordersOptLogsList","getCusAccInfoList","cusAccInfoListByPrjCode"]),
      changeCollapse(key){
         // 获取文件
        if(key == 0){
          this.$nextTick(() => {
            this.$refs.orderOther.getFiles(this.counterParty.orderType,this.batchId)
          });
        }
        //获取审核流信息
        if(key == 1){
          this.$nextTick(() => {
            this.$refs.wkfAuditHis.initPage(null, {taskId:this.taskId});
          });
        }
      },
      tempSave(){
        this.submit('TEMPS')
      },
      async changePrjCode(target){
        console.log(target)
        this.counterParty.payAccNo = target.accNo
        this.counterParty.payAccName = target.accName
        this.counterParty.payAccOpenBank = target.accOpenBank
        this.counterParty.payBankCode = target.bankCode
        this.counterParty.prjCode = target.prjCode
        this.counterParty.trustPrjName = target.trustPrjName
        this.cusAccInfoListByPrjCode({prjCode:target.prjCode})
        this.payDisabled.disabled = true
        const { result } = await findAviAmt({contractType:target.contractType,prjCode:target.prjCode})
        let { bankCardBalanceDto } = result
        this.counterParty.totalAmtDate = target.savingBal + '  (' + target.updateDate + ')'
        this.counterParty.savingBalDate = bankCardBalanceDto==null ? '-- (--)' : bankCardBalanceDto.savingBal + '  (' + bankCardBalanceDto.flowDateStr + ')'
      },
      submit(button){
        const counterParty = this.$refs.counterParty.form
        const validateCounterParty = this.$refs.counterParty.validateCounterParty()
        const fundSource = this.$refs.fundSource.fundSource
        if( !validateCounterParty ){
          this.$message.error('校验未通过');
          return
        }
        if( !fundSource.length ){
          this.$message.warning('请至少添加一条资金来源！')
          return
        }
        let sumAmt = 0
        for( let {accNo,planTranAmt,totalAmt } of fundSource ){
          if( !accNo ){
            this.$message.warning('请选择子账户')
            return
          }

          if( planTranAmt === '' || planTranAmt === null ){
            this.$message.warning('请输入交易金额')
            return
          }
          sumAmt += planTranAmt
          if( +planTranAmt > +totalAmt){
            this.$message.warning('交易金额不能超过系统可用余额')
            return
          }
        }
        if(sumAmt !== counterParty.payAmt){
          this.$message.warning('资金来源金额不等于申请交易金额')
          return
        }

        let param = {
          formButton: button || 'AUDITS',
          trxOrders:  {...counterParty,trantypeCode:'LOA1402',trustPrjName:this.counterParty.trustPrjName,status:this.status,batchId:this.batchId},
          trxOrdersAdjustList: fundSource
        }
        // 已经保存过的传batchId
        this.doSaveAdjust(param,button)
      },
      // 提交资金调帐订单
      async doSaveAdjust(data,button) {
        const { result } = await doSaveAdjust(data)
        this.$message.success('提交成功')
        this.SET_batchId( result.batchId )
        this.getAdjustInfo()
        // 埋点
        this.addOrdersOptLogs({
          batchId:result.batchId,
          optType: button ? '保存草稿':'提交申请单',
          oprations: button ? '保存草稿': '提交审核',
          status: button ? '待提交':'审核中',
        })
        //审核单选择审核人
        if(result.processId){
          this.$refs.wkfUserForm.edit(result.processId);
          this.$refs.wkfUserForm.disableSubmit = false;
        }
        // 上传文件
        this.$refs.orderOther.uploadFiles('LOA1402',this.batchId)
      },
      async getAdjustInfo(processId){
        const { result } = await getAdjustInfo({batchId:this.batchId})
        let { trxOrders,trxOrdersAdjustList,bankCardBalanceDto,cusLoaInfo,taskId } = result
        this.SET_status(trxOrdersAdjustList)
        this.SET_taskId(taskId)
        this.cusAccInfoListByPrjCode({prjCode:trxOrders.prjCode})
       
        for (let key in trxOrders) {
          if( this.counterParty.hasOwnProperty(key) ){
            this.counterParty[key] = trxOrders[key]
            this.counterParty.totalAmtDate = cusLoaInfo.savingBal + '  (' + cusLoaInfo.updateDate + ')'
            this.counterParty.savingBalDate = bankCardBalanceDto==null ? '-- (--)' : bankCardBalanceDto.savingBal + '  (' + bankCardBalanceDto.flowDateStr + ')'
          }
          if( this.detailData.hasOwnProperty(key) ){
            this.detailData[key] = trxOrders[key]
          }
        }
        if(trxOrders.status === '80' || trxOrders.status === '5'){
          this.rcvDisabled.disabled = false
        }else{
          this.rcvDisabled.disabled = true
        }
        this.payDisabled.disabled = true
        let fundSource = []
        let flowTransferAdjust = []
        let sumAmt = 0
        for (let { prjCode,accNo,accName,totalAmt,tranAmt,mappedAmt,odrCode,payDt,aviAmtUpdateDate,mapCapitalYN } of trxOrdersAdjustList) {
          fundSource.push({
            editable: false,
            isNew: false,
            prjCode,
            accNo,
            planTranAmt: tranAmt,
            key: fundSource.length,
            status: '10',
            odrCode,
            totalAmt,
            updateDate: aviAmtUpdateDate,
          })
          flowTransferAdjust.push({
            prjCode,
            accNo,
            accName,
            odrCode,
            mapCapitalYN,
            mappedAmt: mappedAmt,
            tranAmt: tranAmt,
            tranDt: new Date().toLocaleDateString().split('/').join('-'),
            status: '10',
          })
          sumAmt += (+tranAmt)
          this.sumAmt = sumAmt
        }
        this.fundSource = fundSource
        this.flowTransferAdjust = flowTransferAdjust
      },
      //确认划款
      async comfirmTransfer(){
        const flowTransferAdjust = this.$refs.flowTransferAdjust.flowTransferAdjust
        let param = {
          formButton: 'CFMPAY',
          trxOrdersAdjustList: []
        }
        for (let { odrCode,prjCode,accNo,accName,tranAmt,mappedAmt,tranDt,mapCapitalYN } of flowTransferAdjust) {
          if(!tranAmt){
            this.$message.warning('请输入交易金额')
            return
          }
          if(!tranDt){
            this.$message.warning('请选择付款日期')
            return
          }
          if(mapCapitalYN && mapCapitalYN === 'Y'){
            if((+mappedAmt) !== (+tranAmt)){
              this.$message.warning(accName + ':【交易付款金额】已勾稽资金流水金额与应付款金额不符！')
              return
            }
          }
          let trxOrdersAdjust = {
            //mapCapitalYN: 'N',//勾稽资金流水标识位
            odrCode, //单笔订单号
            prjCode,
            status: '10',//状态
            trantypeCode: 'LOA1402',//交易类型
            tranCurCode: 156,//交易币别代码 （人命币）
            accNo, //子账户
            tranAmt, //资金交收金额
            payAmt: this.counterParty.payAmt,
            tranDt,  // 资金交收日期
            //cancelComment:'', //失败备注
          }
          param.trxOrdersAdjustList.push(trxOrdersAdjust)
        }
        const { result } = await confirmOrCancelAdjust(param)
        this.getAdjustInfo()
        // 埋点
        this.addOrdersOptLogs({
          batchId:this.batchId,
          optType: '确认划款',
          oprations: '确认划款',
          status: '交易成功',
        })
      },
      // 取消订单cancleOrder
      async cancleOrder(){
        const flowTransferAdjust = this.$refs.flowTransferAdjust.flowTransferAdjust
        let param = {
          formButton: 'CANCLEPAY',
          trxOrdersAdjustList: []
        }
        for (let { odrCode,prjCode,accNo,tranAmt,tranDt } of flowTransferAdjust) {
          if(!tranAmt){
            this.$message.warning('请输入交易金额')
            return
          }
          if(!tranDt){
            this.$message.warning('请选择付款日期')
            return
          }
          let trxOrdersAdjust = {
            //mapCapitalYN: 'N',//勾稽资金流水标识位
            odrCode, //单笔订单号
            prjCode,
            status: '10',//状态
            trantypeCode: 'LOA1402',//交易类型
            tranCurCode: 156,//交易币别代码 （人命币）
            accNo, //子账户
            tranAmt, //资金交收金额
            tranDt,  // 资金交收日期
            //cancelComment:'', //失败备注
          }
          param.trxOrdersAdjustList.push(trxOrdersAdjust)
        }
        const { result } = await confirmOrCancelAdjust(param)
        this.getAdjustInfo()
        // 埋点
        this.addOrdersOptLogs({
          batchId:this.batchId,
          optType: '取消订单',
          oprations: '取消订单',
          status: '已取消',
        })
      },
      // 强制撤回
      async mandatoryWithdrawal(){
        this.getAdjustInfo()
        // 埋点
        this.addOrdersOptLogs({
          batchId:this.batchId,
          optType: '强制撤回',
          oprations: '强制撤回',
          status:  '待提交',
        })
      },
      hisPageInited (){

      },
      wkfUserComplete () {
        this.$nextTick(() => {
          this.$router.push({path:"/order/orderTrack"});
        });
      },
    },
    props:{
      // 审核单业务key
      businessKey:{
        default: ''
      }
    },
    created() {
      this.RESET_STATE()
      if( this.$route.query.batchId ){
        // 获取详情
        this.SET_batchId(this.$route.query.batchId)
        this.ordersOptLogsList()
        this.getAdjustInfo()
      }
      // 审核单中看订单信息
      if( this.businessKey ){
        const batchId = this.businessKey.split(':')[1]
        this.SET_batchId(batchId)
        this.getAdjustInfo()
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>