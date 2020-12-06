/**
  赎回订单
*/ 
<template>
  <div>
    <!-- 审核单中看订单信息 -->
    <div v-if="businessKey">
      <CounterParty ref='counterParty' :disabled='status!=="80"&&status!=="5"' :form='counterParty'/>
      <SelectContract ref='selectContract' :disabled='status!=="80"&&status!=="5"' :selectContract='selectContract' :selectContractItem='selectContractItem'/>
      <OrderOther ref='orderOther' :disabled='status!=="80"&&status!=="5"'/>
    </div>
    <!-- 订单申请 -->
    <page-layout v-if="!businessKey"  :title="`赎回申请-${statusName}`">
      <BasicInformation slot="headerContent" :detailData='detailData' />
      <BasicInformationExtra slot="extra" :sumAmt='sumAmt' />
      <BasicInformationAction slot="action"
        @submit="submit"
        @tempSave="tempSave"
        @comfirmUnit="comfirmUnit"
        @cancleOrder="cancleOrder"
        @sureAccount="handleSureAccount"
        @tradeFail="tradeFail"
        @mandatoryWithdrawal="mandatoryWithdrawal"
        />
      <FlowProgress :steps="steps"/>
      <a-collapse accordion style="margin-top:12px" :bordered="false" :activeKey='`${current}`' @change="changeCollapse">
        <a-collapse-panel header="请填写申请单" key="0">
          <CounterParty ref='counterParty' :disabled='status!=="80"&&status!=="5"' :form='counterParty'/>
          <SelectContract ref='selectContract' :disabled='status!=="80"&&status!=="5"' :selectContract.sync='selectContract' :selectContractItem='selectContractItem'/>
          <OrderOther ref='orderOther' :disabled='status!=="80"&&status!=="5"'/>
        </a-collapse-panel>
        <a-collapse-panel header="申请单审核中" key="1" :bordered="false" v-if="current>0">
        <WkfAuditHis ref="wkfAuditHis" @pageInited="hisPageInited"/>
        </a-collapse-panel>
        <a-collapse-panel header="确认扣减份额" key="2" v-if="current>1">
          <DeductionUnit ref='deductionUnit' :disabled='status!=="70"'  :deductionUnit="deductionUnit"
          @handleDeductionUnit="handleDeductionUnit" :deductionUnitItem="deductionUnitItem"/>
        </a-collapse-panel>
        <a-collapse-panel header="核对流水确认到账" key="3" v-if="current>2">
          <SureAccount ref='sureAccount' :disabled='status!=="75"'  :sureAccount="sureAccount"
          @handleSureAccount="handleSureAccount" @handleUpdate='gettranSellInfo'/>
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
    CounterParty,SelectContract,OrderOther,OperationLog,CheckFlow,DeductionUnit,SureAccount
  } from './modules'
  import { addTranSell,gettranSellInfo,confirmOrCancel,mandatoryWithdrawal} from '@/api/BiApi'
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
      name: '确认扣减份额',
      status:['70']
    },
    {
      id: '3',
      name: '核对流水确认到账',
      status:['75']
    },
    {
      id: '4',
      name: '交易完成',
      status:['15','20','25','60','50','55']
    }
  ]

  export default {
    name: "CreateRedeem",
    components: {
      PageLayout,
      BasicInformation,
      BasicInformationExtra,
      BasicInformationAction,
      FlowProgress,
      CounterParty,
      SelectContract,
      OrderOther,
      OperationLog,
      CheckFlow,
      DeductionUnit,
      SureAccount,
      WkfNextUserModal,
      WkfAuditHis
    },
    mixins: [biUploadMixin],
    inject:['closeCurrent'],
    data () {
      return {
        selectContract:[],//资产合同
        selectContractItem:{
          editable: true,
          isNew: true,
          refNo: '',
          refContractNo:'',
          prjCode: '',
          trustPrjCode: '',
          accNo: '',
          accName: '',
          unit: '',
          transferFee:'',
          planTranUnit:'',
          proCode: '',
          files: [],// 上传
        },
        steps: steps, //步骤
        fileList:[],
        checkFlow:[], //审核流程表格
        counterParty: {
          proCode:'', //资产名称
          issuerBran: '',//发行机构
          expReturnRate: '0',//年化预期收益率
          planPayDt: new Date().toLocaleDateString().split('/').join('-'), //申请交易日期
          deciMakerType: '', // 投资决策人
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
          refContractNo:'',
          accName:'',
          prjCode:'',
          tranUnit:'',
          tranPrice:'',
          tranDt:'',
          planTranUnit:''
        },
        sureAccount: [],//确认到账
        sureAccountItem: {
          refContractNo:'',
          accName:'',
          zzhye:'',
          yhkye:'',
          payAmt:'',
          payDt:'',
          transferFee:'',
          mappedAmt:''
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
    filters: {
    },
    methods:{
      ...mapMutations("order",["SET_status","RESET_STATE","SET_batchId",'SET_taskId']),
      ...mapActions("order",["addOrdersOptLogs","ordersOptLogsList"]),
      changeCollapse(key){
        // 获取文件
        if(key == 0){
          this.$nextTick(() => {
            this.$refs.selectContract.getFiles('INV06_selectContract', this.batchId)
            this.$refs.orderOther.getFiles('INV06_orderOther', this.batchId)
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
      submit( button) {
        const counterParty = this.$refs.counterParty.form
        const validateCounterParty = this.$refs.counterParty.validateCounterParty()
        const selectContract = this.$refs.selectContract.selectContract
        if( !validateCounterParty ){
          return
        }
        if( !selectContract.length ){
          this.$message.warning('请至少添加一条资产合同！')
          return
        }
        for( let { unit,planTranUnit,refContractNo } of selectContract ){
          if( !refContractNo ){
            this.$message.warning('请选择产品购买合同号')
            return
          }
          if( !planTranUnit ){
            this.$message.warning('请输入交易金额')
            return
          }
          if(+planTranUnit > unit){
            this.$message.warning('交易金额不能超过可用余额')
            return
          }
          // this.$refs.selectContract.uploadFiles(`INV06_${refContractNo}`,this.batchId)
        }
        const trxOrders =  {
          "proCode": "",
          "priceYn":counterParty.incomeType == 0 ? "N" : "Y",
          "deciMakerType":counterParty.deciMakerType,
          "tranCurCode":"156"
          }
        let param = {
          "formButton": button ? button: "AUDITS" ,
          "status": "80",
          trxOrders:  {...trxOrders,...counterParty,status:this.status,batchId:this.batchId},
          trxOrdersTranssellList: selectContract
        }
        // 上传文件
        this.$refs.selectContract.uploadFiles('INV06_selectContract',this.batchId)
        this.$refs.orderOther.uploadFiles('INV06_orderOther',this.batchId)

        this.addTranSell(param,button)
      },
      // 提交赎回订单
      async addTranSell(data,button) {
        const { result } = await addTranSell(data)
        this.$message.success('提交成功')
        this.SET_batchId( result.batchId )
        this.gettranSellInfo()
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
      },
      // 获取赎回详情
      async gettranSellInfo() {
        const { result } = await gettranSellInfo({batchId:this.batchId})
        let { trxOrders,trxOrdersTranssellList,taskId } = result
        this.SET_taskId(taskId)
       
        for (let key in trxOrders) {
          if( this.counterParty.hasOwnProperty(key) ){
            this.counterParty[key] = trxOrders[key]
          }
          if( this.detailData.hasOwnProperty(key) ){
            this.detailData[key] = trxOrders[key]
          }
        }

        let selectContract = []
        let sumAmt = 0
        let statusarr = []
        for (let { refNo,refContractNo,prjCode,unit,transferFee,accNo,planTranUnit,accName,planTranAmt,trustPrjCode,odrCode,proCode,status } of trxOrdersTranssellList) {
          selectContract.push({
            odrCode,
            editable: false,
            isNew: true,
            refNo,
            refContractNo,
            prjCode,
            trustPrjCode,
            accNo,
            accName,
            unit,
            transferFee,
            planTranUnit,
            key: selectContract.length,
            proCode,
          })
          sumAmt += (+planTranUnit)
          this.sumAmt = sumAmt

          //  跨过审批流
          // if(status == 0){
          //   statusarr.push({status:'70'}) 
          // } else {
             statusarr.push({status})
          // } 

        }
        this.SET_status(statusarr)
        this.selectContract = selectContract

        trxOrdersTranssellList.forEach(item=>{
          item.tranPrice = item.tranPrice ? item.tranPrice : 1
          item.tranDt = item.tranDt ? item.tranDt : new Date().toLocaleDateString().split('/').join('-')
        })

        this.deductionUnit = [...trxOrdersTranssellList]
        this.sureAccount = [...trxOrdersTranssellList]

        // if(this.$refs.selectContract){
        //   // 获取文件
        //   this.$refs.selectContract.getFiles('INV06_selectContract', this.batchId)
        //   this.$refs.orderOther.getFiles('INV06_orderOther', this.batchId)
        // }
      },
      // 确认份额
      async comfirmUnit(){
        this.handleDeductionUnit()
      },
      // 取消订单
      async cancleOrder(){
        this.handleDeductionUnit([],true)
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
          trxOrdersTranssellList: []
        }
        for (let { tranPrice,accNo,tranUnit,tranDt,odrCode,prjCode,proCode,refNo,refContractNo,tranAmt,unit,planTranUnit } of deductionUnit) {
          if(!isFail){
            // if(!tranUnit){
            //   this.$message.warning('请输入扣减份额')
            //   return
            // }
            if(!tranPrice){
              this.$message.warning('请输入成交单位价格')
              return
            }
            if(!tranDt){
              this.$message.warning('请选择实际成交日')
              return
            }
            if(+tranUnit > ((+unit)+ (+planTranUnit) )){
              this.$message.warning('扣减份额不能超过持有份额')
              return
            }
          }

          let item = {
            odrCode,
            prjCode,
            accNo,
            proCode,
            refNo,
            refContractNo,
            tranAmt,
            tranDt,
            tranPrice,
            tranUnit
          }

          param.trxOrdersTranssellList.push(item)
        }
        // 交易取消
        if(isFail){ 
          param.formButton = 'CANCLEPAY'
        }
        const { result,success } = await addTranSell(param)
        if( success ){
          this.$message.success('操作成功')
          this.gettranSellInfo()
          // 埋点
          this.addOrdersOptLogs({
            batchId:this.batchId,
            optType: isFail ? '取消订单' :'确认份额',
            oprations: isFail ? '取消订单': '确认份额',
            status: isFail ? '已取消' : '未到账',
          })
        }
      },
      // 交易失败
      tradeFail(){
        this.handleSureAccount([],true)
      },
      // 确认到账
      async handleSureAccount(sureAccount=[],isFail){

        if( !sureAccount.length ){
          sureAccount = this.$refs.sureAccount.sureAccount
        }
        let param = {
          formButton: isFail ? 'CANCLEPAY' : "CFMPAY",
          status: "75",
          trxOrders: {
            batchId: this.batchId
          },
          trxOrdersTranssellList: []
        }
        for (let { transferFee,odrCode,accName,payAmt,tranAmt,payDt,mapCapitalYN,mappedAmt } of sureAccount) {
          if(!isFail){
            if(!payDt){
              this.$message.warning('请选择资金交收日期')
              return
            }
            if(mapCapitalYN && mapCapitalYN === 'Y'){
              if((+mappedAmt) !== (+tranAmt)){
                this.$message.warning(accName + ':【交易付款金额】已勾稽资金流水金额与应付款金额不符！')
                return
              }
            }
          }
          let item = {
            odrCode,
            payAmt,
            payDt,
            transferFee
          }
          // 交易失败
          if(isFail){
            item.formButton = 'FAILTRADE'
          }
          param.trxOrdersTranssellList.push(item)
        }
        const { result,success } = await addTranSell(param)
        if( success ){
          this.$message.success('操作成功')
          this.gettranSellInfo()
          // 埋点
          this.addOrdersOptLogs({
            batchId:this.batchId,
            optType: isFail ? '交易失败' :'确认到账',
            oprations: isFail ? '交易失败': '确认到账',
            status: isFail ? '交易失败' : '交易完成',
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
          this.gettranSellInfo()
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
        this.gettranSellInfo()
      } else {
        this.RESET_STATE()
      }
      // 审核单中看订单信息
      if( this.businessKey ){
        const batchId = this.businessKey.split(':')[1]
        this.SET_batchId(batchId)
        this.gettranSellInfo()
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>