/** 
  认购订单
*/
<template>
  <div>
    <!-- 审核单中看订单信息 -->
    <div v-if="businessKey">
      <CounterParty ref='counterParty' :disabled='status!=80' :form='counterParty'/>
      <FundSource ref='fundSource' :disabled='status!=80' :fundSource='fundSource' :fundSourceItem='fundSourceItem'/>
      <OrderOther ref='orderOther' :disabled='status!=80'/>
    </div>
    <!-- 订单申请 -->
    <page-layout v-if="!businessKey" :title="`认购申请-${statusName}`">
      <BasicInformation slot="headerContent" :detailData='detailData' />
      <BasicInformationExtra slot="extra" :sumAmt='sumAmt' />
      <BasicInformationAction slot="action" 
        @submit="submit" 
        @comfirmTransfer="comfirmTransfer" 
        @cancleOrder="cancleOrder"
        @tradeSuccess="tradeSuccessOrFail"
        @tradeFail="tradeFail"
        @tempSave="tempSave"
        @mandatoryWithdrawal="mandatoryWithdrawal"
        />
      <FlowProgress />
      <a-collapse accordion style="margin-top:12px" :bordered="false" :activeKey='`${current}`' @change="changeCollapse">
        <a-collapse-panel header="请填写申请单" key="0">
          <CounterParty ref='counterParty' :disabled='status!=80&&status!=="5"' :form='counterParty'/>
          <FundSource ref='fundSource' :disabled='status!=80&&status!=="5"' :fundSource='fundSource' :fundSourceItem='fundSourceItem'/>
          <OrderOther ref='orderOther' :disabled='status!=80&&status!=="5"'/>
        </a-collapse-panel>
        <a-collapse-panel header="申请单审核中" key="1" :bordered="false" v-if="current>0">
          <WkfAuditHis ref="wkfAuditHis" @pageInited="hisPageInited"/>
        </a-collapse-panel>
        <a-collapse-panel header="请核对流水确认划款" key="2" v-if="current>1">
          <FlowTransfer ref='flowTransfer' :flowTransfer="flowTransfer" 
            @handleUpdate="getSubscribeInfo" :disabled='status!=10' />
        </a-collapse-panel>
        <a-collapse-panel header="请确认交易份额" key="3" v-if="current>2">
          <TradeShare ref='tradeShare' :disabled='status!=20' :tradeShare="tradeShare" @tradeSuccessOrFail="tradeSuccessOrFail"/>
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
    CounterParty,FundSource,OrderOther,OperationLog,CheckFlow,FlowTransfer,TradeShare
  } from './modules'
  import { addSubscribe,getSubscribeInfo,confirmOrCancel,mandatoryWithdrawal} from '@/api/BiApi'
  import WkfNextUserModal from '@views/activiti/modules/WkfNextUserModal';
  import WkfAuditHis from '@views/activiti/modules/WkfAuditHis';
  import biUploadMixin from '@mixins/biUploadMixin'

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
      FlowTransfer,
      TradeShare,
      WkfNextUserModal,
      WkfAuditHis
    },
    mixins: [biUploadMixin],
    inject:['closeCurrent'],
    data () {
      return {
        isAudit: true,
        fundSource:[],//资金来源
        fundSourceItem: {
          editable: true,
          isNew: true,
          prjCode:'',
          trustPrjCode:'',// 项目编号
          accNo: '',
          totalAmt: '--',
          updateDate: '--',
          savingBal:'--',
          flowDateStr: '--',
          planTranAmt:0,
          odrCode: '',
        },
        fileList:[],
        checkFlow:[], //审核流程表格
        counterParty: {
          proCode:'', //资产名称
          issuerBran: '',//发行机构
          ifSelfPrepay: '',//资金交收方式
          tranAccNo: '',//资金交收账户
          expReturnRate: '0',//年化预期收益率
          moneyDirezione: '',//资金投向
          enddayCalType: '',//头尾处理
          planPayDt: new Date().toLocaleDateString().split('/').join('-'), //申请交易日期
          deciMakerType: '', // 投资决策人
          planTranDt: '',// 起息日
          planExpireDt: '',// 到期日
          trustCapitaleUse: '',//信托资金约定用途
          cdivflag: '',//收益分配方式
          orderType:'INV01' //订单类型认购
        }, // 交易对手
        detailData: {
          batchId: '',
          createBy: '',
          createDt: '',
          deciMakerType: '',
          planPayDt: '',
          curCode:'人名币'
        },//信息
        sumAmt: 0, //总金额
        flowTransfer:[],//核对流水确认划款表格数据
        tradeShare: [],//确认交易份额
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
    filters: {
    },
    methods:{
      ...mapMutations("order",["SET_status","RESET_STATE","SET_batchId",'SET_taskId','SET_isHold']),
      ...mapActions("order",["addOrdersOptLogs","ordersOptLogsList"]),
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
      submit(button) {
        //button 保存草稿TEMPS

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
        for( let {accNo,planTranAmt,totalAmt } of fundSource ){
          if( !accNo ){
            this.$message.warning('请选择子账户')
            return
          }
         
          if( planTranAmt === '' || planTranAmt === null ){
            this.$message.warning('请输入交易金额')
            return
          }
          if( +planTranAmt > +totalAmt){
            this.$message.warning('交易金额不能超过系统可用余额')
            return
          }
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
            "priceYn":"Y",
            "rcvBankCode":"",

          }
        trxOrders.rcvBankCode=this.$refs.counterParty.form.rCode
        let param = {
          formButton: button || '',
          trxOrders:  {...trxOrders,...counterParty,status:this.status,batchId:this.batchId},
          trxOrdersTransbuyList: fundSource
        }
        // 已经保存过的传batchId
        this.addSubscribe(param,button)
      },
      // 提交认购订单
      async addSubscribe(data,button) {
        const { result } = await addSubscribe(data)
        this.$message.success( button ? '保存草稿成功':'提交成功')
        this.SET_batchId( result.batchId )
        this.getSubscribeInfo()
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
        this.$refs.orderOther.uploadFiles('INV01',this.batchId)
      },
      
      hisPageInited() {

      },
      // 获取认购详情
      async getSubscribeInfo() {
        const { result } = await getSubscribeInfo({batchId:this.batchId}) 
        let { trxOrders,trxOrdersTransbuyList,taskId } = result
        this.SET_status(trxOrdersTransbuyList)
        this.SET_taskId(taskId)
      
        for (let key in trxOrders) {
          if( this.counterParty.hasOwnProperty(key) ){
            this.counterParty[key] = trxOrders[key]
           /* if(this.counterParty[key].form.tranAccNo!='银行自动扣款'){
              this.counterParty[key].form.tranAccNo=this.counterParty[key].form.tranAccNo+'|'+1200000
            }*/
          }
          if( this.detailData.hasOwnProperty(key) ){
            this.detailData[key] = trxOrders[key]
          }
        }
        let fundSource = []
        let sumAmt = 0
        for (let { prjCode,accNo,planTranAmt,zzhye,yhkye,odrCode,yhkyegxsj,zzhyegxsj,trustPrjCode } of trxOrdersTransbuyList) {
          fundSource.push({
            editable: false,
            isNew: false,
            prjCode,
            accNo,
            totalAmt: zzhye,
            updateDate: zzhyegxsj,
            savingBal:yhkye,
            flowDateStr:yhkyegxsj,
            planTranAmt,
            key: fundSource.length,
            odrCode,
            trustPrjCode,
          })
          sumAmt += (+planTranAmt)
          this.sumAmt = sumAmt
        }
        this.fundSource = fundSource
        this.flowTransfer = [...trxOrdersTransbuyList]
        this.tradeShare = [...trxOrdersTransbuyList]
      },
      // 确认划款
      async comfirmTransfer(){
        const flowTransfer = this.$refs.flowTransfer.flowTransfer
        let param = {
          confirmOrCancelBaseVo: []
        }
        for (let { odrCode,accNo,accName,payAmt,transferFee,payDt,planTranAmt,mappedAmt,mapCapitalYN } of flowTransfer) {
          if(!payDt){
            this.$message.warning('请选择资金交收日期')
            return
          }
          if(mapCapitalYN && mapCapitalYN === 'Y'){
            if((+mappedAmt) !== (+planTranAmt)){
              this.$message.warning(accName + ':【交易付款金额】已勾稽资金流水金额与应付款金额不符！')
              return
            }
          }
          let item = {
            mapCapitalYN: mapCapitalYN,//勾稽资金流水标识位
            odrCode, //单笔订单号
            status: '10',//状态
            tranTypeCode: 'INV01',//交易类型
            tranCurCode: 156,//交易币别代码 （人命币）
            formButton: 'CFMPAY',//FAILTRADE(交易失败) CFMPAY(交易成功、确认划款) CANCLEPAY(取消订单)
            feeType: '',//手续费扣收方式
            itfId: '',//外部接口主键   （暂时不用管  没有对接其他系统）
            accNo, //子账户
            payAmt:planTranAmt, //资金交收金额
            transferFee, //手续费
            payDt,  // 资金交收日期
            cancelComment:'', //失败备注
          }
          param.confirmOrCancelBaseVo.push(item)
        }
        const { result } = await confirmOrCancel(param)
        this.getSubscribeInfo()
        // 埋点
        this.addOrdersOptLogs({
          batchId:this.batchId,
          optType: '确认划款',
          oprations: '确认划款',
          status: '未确认份额',
          })
      },
      // 取消订单
      async cancleOrder(){
        const flowTransfer = this.$refs.flowTransfer.flowTransfer
        let param = {
          confirmOrCancelBaseVo: []
        }
        for (let { odrCode,accNo,payAmt,transferFee,payDt } of flowTransfer) {
          let item = {
            mapCapitalYN: 'N',//勾稽资金流水标识位
            odrCode, //单笔订单号
            status: '10',//状态
            tranTypeCode: 'INV01',//交易类型
            tranCurCode: 156,//交易币别代码 （人命币）
            formButton: 'CANCLEPAY',//FAILTRADE(交易失败) CFMPAY(交易成功、确认划款) CANCLEPAY(取消订单)
            feeType: '',//手续费扣收方式
            itfId: '',//外部接口主键   （暂时不用管  没有对接其他系统）
            accNo, //子账户
            payAmt, //资金交收金额
            transferFee, //手续费
            payDt,  // 资金交收日期
            cancelComment:'', //失败备注
          }
          param.confirmOrCancelBaseVo.push(item)
        }
        const { result } = await confirmOrCancel(param) 
        this.getSubscribeInfo()
        // 埋点
        this.addOrdersOptLogs({
          batchId:this.batchId,
          optType: '取消订单',
          oprations: '取消订单',
          status: '已取消',
          })
      },
      // 交易成功
      async tradeSuccessOrFail( tradeShare=[],isFail ){
        if( !tradeShare.length ){
          tradeShare = this.$refs.tradeShare.tradeShare
        }
        let param = {
          confirmOrCancelBaseVo: []
        }
        for (let { odrCode,accNo,payAmt,payDt,trxContractNo,tranAmt,fee,tranAmtFc,feeFc,rebateRate,tranUnit,tranPrice,expireDt,tranDt } of tradeShare) {
          if(!isFail){
            // if(!payAmt){
            //   this.$message.warning('请输入资金交收金额')
            //   return
            // }
            if(!payDt){
              this.$message.warning('请选择资金交收日期')
              return
            }
            if(!trxContractNo){
              this.$message.warning('请输入产品购买合同号')
              return
            }
            if(!tranAmtFc){
              // this.$message.warning('请输入实际成交金额')
              // return
            }
            if(!payAmt){
              this.$message.warning('请输入资金交收金额')
              return
            }
            // if(!tranUnit){
            //   this.$message.warning('请输入成交份额')
            //   return
            // }
            if(!tranPrice){
              this.$message.warning('请输入成交单位价格')
              return
            }
            if(!tranDt){
              this.$message.warning('请选择投资起息日')
              return
            }
            if(!expireDt){
              this.$message.warning('请选择投资到期日')
              return
            }
            if(tranPrice > payAmt ){
              this.$message.warning('成交单位价格不能超过资金交收金额')
              return
            }
          }
          let item = {
            mapCapitalYN: 'N',//勾稽资金流水标识位
            odrCode, //单笔订单号
            status: '20',//状态
            tranTypeCode: 'INV01',//交易类型
            tranCurCode: 156,//交易币别代码 （人命币）
            formButton: 'CFMPAY',//FAILTRADE(交易失败) CFMPAY(交易成功、确认划款) CANCLEPAY(取消订单)
            feeType: '',//手续费扣收方式
            itfId: '',//外部接口主键   （暂时不用管  没有对接其他系统）
            accNo, //子账户
            payAmt, //资金交收金额
            transferFee:"", //手续费
            payDt,  // 资金交收日期
            cancelComment:'', //失败备注
            trxContractNo, // 产品购买合同号
            partBargainYn: "N",
            tranAmt:payAmt, //交易金额
            fee,//转账手续费
            tranAmtFc:payAmt, //实际成交金额
            feeFc,
            rebateRate:"",
            refundAmt: "",
            refundDt: "",
            tranDt, //投资起息日
            expireDt, //投资到期日
            tranUnit, //成交份额
            tranPrice, //成交单位价格
          }
          // 交易失败
          if(isFail){
            item.formButton = 'FAILTRADE'
          }
          param.confirmOrCancelBaseVo.push(item)
        }
        const { result,success } = await confirmOrCancel(param) 
        if( success ){
          this.getSubscribeInfo()
          // 埋点
          this.addOrdersOptLogs({
            batchId:this.batchId,
            optType: isFail ? '交易失败' : '全部成交确认',
            oprations: isFail ? '交易失败' :'全部成交',
            status: isFail ? '失败已退款' : '交易成功',
            })
        }
      },
      tradeFail(){
        this.tradeSuccessOrFail([],true)
      },
      tempSave(){
        this.submit('TEMPS')
      },
      // 强制撤回
      async mandatoryWithdrawal(){
        this.getSubscribeInfo()
        // 埋点
        this.addOrdersOptLogs({
          batchId:this.batchId,
          optType: '强制撤回',
          oprations: '强制撤回',
          status:  '待提交',
          })
      },
      wkfUserComplete () {
        this.$nextTick(() => {
          this.$router.push({path:"/order/orderTrack"});
        });
        this.closeCurrent()
      },

    },
    props:{
      // 审核单业务key
      businessKey:{
        default: ''
      }
    },
    created(){
      this.RESET_STATE()
      this.SET_isHold('N')
      if( this.$route.query.batchId ){
        // 获取详情
        this.SET_batchId(this.$route.query.batchId)
        this.ordersOptLogsList()
        this.getSubscribeInfo()
      }
      // 审核单中看订单信息
      if( this.businessKey ){
        const batchId = this.businessKey.split(':')[1]
        this.SET_batchId(batchId)
        this.getSubscribeInfo()
      }
    },
  }
</script>

<style lang="stylus" scoped>

</style>