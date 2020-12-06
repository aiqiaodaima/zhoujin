/**
  费用支付
*/
<template>
  <div>
     <!-- 审核单中看订单信息 -->
    <div v-if="businessKey">
      <CounterParty ref='counterParty' :disabled='status!=="80"' :form='counterParty'/>
      <FundSource ref='fundSource' :disabled='status!=="80"'  :fundSource='fundSource' :fundSourceItem='fundSourceItem' :hasProCode='false'/>
      <OrderOther ref='orderOther' :disabled='status!=="80"'/>
    </div>
    <!-- 订单申请 -->
    <page-layout v-if="!businessKey"  :title="`费用支付-${statusName}`">
      <BasicInformation slot="headerContent" :detailData='detailData' />
      <BasicInformationExtra slot="extra" :sumAmt='sumAmt' />
      <BasicInformationAction slot="action"
        @submit="submit"
        @tempSave="tempSave"
        @comfirmTransfer="handleTransferMoney"
        @cancleOrder="cancleOrder"
        @mandatoryWithdrawal="mandatoryWithdrawal"
        />
      <FlowProgress :steps="steps"/>
      <a-collapse accordion style="margin-top:12px" :bordered="false" :activeKey='`${current}`' @change="changeCollapse">
        <a-collapse-panel header="请填写申请单" key="0">
          <CounterParty ref='counterParty' :disabled='status!=="80"&&status!=="5"' :form='counterParty'/>
          <FundSource ref='fundSource' :disabled='status!=="80"&&status!=="5"'  :fundSource='fundSource' :fundSourceItem='fundSourceItem' :hasProCode='false'/>
          <OrderOther ref='orderOther' :disabled='status!=="80"&&status!=="5"'/>
        </a-collapse-panel>
        <a-collapse-panel header="申请单审核中" key="1" :bordered="false" v-if="current>0">
          <WkfAuditHis ref="wkfAuditHis" @pageInited="hisPageInited"/>
        </a-collapse-panel>
        <a-collapse-panel header="核对流水确认划款" key="2" v-if="current>1">
          <TransferMoney ref='transferMoney' :transferMoney="transferMoney" 
          @handleTransferMoney="handleTransferMoney" 
          @handleUpdate="getFeeInfo"
          :transferMoneyItem="transferMoneyItem" :disabled='status!=10' />
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
    CounterParty,FundSource,OrderOther,OperationLog,CheckFlow,TransferMoney
  } from './modules'
  import { addFee,getFeeInfo,confirmOrCancelFee,mandatoryWithdrawal} from '@/api/BiApi'
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
      status:['0','101']
    },
    {
      id: '2',
      name: '核对流水确认划款',
      status:['10']
    },
    {
      id: '3',
      name: '交易完成',
      status:['15','25','60','50','55']
    }
  ]
  // 增值税字段
  const vat = {
    vatAmt: '',//增值税
    vatBase:'',//增值税税基
    eduTax:'',//税金及附加-教育费附加
    localEduTax:'',// 税金及附加-地方教育费附加
    urbanTax: '',//税金及附加-城建税
  }
  const fundSourceItem = {
    editable: true,
    isNew: true,
    prjCode:'',
    trustPrjCode:'',
    accNo: '', //子账户
    accName: '',
    totalAmt: '--',
    updateDate: '--',
    savingBal:'--',
    flowDateStr: '--',
    planTranAmt:0, //交易金额
    odrCode: '',
    payAccNo:'',// 付款账户信息
    payAccName:'',// 付款账户信息
    payAccOpenBank:'',// 付款账户信息
    capitalSrc:'',//资金来源
    payBankCode: '',
  }
  export default {
    name: "Payment",
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
      TransferMoney,
      WkfNextUserModal,
      WkfAuditHis
    },
    inject:['closeCurrent'],
    mixins: [biUploadMixin],
    data () {
      return {
        fundSource:[],//资金来源
        fundSourceItem: fundSourceItem,
        steps: steps, //步骤
        fileList:[],
        checkFlow:[], //审核流程表格
        counterParty: {
          orderType:'LOA03',
          tranSubtypeCode: '',//费用类型
          feeTypeCode:'',//费用明细
          feeTypeName:'',//费用名称
          payObject: '',//结算对象
          ifSelfPrepay: '',//资金交收方式
          startDt: '',//费用区间起始日
          endDt: '',//费用区间结束日
          termDays: '',//天数
          rcvAccNameFee: '',//收款账户
          rcvAccOpenBankFee: '',
          rcvAccNoFee: '',
          planPayDt: new Date().toLocaleDateString().split('/').join('-'), //申请交易日期
          rcvBankCode: '',
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
        transferMoney:[],//核对流水确认划款表格数据
        transferMoneyItem: {
          accName:'',
          totalAmt:'',
          savingBal:'',
          tranAmt:'',
          tranDt:'',
          capitalSrc:'',
          payAccNo:'',
          payAccOpenBank:'',
          payAccName:'',
          mappedAmt: '',// 已钩稽金额
        },
        loading: false,
      }
    },
    computed: {
      ...mapState("order", [
        "current","statusName","status","batchId","taskId"
      ]),
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
      ...mapMutations("order",["SET_status","RESET_STATE","SET_batchId",'SET_taskId']),
      ...mapActions("order",["addOrdersOptLogs","ordersOptLogsList","findFeeNamesMsg"]),
      // 监听费用类型改变
      changeFeeTypeCode(feeCode){
        if( feeCode == 'LOA0304' ){
          this.fundSourceItem = {...fundSourceItem,...vat}
        } else {
          this.fundSourceItem = fundSourceItem
        }
      },
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
      submit( button) {
        const counterParty = this.$refs.counterParty.form
        const validateCounterParty = this.$refs.counterParty.validateCounterParty()
        const fundSource = this.$refs.fundSource.fundSource
        if( !validateCounterParty ){
          return
        }
        if( !fundSource.length ){
          this.$message.warning('请至少添加一条资产来源！')
          return
        }
        for( let { totalAmt,planTranAmt,accNo,capitalSrc } of fundSource ){
          if( !capitalSrc ){
            this.$message.warning('请选择资金来源')
            return
          }
          if( !planTranAmt ){
            this.$message.warning('请输入交易金额')
            return
          }
          // 资金来源为外部支付时不需要选择子账户
          if(capitalSrc != 5 ){
            if( !accNo ){
              this.$message.warning('请选择子账户')
              return
            }
           
            if(+planTranAmt > totalAmt){
              this.$message.warning('交易金额不能超过可用余额')
              return
            }
          }
        }
        const trxOrders =  {
          
        }
        let param = {
          formButton: button ? button: "AUDITS" ,
          trxOrdersFees:  {...trxOrders,...counterParty,status:this.status,batchId:this.batchId,planTranDt:counterParty.planPayDt,rcvAccName: counterParty.rcvAccNameFee,rcvAccOpenBank: counterParty.rcvAccOpenBankFee,rcvAccNo:counterParty.rcvAccNoFee },
          orderAccInfoResult: fundSource
        }
        console.log(param)
        this.addFee(param,button)
      },
      // 提交费用支付订单
      async addFee(data,button) {
        if(this.loading){
          return
        }
        this.loading = true
        const { result } = await addFee(data)
        this.$message.success('提交成功')
        this.loading = false
        this.SET_batchId( result.batchId )
        this.getFeeInfo()
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
      },
      // 获取费用支付详情
      async getFeeInfo() {
        const { result } = await getFeeInfo({batchId:this.batchId})
        console.log(result)
        let { trxOrdersFees,trxOrdersFeeFeedBackDto,taskId } = result
        this.SET_taskId(taskId)

        this.SET_status(trxOrdersFeeFeedBackDto)
        if(trxOrdersFees.tranSubtypeCode){
          this.findFeeNamesMsg({ tranSubtypeCode:trxOrdersFees.tranSubtypeCode })
        }
        for (let key in trxOrdersFees) {
          if( this.counterParty.hasOwnProperty(key) ){
            this.counterParty[key] = trxOrdersFees[key]
          }
          if( this.detailData.hasOwnProperty(key) ){
            this.detailData[key] = trxOrdersFees[key]
          }
        }
        this.counterParty.planPayDt = trxOrdersFees.planTranDt
        this.counterParty.rcvAccNameFee = trxOrdersFees.rcvAccName
        this.counterParty.rcvAccNoFee = trxOrdersFees.rcvAccNo
        this.counterParty.rcvAccOpenBankFee = trxOrdersFees.rcvAccOpenBank
        let fundSource = []
        let sumAmt = 0
        for (let { prjCode,accNo,accName,odrCode,planTranAmt,payAccNo,payAccName,payAccOpenBank,capitalSrc,totalAmt,updateDate,savingBal,flowDateStr,trustPrjCode,payBankCode } of trxOrdersFeeFeedBackDto) {
          fundSource.push({
            odrCode,
            editable: false,
            isNew: true,
            key: fundSource.length,
            prjCode,
            trustPrjCode,
            accNo,
            accName,
            planTranAmt, // 交易金额
            totalAmt,
            updateDate,
            savingBal,
            flowDateStr,
            payAccNo,// 付款账户信息
            payAccOpenBank,// 付款账户信息
            payAccName,// 付款账户信息
            capitalSrc,//资金来源
            payBankCode,
          })

          sumAmt += (+planTranAmt)
          this.sumAmt = sumAmt
        }
        this.fundSource = fundSource
        this.transferMoney = [...trxOrdersFeeFeedBackDto]
      },
      hisPageInited(){},
      // 取消订单
      async cancleOrder(){
        this.handleTransferMoney([],true)
      },
       // 确认划款
      async handleTransferMoney( transferMoney=[],isFail ){
        if( !transferMoney.length ){
          transferMoney = this.$refs.transferMoney.transferMoney
        }
        let param = {
          formButton:"Y",
          orderAccInfoResult: []
        }
        console.log(transferMoney)
        for (let { accNo,accName,tranDt,odrCode,tranAmt,capitalSrc,mapCapitalYN,mappedAmt,planTranAmt } of transferMoney) {
          if(!isFail){
            // if(!tranAmt){
            //   this.$message.warning('请输入交易金额')
            //   return
            // }
            if(!tranDt){
              this.$message.warning('请选择交易日期')
              return
            }
            if(mapCapitalYN && mapCapitalYN === 'Y' && capitalSrc !== '5'){
              if((+mappedAmt) !== (+planTranAmt)){
                this.$message.warning('【交易付款金额】已勾稽资金流水金额与应付款金额不符！')
                return
              }
            }
          }
          let item = { accNo,tranDt,odrCode,tranAmt:planTranAmt,capitalSrc }
          
          param.orderAccInfoResult.push(item)
        }
        // 交易取消    
        if(isFail){
          param.formButton = 'N'
        }
        const { result,success } = await confirmOrCancelFee(param)
        if( success ){
          this.$message.success('操作成功')
          this.getFeeInfo()
          // 埋点
          this.addOrdersOptLogs({
            batchId:this.batchId,
            optType: isFail ? '取消订单' :'确认划款',
            oprations: isFail ? '取消订单': '确认划款',
            status: isFail ? '已取消' : '交易完成',
          })
        }
      },
      // 暂存
      tempSave(){
        this.submit('TEMPS')
      },
      // 强制撤回
      async mandatoryWithdrawal(){
        // const { result,success } = await mandatoryWithdrawal({batchId:this.batchId}) 
        // if( success ){
          this.getFeeInfo()
          // 埋点
          this.addOrdersOptLogs({
            batchId:this.batchId,
            optType: '强制撤回',
            oprations: '强制撤回',
            status:  '待提交',
            })
        // }
      },
      wkfUserComplete () {
        this.$nextTick(() => {
          this.$router.replace({path:"/order/orderTrack"});
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
      if( this.$route.query.batchId ){
        // 获取详情
        this.SET_batchId(this.$route.query.batchId)
        this.ordersOptLogsList()
        this.getFeeInfo()
      } 
      // 审核单中看订单信息
      if( this.businessKey ){
        const batchId = this.businessKey.split(':')[1]
        this.SET_batchId(batchId)
        this.getFeeInfo()
      }
    },
    mounted(){
       // 监听procode变化
      this.$bus.$on('changeFeeTypeCode',(feeCode)=>{
        this.changeFeeTypeCode(feeCode)
      })
    }

  }
</script>

<style lang="stylus" scoped>

</style>