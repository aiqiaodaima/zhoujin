/** 
  信托利益分配分配处理事务单
*/
<template>
  <div>
     <!-- 审核单中看订单信息 -->
    <div v-if="businessKey">
      <CounterParty ref='counterParty' title='申请单信息' :disabled='status!=="80"' :form='counterParty'/>
      <FundSourceShow ref='fundSource' :disabled='status!=="80"' :fundSource='fundSource' :fundSourceItem='fundSourceItem'/>
      <OrderOther ref='orderOther' :disabled='status!=="80"'/>
    </div>
    <!-- 订单申请 -->
    <page-layout v-if="!businessKey"  :title="`信托利益分配-${statusName}`">
      <BasicInformation slot="headerContent" :detailData='detailData' />
      <BasicInformationExtra slot="extra" :sumAmt='sumAmt' />
      <BasicInformationAction slot="action" 
        @submit="submit" 
        @comfirmUnit="handleDeductionUnit" 
        @cancleOrder="cancleOrder"
        @comfirmTransfer="handleTransferMoney"
        @tempSave="tempSave"
        @mandatoryWithdrawal="mandatoryWithdrawal"
        />
      <FlowProgress :steps="steps"/>
      <a-collapse accordion style="margin-top:12px" :bordered="false" :activeKey='`${current}`' @change="changeCollapse">
        <a-collapse-panel header="请填写申请单" key="0">
          <CounterParty ref='counterParty' title='申请单信息' :disabled='status!=="80"&&status!=="5"' :form='counterParty'/>
          <FundSourceShow ref='fundSource' :disabled='status!=="80"&&status!=="5"' :fundSource='fundSource' :fundSourceItem='fundSourceItem'/>
          <OrderOther ref='orderOther' :disabled='status!=="80"&&status!=="5"'/>
        </a-collapse-panel>
        <a-collapse-panel header="申请单审核中" key="1" :bordered="false" v-if="current>0">
          <WkfAuditHis ref="wkfAuditHis" @pageInited="hisPageInited"/>
        </a-collapse-panel>
        <a-collapse-panel header="确认扣减份额" key="2" v-if="current>1">
          <DeductionUnit ref='deductionUnit' :disabled='status!=="70"' :deductionUnit="deductionUnit" 
          @handleDeductionUnit="handleDeductionUnit" :deductionUnitItem="deductionUnitItem"/>
        </a-collapse-panel>
        <a-collapse-panel header="核对流水确认划款" key="3" v-if="current>2">
          <TransferMoney ref='transferMoney' :disabled='status!=="10"'  :transferMoney="transferMoney"
          @handleTransferMoney="handleTransferMoney" :transferMoneyItem="transferMoneyItem" @handleUpdate='benefitsBack'/>
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
    CounterParty,FundSourceShow,OrderOther,OperationLog,CheckFlow,DeductionUnit,TransferMoney
  } from './modules'
  import { addBenefitsscribe,benefitsBack,transferOrCancel,benefitsConfirmOrCancel} from '@/api/BiApi'
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
      status:['15','25','50','55','60']
    }
  ]
  export default {
    name: "DistributeManage",
    components: {
      PageLayout,
      BasicInformation,
      BasicInformationExtra,
      BasicInformationAction,
      FlowProgress,
      CounterParty,
      FundSourceShow,
      OrderOther,
      OperationLog,
      CheckFlow,
      DeductionUnit,
      TransferMoney,
      WkfNextUserModal,
      WkfAuditHis
    },
    mixins: [biUploadMixin],
    inject:['closeCurrent'],
    data () {
      return {
        steps: steps, //步骤
        // fundSource:[],//资金来源
        fundSourceItem:{
          accName:'',
          bnfModeName:'',
          totalAmt:'',
          profitAmt:'',
          bnfAccAmt:'',//受益人持有金额（含在途）
          bnfAvaSaving:'',
          tranAmt:'',
          tranInv:'',
          pfitInv:'',
          accTotalUnit:'',//子账户信托份额
          bnfTotalUnit:'',//受益人持有份额

        },
        fileList:[],
        checkFlow:[], //审核流程表格
        counterParty: {
          orderType:'LOA04',
          prjCode:'', //项目名称
          voaType: '',//估值类型
          partyCode: '',//受益人
          partyName: '',
          distTypeCode: '',//分配名称
          distType: '',//分配类型
          planPayDt: new Date().toLocaleDateString().split('/').join('-'), //申请交易日期
          curCode: 'rmb',// 币种
          tranAmt: '', // 申请交易金额
          payAccNo: '',// 付款账户
          payAccName: '',
          payAccOpenBank: '',
          rcvAccNo: '',// 收款账户
          rcvAccName: '',
          rcvAccOpenBank: '',
          recAdoptYn: '',//资格验证
          memo: '',//备注
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
          priceDt:'',
          accName:'',
          bnfModeName:'',
          tranAmt:'',
          accTotalUnit:'',
          bnfTotalUnit:'',
          tranUnit:'',
          tranPrice:'',
          // tranDt:'',
        },
        transferMoney: [],//确认划款
        transferMoneyItem: {
          // refContractNo:'',
          // accName:'',
          // zzhye:'',
          // yhkye:'',
          tranAmt:'',
          dealDt:'',
          // transferFee:'',
          mappedAmt:''
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
      ...mapMutations("order",["SET_status","RESET_STATE","SET_batchId","SET_financedList",'SET_taskId']),
      ...mapActions("order",["addOrdersOptLogs","ordersOptLogsList","chooseDistType","choosePrject"]),
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
      hisPageInited(){},
      submit(button) {
        //button 保存草稿TEMPS
        const counterParty = this.$refs.counterParty.form
        const validateCounterParty = this.$refs.counterParty.validateCounterParty()
        const fundSource = this.$refs.fundSource.fundSource
        if( !validateCounterParty ){
          return
        }
        if( !fundSource.length ){
          this.$message.warning('此受益人没有可分配的资金来源！')
          return
        }
        // 验证申请交易金额等于交易金额总和
        let tranAmtSum = 0
        for( let {tranAmt,tranInv,pfitInv } of fundSource ){
          // if( !tranAmt ){
          //   this.$message.warning('请输入交易金额')
          //   return
          // }
          
          if(counterParty.voaType != 1 ){

            // if( !tranInv ){
            //   this.$message.warning('请输入本金金额')
            //   return
            // }
            // if( !pfitInv ){
            //   this.$message.warning('请输入收益金额')
            //   return
            // }
          }
          tranAmtSum += +tranAmt
        }
        if( tranAmtSum != +counterParty.tranAmt ){
          this.$message.warning('交易金额总和不等于申请交易金额')
          return
        }
        const trxOrders =  {
          trantypeCode:'LOA04',
          tranSubtypeCode:counterParty.distType,
        }
        let param = {
          formButton: button || '',
          trxOrdersBenefits:  {...trxOrders,...counterParty,status:this.status,batchId:this.batchId},
          trxOrdersBenefitsList: fundSource
        }
        this.addBenefitsscribe(param,button)
      },
      // 提交分配处理订单
      async addBenefitsscribe(data,button) {
        const { result,success } = await addBenefitsscribe(data)
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
      // 获取分配处理详情
      async benefitsBack() {
        const { result } = await benefitsBack({batchId:this.batchId}) 
        let { trxOrderBenefits,trxOrdersBenefitsList,taskId } = result
        this.SET_taskId(taskId)
        for (let key in trxOrderBenefits) {
          if( this.counterParty.hasOwnProperty(key) ){
            this.counterParty[key] = trxOrderBenefits[key]
          }
          if( this.detailData.hasOwnProperty(key) ){
            this.detailData[key] = trxOrderBenefits[key]
          }
        }
        this.SET_status(trxOrderBenefits.status)
        this.counterParty.distType = trxOrderBenefits.tranSubtypeCode
        // this.sumAmt = trxOrderBenefits.tranAmt
        this.chooseDistType({distType:trxOrderBenefits.tranSubtypeCode})
        this.choosePrject({prjCode:trxOrderBenefits.prjCode})
        this.$bus.$emit('voaType',trxOrderBenefits.voaType)

        let fundSource = []
        let statusarr = []
        let sumAmt = 0
        for (let { prjCode,accNo,accName,totalAmt,savingBal,odrCode,flowDateStr,updateDate,bnfMode,accTotalUnit,bnfTotalUnit,
        bnfModeName,profitAmt,bnfAccAmt,bnfAvaSaving, tranAmt,tranInv,pfitInv,status } of trxOrdersBenefitsList) {
          fundSource.push({
            editable: false,
            prjCode,
            accNo,
            accName,
            totalAmt,
            accTotalUnit,
            bnfTotalUnit,
            updateDate,
            savingBal,
            flowDateStr,
            key: fundSource.length,
            odrCode,
            bnfModeName,
            bnfMode,
            profitAmt,
            bnfAccAmt,
            bnfAvaSaving,
            tranAmt,
            tranInv,
            pfitInv
          })
           //  跨过审批流
          // if(status == 0){
          //   statusarr.push({status:'70'}) 
          // } else {
             statusarr.push({status}) 
          // } 
          sumAmt += (+tranAmt)
        }
        this.counterParty.tranAmt = sumAmt
        this.sumAmt = sumAmt
        // this.SET_status(statusarr)
        this.fundSource = fundSource
        this.deductionUnit = [...trxOrdersBenefitsList]
        this.transferMoney = [...trxOrdersBenefitsList]

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
          this.handleTransferMoney([],true)
        }
      },
      // 扣减份额
      async handleDeductionUnit( deductionUnit=[],isFail ){
        if( !deductionUnit.length ){
          deductionUnit = this.$refs.deductionUnit.deductionUnit
        }
        let param = {
          formButton: isFail ? 'CANCLEPAY' : "CFMPAY",
          status: "70",
          trxOrders: {
            batchId: this.batchId
          },
          trxOrdersBenefitsList: []
        }
        for (let { tranPrice,accNo,tranUnit,dealDt,odrCode,prjCode,priceDt,tranAmt,partyCode,bnfMode } of deductionUnit) {
          if(!isFail){
            if(!dealDt){
              this.$message.warning('请选择成交日')
              return
            }
            if(!priceDt){
              this.$message.warning('请选择净值日期')
              return
            }
            if(!tranUnit){
              this.$message.warning('请输入扣减份额')
              return
            }
            if(!tranPrice){
              this.$message.warning('请输入成交单位价格')
              return
            }
          }
          let item = {
            odrCode,prjCode,accNo,priceDt,dealDt,tranAmt,tranPrice,tranUnit,partyCode,bnfMode
          }
          param.trxOrdersBenefitsList.push(item)
        }
        const { result,success } = await benefitsConfirmOrCancel(param) 
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
      async handleTransferMoney( transferMoney=[],isFail ){
        if( !transferMoney.length ){
          transferMoney = this.$refs.transferMoney.transferMoney
        }
        let param = {
          formButton: isFail ? 'CANCLEPAY' : "CFMPAY",
          status: "10",
          trxOrders: {
            batchId: this.batchId
          },
          trxOrdersBenefitsList: []
        }
        for (let { accNo,tranAmt,dealDt,odrCode,prjCode,partyCode,bnfMode,mapCapitalYN,mappedAmt } of transferMoney) {
          if(!isFail){
            if(!dealDt){
              this.$message.warning('请选择成交日')
              return
            }
            // if(!tranAmt){
            //   this.$message.warning('请输入成交单位价格')
            //   return
            // }
            if(mapCapitalYN && mapCapitalYN === 'Y'){
              if((+mappedAmt) !== (+tranAmt)){
                this.$message.warning('【交易付款金额】已勾稽资金流水金额与应付款金额不符！')
                return
              }
            }
          }
          let item = {
            odrCode,prjCode,accNo,dealDt,tranAmt,partyCode,bnfMode
          }
          param.trxOrdersBenefitsList.push(item)
        }
        const { result,success } = await benefitsConfirmOrCancel(param) 
        if( success ){
          this.benefitsBack()
          // 埋点
          this.addOrdersOptLogs({
            batchId:this.batchId,
            optType: isFail ? '取消订单' :'确认划款',
            oprations: isFail ? '取消订单': '确认划款',
            status: isFail ? '已取消' : '交易完成',
          })
        }
      },
      // 强制撤回
      async mandatoryWithdrawal(){
        // const { result,success } = await mandatoryWithdrawal({batchId:this.batchId}) 
        // if( success ){
          this.benefitsBack()
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
      // 监听项目的估值类型变化 voaType：1为估值
      this.$bus.$on('voaType',(voaType)=>{
        // this.voaType = voaType
        // 估值
        if(voaType==1){
          // this.columns = [...this.fundSourceColumns.slice(0,7)]
          delete this.fundSourceItem.pfitInv
          delete this.fundSourceItem.tranInv
          delete this.fundSourceItem.profitAmt
          delete this.fundSourceItem.bnfTotalUnit
          delete this.fundSourceItem.accTotalUnit

          this.fundSourceItem = {...this.fundSourceItem,bnfAccAmt:'',bnfAvaSaving:''}
        } else {
          delete this.fundSourceItem.bnfAccAmt
          delete this.fundSourceItem.bnfAvaSaving
          this.fundSourceItem = {...this.fundSourceItem,pfitInv:'',tranInv:'',profitAmt:'',bnfTotalUnit:'',accTotalUnit:''}
          // this.columns = [...this.fundSourceColumns]
        }
      })
    }
  }
</script>

<style lang="stylus" scoped>

</style>