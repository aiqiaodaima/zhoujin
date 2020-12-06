/**CounterPartyAdjust
*/
  非上市股权投资 非私募基金类有限合伙公司投资
<template>
  <div>
    <!-- 审核单中看订单信息 -->
    <div v-if="businessKey">
      <InvestmentInfo ref='investmentInfo' :disabled='status!=80' title='申请单信息' :form='investmentInfo' :cusAccInfoList="cusAccInfoList" :prjectInfoList="prjectInfoList" />
      <InvestmentCounterparty ref='investmentCounterparty' :disabled='status!=80'  :form="investmentCounterparty" />
      <OrderOther ref='orderOther' :disabled='status!=80'/>
    </div>
    <page-layout v-if="!businessKey" :title="`${investmentInfo.trantypeCode == 'INV13'?'非上市股权投资':'非私募基金类有限合伙公司投资'}-${statusName}`" logo="">
      <BasicInformation slot="headerContent" :detailData='detailData'/>
      <BasicInformationExtra slot="extra" :sumAmt='sumAmt'/>
      <BasicInformationAction slot="action"
        @submit="submit"
        @tempSave="tempSave"
        @comfirmTransfer="comfirmTransfer"
        @cancleOrder="cancleOrder"
        @mandatoryWithdrawal="mandatoryWithdrawal"
         @tradeSuccess="sureStake"
         @tradeFail="tradeFail"
      />
      <FlowProgress :steps="steps"/>
      <a-collapse accordion style="margin-top:12px" :bordered="false" :activeKey='`${current}`' @change="changeCollapse">
        <a-collapse-panel header="请填写申请单" key="0">
          <InvestmentInfo ref='investmentInfo' :disabled='status!=80&&status!=="5"' title='申请单信息' :form='investmentInfo' :cusAccInfoList="cusAccInfoList" :prjectInfoList="prjectInfoList" />
          <InvestmentCounterparty ref='investmentCounterparty' :disabled='status!=80&&status!=="5"' :form='investmentCounterparty'  />
          <OrderOther ref='orderOther' :disabled='status!=80&&status!=="5"'/>
        </a-collapse-panel>
        <a-collapse-panel header="申请单审核中" key="1" :bordered="false" v-if="current>0">
          <WkfAuditHis ref="wkfAuditHis"/>
        </a-collapse-panel>
        <a-collapse-panel header="核对流水确认划款" key="2" v-if="current>1">
          <InvestmentFlow ref='investmentFlow' :disabled='status!=="10"' :form="investmentFlow" :cusAccInfoList="cusAccInfoList" @handleUpdate="investmentView"/>
        </a-collapse-panel>
        <a-collapse-panel header="确认持股比例" key="3" v-if="current>2">
          <StakeInfo ref='stakeInfo' :disabled='status=="50"' :form="stakeInfo" :cusAccInfoList="cusAccInfoList"/>
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
    InvestmentInfo,InvestmentCounterparty,InvestmentFlow,StakeInfo,OrderOther,OperationLog
  } from './modules'
  import { findAviAmt,investmentAdd,investmentView,investmentConfirmOrCancel,getAccInfoList } from '@/api/BiApi'
  import WkfNextUserModal from '@views/activiti/modules/WkfNextUserModal';
  import WkfAuditHis from '@views/activiti/modules/WkfAuditHis';
  import { formatAmt } from '@utils/util'
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
      name: '确认持股比例',
      status:['85']
    },
    {
      id: '4',
      name: '交易完成',
      status:['15','90','25','50','55']
    }
  ]

  export default {
    name: "PrivateInvestment",
    components: {
      PageLayout,
      BasicInformation,
      BasicInformationExtra,
      BasicInformationAction,
      FlowProgress,
      InvestmentInfo,
      InvestmentCounterparty,
      InvestmentFlow,
      StakeInfo,
      OrderOther,
      OperationLog,
      WkfNextUserModal,
      WkfAuditHis
    },
    data(){
      return {
        cusAccInfoList:[],
        steps: steps,
        investmentInfo: {
          accNo:'',
          trantypeCode:'INV13',
          odrtypeCode:'INV',
          tranSubtypeCode:'',
          prjCode: '',//项目名称
          totalAmtDate: '',
          savingBalDate: '',
          proCode:'',
          payDt: new Date().toLocaleDateString().split('/').join('-'),//申请交易日期
          payAmt: '',
          memo: '',
          proName:'',
          trust_prj_code:'',
          trustPrjName:'',
          actualTranDt:'',
          actualTranAmt:'',
          actualTranStake:'',
          refContractNo:'',
          refContractName:'',
          hasAdviser:'',
          isJointStock:'Y',
        },
        investmentCounterparty:{
          counterpartType:'',
          counterpartName:'',
          investmentAccName:'',
          investmentAccNo:'',
          investmentAccOpenBank:'',
        },
        investmentFlow:{
          odrCode:'',
          tranTypeCode:'',
          prjCode:'',
          accNo:'',
          totalAmtDate: '',
          savingBalDate: '',
          payAmt:'',
          payDt:'',
          tranDt:'',
          tranAmt:'',
          mapCapitalYN:''
        },
        stakeInfo:{
          odrCode:'',
          tranTypeCode:'',
          prjCode:'',
          proCode:'',
          accNo:'',
          refContractNo: '',
          refContractName: '',
          trustPrjName:'',
          trustPrjCode:'',
          actualTranDt:new Date().toLocaleDateString().split('/').join('-'),
          actualTranAmt:'',
          actualTranStake:'',
        },
        detailData: {
          batchId: '',
          odrCode: '',
          createBy: '',
          createDt: '',
          payDt: '',
        },
        sumAmt: 0, //总金额
      }
    },
    computed: {
      ...mapState("order", [
        "current","statusName","status","batchId","taskId","prjectInfoList"
      ]),
    },
    watch: {
    },
    methods: {
      ...mapMutations("order",["SET_status","RESET_STATE","SET_batchId","SET_bankCardBalanceDto",'SET_taskId']),
      ...mapActions("order",["addOrdersOptLogs","getPrjectInfoList","ordersOptLogsList","cusAccInfoListByPrjCode","findAccount"]),
      formatAmt(amt,decimals=2){
        return formatAmt(amt,decimals);
      },

      changeCollapse(key){
        if(key == 1){
          this.$nextTick(() => {
            this.$refs.wkfAuditHis.initPage(null, {taskId:this.taskId});
          });
        }
      },
      tempSave(){
        this.submit('TEMPS')
      },
      async getAccInfoList(){
        let param={imStyle:1}
        const res = await getAccInfoList(param)
        if (res.success) {
          this.cusAccInfoList = res.result;
        }
      },

      submit(button){
        const investmentInfo = this.$refs.investmentInfo.form
        const validateCounterParty = this.$refs.investmentInfo.validateInvestmentForm()
        const investmentCounterparty = this.$refs.investmentCounterparty.form
        const validateInvestmentCounterparty = this.$refs.investmentCounterparty.validateinvestmentCounterparty()
        if( !validateCounterParty || !validateInvestmentCounterparty){
           this.$message.error('校验未通过');
          return
        }
        let param = {
          formButton: button || 'AUDITS',
          trxOrders:  {...investmentInfo,trantypeCode:this.investmentInfo.trantypeCode,status:this.status,batchId:this.batchId},
          investmentCounterparty: investmentCounterparty
        }
        // 已经保存过的传batchId
        this.investmentAdd(param,button)
      },
      // 提交投资
      async investmentAdd(data,button) {
        const { result } = await investmentAdd(data)
        this.$message.success('提交成功')
        this.SET_batchId( result.batchId )
        this.investmentView()
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
        this.$refs.orderOther.uploadFiles(this.investmentInfo.trantypeCode,this.batchId)
      },
      async investmentView(){
        const { result } = await investmentView({batchId:this.batchId})
        let { TrxOrders,privateInvestment,taskId,bankCardBalanceDto,capitalAviAmtDto } = result
        this.SET_status(TrxOrders.status)
        this.SET_taskId(taskId)

        //初始化审核流信息
        if(taskId){
          this.$nextTick(() => {
            if(this.$refs.wkfAuditHis){
              this.$refs.wkfAuditHis.initPage(null, {taskId});
            }
          });
        }

        for (let key in TrxOrders) {
          if( this.detailData.hasOwnProperty(key) ){
            this.detailData[key] = TrxOrders[key]
          }
        }
        // 获取文件
        this.$refs.orderOther.getFiles(this.investmentInfo.trantypeCode,this.batchId)
        this.investmentCounterparty = privateInvestment
        this.investmentInfo=TrxOrders
        this.investmentInfo.hasAdviser=privateInvestment.hasAdviser
        this.investmentInfo.totalAmtDate = !capitalAviAmtDto ?  '-- (--)' : capitalAviAmtDto.totalAmt + '  (' + capitalAviAmtDto.updateDate + ')'
        this.investmentInfo.savingBalDate = bankCardBalanceDto==null ? '-- (--)' : bankCardBalanceDto.savingBal + '  (' + bankCardBalanceDto.flowDateStr + ')'
        this.sumAmt=this.investmentInfo.payAmt
        //封装划款页面数据信息
        this.investmentFlow={
            odrCode:this.investmentInfo.odrCode,
          tranTypeCode:this.investmentInfo.trantypeCode,
            prjCode:this.investmentInfo.prjCode,
            accNo:this.investmentInfo.accNo,
            totalAmtDate:this.investmentInfo.totalAmtDate,
            savingBalDate: this.investmentInfo.savingBalDate,
            payAmt:this.investmentInfo.payAmt,
            payDt:this.investmentInfo.payDt,
           tranAmt:this.investmentInfo.payAmt,
             tranDt:this.investmentInfo.payDt,
            mapCapitalYN:this.investmentCounterparty.mapCapitalYN
        };
        this.stakeInfo={
          odrCode:this.investmentInfo.odrCode,
            tranTypeCode:this.investmentInfo.trantypeCode,
            prjCode:this.investmentInfo.prjCode,
            proCode:this.investmentInfo.proCode,
            accNo:this.investmentInfo.accNo,
            refContractNo:this.investmentInfo.refContractNo,
            refContractName:this.investmentCounterparty.refContractName,
            trustPrjName:this.investmentInfo.trustPrjName,
            trustPrjCode:this.investmentInfo.trustPrjCode,
            actualTranDt:this.investmentInfo.actualTranDt===null? new Date().toLocaleDateString().split('/').join('-'):this.investmentInfo.actualTranDt,
            actualTranAmt:this.investmentInfo.actualTranAmt===null? this.investmentInfo.tranAmt:this.investmentInfo.actualTranAmt,
            actualTranStake:this.investmentInfo.actualTranStake===null?this.investmentInfo.payStake:this.investmentInfo.actualTranStake,
            mapCapitalYN:this.investmentCounterparty.mapCapitalYN
        };

      },
      //交易成功
      async sureStake(){
        const stakeInfo = this.$refs.stakeInfo.form
        const validateStakeInfoForm = this.$refs.stakeInfo.validateStakeInfoForm()
        if( !validateStakeInfoForm){
          this.$message.error('校验未通过');
          return
        }
        let param = {
          confirmOrCancelBaseVo: []
        }
        let item = {
          mapCapitalYN:stakeInfo.mapCapitalYN,//勾稽资金流水标识位
          odrCode:stakeInfo.odrCode, //单笔订单号
          status: '85',//状态
          tranTypeCode:stakeInfo.tranTypeCode,//交易类型
          formButton: 'CFMPAY',//交易成功
          accNo:stakeInfo.accNo, //子账户
          payAmt:stakeInfo.actualTranAmt, //实际成交金额
          payDt:stakeInfo.actualTranDt,  // 实际成交日
          trxContractNo:stakeInfo.refContractNo, //产品购买合同编号
          refContractName:stakeInfo.refContractName,//产品购买合同名称
          actualTranStake:stakeInfo.actualTranStake,//持股比例
        }
        param.confirmOrCancelBaseVo.push(item)
        const { result } = await investmentConfirmOrCancel(param)
        this.investmentView()
        // 埋点
        this.addOrdersOptLogs({
          batchId:this.batchId,
          optType: '确认股权比例',
          oprations: '确认股权比例',
          status: '交易成功',
        })
      },

      //交易失败
      async tradeFail(){
        const stakeInfo = this.$refs.stakeInfo.form
        let param = {
          confirmOrCancelBaseVo: []
        }
        let item = {
          mapCapitalYN:stakeInfo.mapCapitalYN,//勾稽资金流水标识位
          odrCode:stakeInfo.odrCode, //单笔订单号
          status: '55',//状态
          tranTypeCode:stakeInfo.tranTypeCode,//交易类型
          formButton: 'FAILTRADE',//交易成功
          accNo:stakeInfo.accNo, //子账户
          payAmt:stakeInfo.actualTranAmt, //实际成交金额
          payDt:stakeInfo.actualTranDt,  // 实际成交日
          trxContractNo:stakeInfo.refContractNo, //产品购买合同编号
          refContractName:stakeInfo.refContractName,//产品购买合同名称
          actualTranStake:stakeInfo.actualTranStake,//持股比例
        }
        param.confirmOrCancelBaseVo.push(item)
        const { result } = await investmentConfirmOrCancel(param)
        this.investmentView()
        // 埋点
        this.addOrdersOptLogs({
          batchId:this.batchId,
          optType: '交易失败',
          oprations: '交易失败',
          status: '失败已退款',
        })
      },
      // 确认划款
      async comfirmTransfer(){
        const flow= this.$refs.investmentFlow.form
        let param = {
          confirmOrCancelBaseVo: []
        }
          if(!flow.tranDt){
            this.$message.warning('请选择资金交收日期')
            return
          }
        if(!flow.tranAmt){
          this.$message.warning('请输入资金交收金额')
          return
        }
          if(flow.mapCapitalYN === 'Y'){
            if(this.investmentCounterparty.mappedAmt !== this.sumAmt){
              this.$message.warning('【交易付款金额】已勾稽资金流水金额与应付款金额不符！')
              return
            }
          }
          let item = {
            mapCapitalYN:flow.mapCapitalYN,//勾稽资金流水标识位
            odrCode:flow.odrCode, //单笔订单号
            status: '10',//状态
            tranTypeCode:flow.tranTypeCode,//交易类型
            formButton: 'CFMPAY',//FAILTRADE(交易失败) CFMPAY(交易成功、确认划款) CANCLEPAY(取消订单)
            accNo:flow.accNo, //子账户
            tranAmt:flow.tranAmt, //资金交收金额
            tranDt:flow.tranDt,  // 资金交收日期
            cancelComment:'', //失败备注
          }
          param.confirmOrCancelBaseVo.push(item)
        const { result } = await investmentConfirmOrCancel(param)
        this.investmentView()
        // 埋点
        this.addOrdersOptLogs({
          batchId:this.batchId,
          optType: '确认划款',
          oprations: '确认划款',
          status: '未确认股权比例',
        })
      },
      // 取消订单
      async cancleOrder(){
        const flow= this.$refs.investmentFlow.form
        let param = {
          confirmOrCancelBaseVo: []
        }
          let item = {
            mapCapitalYN:flow.mapCapitalYN,//勾稽资金流水标识位
            odrCode:flow.odrCode, //单笔订单号
            status: '10',//状态
            tranTypeCode:flow.tranTypeCode,//交易类型
            formButton: 'CANCLEPAY',//FAILTRADE(交易失败) CFMPAY(交易成功、确认划款) CANCLEPAY(取消订单)
            accNo:flow.accNo, //子账户
            payAmt:flow.tranAmt, //资金交收金额
            payDt:flow.tranDt,  // 资金交收日期
            cancelComment:'', //失败备注
          }
          param.confirmOrCancelBaseVo.push(item)
        const { result } = await investmentConfirmOrCancel(param)
        this.investmentView()
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
        this.investmentView()
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
        this.closeCurrent()
      },
    },
    inject:['closeCurrent'],
    mixins: [biUploadMixin],
    props:{
      // 审核单业务key
      businessKey:{
        default: ''
      }
    },
    mounted(){
      this.getAccInfoList()
      if( this.$route.query.batchId ){
        // 获取详情
        this.SET_batchId(this.$route.query.batchId)
        this.ordersOptLogsList()
        this.investmentView()
      }
      // 审核单中看订单信息
      if( this.businessKey ){
        const batchId = this.businessKey.split(':')[1]
        this.SET_batchId(batchId)
        this.investmentView()
      }
    },
    created() {
      this.RESET_STATE()
      this.getPrjectInfoList()
       //区分不同类型privateStockInvestment:INV13非上市股权投资，INV14非私募基金类有限合伙公司投资
       if(this.$route.path == '/order/privateStockInvestment'){
         this.investmentInfo.trantypeCode = 'INV13'
       } else {
        this.investmentInfo.trantypeCode = 'INV14'
       }
     
    }
  }
</script>

<style lang="stylus" scoped>

</style>