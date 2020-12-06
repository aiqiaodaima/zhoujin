/** 
  代缴保费事务单
*/
<template>
  <div>
     <!-- 审核单中看订单信息 -->
    <div v-if="businessKey">
      <CounterParty ref='counterParty' title='申请单信息' :disabled='status!=="80"' :form='counterParty'/>
      <FundSourceInsure ref='fundSource' :disabled='status!=="80"' :fundSource='fundSource' :fundSourceItem='fundSourceItem'/>
      <OrderOther ref='orderOther' :disabled='status!=="80"'/>
    </div>
  
    <!-- 订单申请 -->
    <page-layout  v-if="!businessKey" :title="`代缴保费-${statusName}`">
      <BasicInformation slot="headerContent" :detailData='detailData' />
      <BasicInformationExtra slot="extra" :sumAmt='sumAmt' />
      <BasicInformationAction slot="action" 
        @submit="submit" 
        @comfirmUnit="handleDeductionUnit" 
        @cancleOrder="cancleOrder"
        @comfirmTransfer="handleFlowTransfer"
        @tempSave="tempSave"
        @mandatoryWithdrawal="mandatoryWithdrawal"
        />
      <FlowProgress :steps="steps"/>
      <a-collapse accordion style="margin-top:12px" :bordered="false" :activeKey='`${current}`' @change="changeCollapse">
        <a-collapse-panel header="请填写申请单" key="0">
          <CounterParty ref='counterParty' title='申请单信息' :disabled='status!=="80"&&status!=="5"' :form='counterParty'/>
          <FundSourceInsure ref='fundSource' :disabled='status!=="80"&&status!=="5"' :fundSource='fundSource' :fundSourceItem='fundSourceItem'/>
          <OrderOther ref='orderOther' :disabled='status!=="80"&&status!=="5"'/>
        </a-collapse-panel>
        <a-collapse-panel header="申请单审核中" key="1" :bordered="false" v-if="current>0">
          <WkfAuditHis ref="wkfAuditHis" @pageInited="hisPageInited"/>
        </a-collapse-panel>
        <a-collapse-panel header="确认扣减份额" key="2" v-if="current>1">
          <DeductionUnitInsure ref='deductionUnit' :disabled='status!=="70"' :fundSource='deductionUnit' :fundSourceItem='deductionUnitItem'/>
        </a-collapse-panel>
        <a-collapse-panel header="核对流水确认划款" key="3" v-if="current>2">
          <FlowTransfer ref='flowTransfer' :disabled='status!=="10"'  :flowTransfer="flowTransfer"
           :flowTransferItem="flowTransferItem" @handleUpdate='benefitsBack'/>
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
    CounterParty,FundSourceInsure,OrderOther,OperationLog,CheckFlow,DeductionUnitInsure,FlowTransfer
  } from './modules'
  import { saveOrders,queryOrderInfo,affirmDrawing,confirmedTransfer,mandatoryWithdrawal} from '@/api/BiApi'
  import WkfNextUserModal from '@views/activiti/modules/WkfNextUserModal';
  import WkfAuditHis from '@views/activiti/modules/WkfAuditHis';
  import biUploadMixin from '@mixins/biUploadMixin'
  const steps = [
    {
      id: '0',
      name: '请填写申请单',
      status:['80','5']
    },
    {
      id: '1',
      name: '申请审核中',
      status:['0']
    },
    {
      id: '2',
      name: '确认扣减份额',
      status:['70']
    },
    {
      id: '3',
      name: '核对流水确认划款',
      status:['10','101']
    },
    {
      id: '4',
      name: '交易完成',
      status:['15','25','60','50','55']
    }
  ]
  export default {
    name: "PayPermium",
    components: {
      PageLayout,
      BasicInformation,
      BasicInformationExtra,
      BasicInformationAction,
      FlowProgress,
      CounterParty,
      FundSourceInsure,
      OrderOther,
      OperationLog,
      CheckFlow,
      DeductionUnitInsure,
      FlowTransfer,
      WkfNextUserModal,
      WkfAuditHis
    },
    mixins: [biUploadMixin],
    data () {
      return {
        steps: steps, //步骤
        // fundSource:[],//资金来源
        fundSourceItem: {
          accNo:'',
          accName:'',
          insuranceContract:'',//保险合同
          valuationType: '',//估值类型
          policyHolder:'',//投保人
          premiumDueDate:'',//保费应缴日
          amountOfPremiumPayable:'', //保费应缴金额
          totalAmt:'',
          updateDate:'',
          savingBal:'',
          flowDateStr:'',
          odrCode:'',
          modeOfBeneficialRight:'', //收益权模式
          principalAmount:'', //本金金额
          incomeAmount:'',//收益金额
          paymentAccount:'',//付款账户
          partyName: '',//受益人姓名
        },
        fileList:[],
        checkFlow:[], //审核流程表格
        counterParty: {
          orgCode:'',// 保险人
          planPayDt: new Date().toLocaleDateString().split('/').join('-'), //申请交易日期
          curCode: 'rmb',// 币种
          rcvAccNo: '',// 收款账户
          rcvAccName: '',
          rcvAccOpenBank: '',
          memo: '',//备注
          orderType: 'LOA13'
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
        deductionUnit:[],//确认扣减份额
        deductionUnitItem:{
          dealDt:'',
          accNo:'',
          accName:'',
          insuranceContract:'',//保险合同
          valuationType: '',//估值类型
          policyHolder:'',//投保人
          premiumDueDate:'',//保费应缴日
          amountOfPremiumPayable:'', //保费应缴金额
          modeOfBeneficialRight:'', //收益权模式
          principalAmount:'', //本金金额
          incomeAmount:'',//收益金额
          paymentAccount:'',//付款账户
          priceDt:'',//净值日期
          tranPrice:'',//成交单位净值
          tranUnit:'',//成交份额
          accTotalUnit: '',//子账户信托份额
        },
        flowTransfer: [],//确认划款
        flowTransferItem: {
          accNo:'',
          accName:'',
          insuranceContract:'',//保险合同
          policyHolder:'',//投保人
          premiumDueDate:'',//保费应缴日
          amountOfPremiumPayable:'', //保费应缴金额
          mappedAmt:'',//已钩稽金额
          payDt:'',//资金交收日期
          payAmt:'',//资金交收金额
        }
      }
    },
    computed: {
      ...mapState("order", [
        "current","statusName","status","batchId","financedList","taskId"
      ]),
      fundSource:{
        get: function(){
           return this.financedList
        },
        set: function(v){
          this.SET_financedList(v)
        }
      }
        
    },
    filters: {
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
    methods:{
      ...mapMutations("order",["SET_status","RESET_STATE","SET_batchId","SET_financedList","SET_taskId"]),
      ...mapActions("order",["addOrdersOptLogs","ordersOptLogsList","getPolicyInformation","cusAccInfoListByOrgCode"]),
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
        let {orgCode,planPayDt,rcvAccNo,rcvAccName,rcvAccOpenBank,memo} = {...counterParty}
         const trxOrders =  {
          // "tranAmt": tranAmtSum,//总保费金额   需要前端核算每个受益人分担的保费之和
          "applicationTransactionDate": planPayDt,
          "collectionAccountName": rcvAccName,
          "collectionAccountNumber": rcvAccNo,
          "collectionAccountOpeningBank": rcvAccOpenBank,
          "currency": "156",
          memo,
          orgCode,
        }
        let param = {
          formButton: button || 'AUDITS',
          batchId:this.batchId,
          trxOrderPayPermiumCommon:  {...trxOrders,...counterParty,status:this.status},
          sourceOfFunds: []
        }
        if( !validateCounterParty ){
          return
        }
        if( !fundSource.length ){
          this.$message.warning('请至少添加一条资金来源！')
          return
        }
        for (let [index, item] of fundSource.entries()) {

          // 验证申请交易金额总额小于系统可用余额
          let tranAmtSum = 0
          param.sourceOfFunds.push({ beneficiaryInformationList:[],...item })
          for (let child of item.beneficiaryInformationList) {
            tranAmtSum += +child.transactionAmount
            // 不估值项目
            if(item.valuationType == '不估值'){
              
              if(((+child.incomeAmount)+(+child.principalAmount)) != (+child.transactionAmount)){
                this.$message.warning('交易金额不等于本金金额+收益金额')
                return
              }
              if(item.modeOfBeneficialRight == '份额制'){
                if( +child.principalAmount > +child.shareHeldByBeneficiary ){
                  this.$message.warning('本金金额不能超过受益人持有份额')
                  return
                }
              } else {
                // 大池子
                if( +child.principalAmount > +item.principalAmount ){
                  this.$message.warning('本金金额不能超过子账户本金金额')
                  return
                }
              }
            } 
             // 估值项目
            if(item.valuationType == '估值'){
              // 份额制
              if(item.modeOfBeneficialRight == '份额制'){
                if(Math.min((+child.amountAvailable),(+item.queryCapitalAviAmtDto.totalAmt)) < (+child.transactionAmount)){
                  this.$message.warning('交易金额不能超过（受益人可用金额和子账户可用现金余额的最小值）')
                  return
                }
              } else {
                //大池子
                 if((+item.queryCapitalAviAmtDto.totalAmt) < (+child.transactionAmount)){
                  this.$message.warning('交易金额不能超过子账户可用现金余额）')
                  return
                }
              }
            } 
          }
          if(tranAmtSum > +item.queryCapitalAviAmtDto.totalAmt){
            this.$message.warning('交易金额总和不能超过系统可用余额')
            return
          }
          if(tranAmtSum == 0){
            this.$message.warning('请输入交易金额,交易金额总和不能为0')
            return
          }
        }
        this.addBenefitsscribe(param,button)
      },
      // 提交代缴保费订单
      async addBenefitsscribe(data,button) {
        const { result,success } = await saveOrders(data)
        if( success ){
          this.$message.success('提交成功')
          this.SET_batchId( result.batchId )
          this.benefitsBack()
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
          this.$refs.orderOther.uploadFiles(this.counterParty.orderType,this.batchId)
        }
      },
      // 获取代缴保费详情
      async benefitsBack() {
        const { result,success } = await queryOrderInfo({batchId:this.batchId}) 
        if(!success) return
        console.log(result)
        let { sourceOfFunds,taskId,status,trxOrderPayPermiumCommon,createDt,createBy,batchId } = result
        this.counterParty = {
          orgCode: trxOrderPayPermiumCommon.orgCode,// 保险人
          planPayDt: trxOrderPayPermiumCommon.applicationTransactionDate, //申请交易日期
          curCode: 'rmb',// 币种
          rcvAccNo: trxOrderPayPermiumCommon.collectionAccountNumber,// 收款账户
          rcvAccName: trxOrderPayPermiumCommon.collectionAccountName,
          rcvAccOpenBank: trxOrderPayPermiumCommon.collectionAccountOpeningBank,
          memo: trxOrderPayPermiumCommon.memo,//备注
        }
        this.detailData =  {
          batchId,
          createBy,
          createDt,
        }
       
        // 根据保险人选择保险合同
        this.getPolicyInformation({orgCode: trxOrderPayPermiumCommon.orgCode})
        this.SET_taskId(taskId)
        this.SET_status(status)
      
        // 计算交易金额总和
       let sumAmt = 0
        sourceOfFunds.forEach(item=>{
          item.beneficiaryInformationList.forEach(el=>{
            sumAmt += (+el.transactionAmount)
            
          })
        })
        this.sumAmt = sumAmt
        this.fundSource = [...sourceOfFunds]
        this.deductionUnit = [...sourceOfFunds]
        this.flowTransfer = [...sourceOfFunds]
      },
      tempSave(){
        this.submit('TEMPS')
      },
      // 取消订单
      async cancleOrder(){
        if(this.status == '70'){
          this.handleDeductionUnit([],true)
        }
        if(this.status == '10'){
          this.handleFlowTransfer([],true)
        }
      },
      // 扣减份额
      async handleDeductionUnit( deductionUnit=[],isFail ){
        if( !deductionUnit.length ){
          deductionUnit = this.$refs.deductionUnit.fundSource
        }
        if(!this.$refs.deductionUnit.form.dealDt && !isFail){
          this.$message.warning('请选择成交日')
          return
        }
        let param = {
          formButton: isFail ? 'CANCLEPAY' : "CFMPAY",
          status: "70",
          trxOrders: {
            batchId: this.batchId,
            dealDt: this.$refs.deductionUnit.form.dealDt
          },
          sourceOfFunds: []
        }
        for (let [index, item] of deductionUnit.entries()) {
          param.sourceOfFunds.push({ beneficiaryInformationList:[],...item })
          for (let child of item.beneficiaryInformationList) {
            if(!isFail){
              // 估值项目
             if(item.valuationType == '估值'){
              
               if(!child.priceDt){
                 this.$message.warning('请输入净值日期')
                 return
               }
               if(!child.tranPrice){
                 this.$message.warning('请输入成交单位净值')
                 return
               }
             } 
             if(!child.tranUnit){
               this.$message.warning('请输入成交份额')
               return
             }
            }
          }
          
        }
        
        const { result,success } = await confirmedTransfer(param) 
        if( success ){
          this.benefitsBack()
          // 埋点
          this.addOrdersOptLogs({
            batchId:this.batchId,
            optType: isFail ? '取消订单' :'确认份额',
            oprations: isFail ? '取消订单': '确认份额',
            status: isFail ? '已取消' : '未划款',
          })
        }
      },
      // 确认划款
      async handleFlowTransfer( flowTransfer=[],isFail ){
        if( !flowTransfer.length ){
          flowTransfer = this.$refs.flowTransfer.flowTransfer
        }
        if(!isFail){
          for (let { accName,payAmt,mappedAmt,mapCapitalYn } of flowTransfer) {
            if(mapCapitalYn && mapCapitalYn === 'Y'){
              if((+mappedAmt) !== (+payAmt)){
                this.$message.warning(accName + ':【交易付款金额】已勾稽资金流水金额与应付款金额不符！')
                return
              }
            }
          }
        }
        let param = {
          formButton: isFail ? 'CANCLEPAY' : "CFMPAY",
          status: "10",
          trxOrders: {
            batchId: this.batchId,
          
          },
          sourceOfFunds: []
        }
        for (let [index, item] of flowTransfer.entries()) {
          param.sourceOfFunds.push({ beneficiaryInformationList:[],...item })
        }
        const { result,success } = await affirmDrawing(param)
        if( success ){
          this.benefitsBack()
          // 埋点
          this.addOrdersOptLogs({
            batchId:this.batchId,
            optType: isFail ? '取消订单' :'确认划款',
            oprations: isFail ? '取消订单': '确认划款',
            status: isFail ? '已取消' : '交易成功',
          })
        }
      },
       // 强制撤回
      async mandatoryWithdrawal(){
        this.benefitsBack()
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
      },
      hisPageInited(){

      }
    },
    props:{
      // 审核单业务key
      businessKey:{
        default: ''
      }
    },
    mounted(){
    },
    created(){
      if( this.$route.query.batchId ){
        // 获取详情
        this.SET_batchId(this.$route.query.batchId)
        this.ordersOptLogsList()
        this.benefitsBack()
      } else {
        this.RESET_STATE()
      }
      // 审核单中看订单信息
      if( this.businessKey ){
        const batchId = this.businessKey.split(':')[1]
        this.SET_batchId(batchId)
        this.benefitsBack()
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>