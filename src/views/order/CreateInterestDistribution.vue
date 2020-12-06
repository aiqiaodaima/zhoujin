/** 
  利息分配订单
*/
<template>
  <div>
     <!-- 审核单中看订单信息 -->
    <div v-if="businessKey">
      <CounterParty ref='counterParty' :disabled='status!=="80"' :form='counterParty'/>
      <SelectContract ref='selectContract' :disabled='status!=="80"' :selectContract='selectContract' :selectContractItem="selectContractItem"/>
      <OrderOther ref='orderOther' :disabled='status!=="80"'/>
    </div>
    <!-- 订单申请 -->
    <page-layout v-if="!businessKey" :title="`${pfcatCode==1?'收益分配':pfcatCode==2?'返本':'返本及收益分配'}-${statusName}`">
      <BasicInformation slot="headerContent" :detailData='detailData' />
      <BasicInformationExtra slot="extra" :sumAmt='sumAmt' />
      <BasicInformationAction slot="action" 
      @submit="submit" 
      @tempSave="tempSave"
      @tradeFail="tradeFail"
      @sureAccount="handleSureAccount"
      @mandatoryWithdrawal="mandatoryWithdrawal"
      />
      <FlowProgress :steps='steps'/>
      <a-collapse accordion style="margin-top:12px" :bordered="false" :activeKey='`${current}`' @change="changeCollapse">
        <a-collapse-panel header="请填写申请单" key="0">
          <CounterParty ref='counterParty' :disabled='status!=="80"&&status!=="5"' :form='counterParty'/>
          <SelectContract ref='selectContract' :disabled='status!=="80"&&status!=="5"' :selectContract.sync='selectContract' :selectContractItem="selectContractItem"/>
          <OrderOther ref='orderOther' :disabled='status!=="80"&&status!=="5"'/>
        </a-collapse-panel>
        <a-collapse-panel header="申请单审核中" key="1" :bordered="false" v-if="current>0">
          <WkfAuditHis ref="wkfAuditHis" @pageInited="hisPageInited"/>
        </a-collapse-panel>
        <a-collapse-panel header="请核对流水确认到账" key="2" v-if="current>1">
          <SureAccount ref='sureAccount' :disabled='status!=="75"'  :sureAccount="sureAccount"
          @handleSureAccount="handleSureAccount" :sureAccountItem="sureAccountItem" @handleUpdate="getBaldividendInfo"
          />
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
    CounterParty,SelectContract,OrderOther,OperationLog,CheckFlow,SureAccount
  } from './modules'
  import { addBaldividend,getBaldividendInfo,baldividendConfirmOrCancel,mandatoryWithdrawal} from '@/api/BiApi'
  import WkfNextUserModal from '@views/activiti/modules/WkfNextUserModal';
  import WkfAuditHis from '@views/activiti/modules/WkfAuditHis';
  import biUploadMixin from '@mixins/biUploadMixin'
  import { formatAmt } from '@utils/util'
  const steps =  [
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
      status:['75']
    },
    {
      id: '3',
      name: '交易完成',
      status:['15','20','25','60','50','55']
    }
  ]

  export default {
    name: "CreateInterestDistribution",
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
      SureAccount,
      WkfNextUserModal,
      WkfAuditHis
    },
    mixins: [biUploadMixin],
    inject:['closeCurrent'],
    data () {
      return {
        pfcatCode:3, // 1收益分配 2是返本 3返本+收益分配
        selectContract:[],//选择合同
        selectContractItem:{
          editable: true,
          isNew: true,
          refNo: '',
          refContractNo:'',
          prjCode: '',
          trustPrjCode:'',
          accNo: '',
          accName: '',
          unit: '',//可用余额(份额)
          incomeAmt:'',//交易金额
          proCode: '',
          tranUnit:'',//返回份额
          repayAmt: '',// 投资本金
        },
        fileList:[],
        checkFlow:[], //审核流程表格
        counterParty: {
          orderType:'INV16',// INV15 返本 INV16返本+收益分配 INV09 收益分配
          proCode:'', //资产名称
          issuerBran: '',//发行机构
          expReturnRate: '0',//年化预期收益率
          planPayDt: new Date().toLocaleDateString().split('/').join('-'), //申请交易日期
          // deciMakerType: '', // 投资决策人
          dividendStartDt: null, //计息区间开始日
          dividendEndDt: null, //计息区间结束日
          voaPrice: 1, // 单位价格
          voaDt: null, // 分配核算日
        }, // 交易对手
        detailData: {
          batchId: '',
          createBy: '',
          createDt: '',
          // deciMakerType: '',
          planPayDt: '',
          curCode:'人名币'
        },//信息
        sumAmt: 0, //总金额
        steps: steps, // 流程步骤 
        sureAccount: [],
        sureAccountItem:{
          refContractNo:'',
          accName:'',
          zzhye:'',
          yhkye:'',
          // payAmt:'',
          incomeAmt:'',
          payDt:'',
          // transferFee:'',
          mappedAmt:''
        }
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
        const counterParty = this.$refs.counterParty.form
        const validateCounterParty = this.$refs.counterParty.validateCounterParty()
        const selectContract = this.$refs.selectContract.selectContract
        if( !validateCounterParty ){
          return
        }
        if( !selectContract.length ){
          this.$message.warning('请至少添加一条资金合同！')
          return
        }
        for( let {unit,incomeAmt,refContractNo,tranUnit } of selectContract ){
          if( !refContractNo ){
            this.$message.warning('请选择产品购买合同号')
            return
          }
          if( !incomeAmt ){
            this.$message.warning('请输入交易金额')
            return
          }
          if( this.pfcatCode !==1 && !tranUnit ){
            this.$message.warning('请输入返回份额')
            return
          }
          // 净值型校验份额， 返回份额不能超过可用份额incomeType=3净值
          //非净值型校验金额，交易金额不能超过可用金额
          if(counterParty.incomeType == 3){
            if(+tranUnit > unit){
              this.$message.warning('净值型产品返回份额不能超过可用份额')
              return
            }
          } else {
            if(+incomeAmt > unit){
              this.$message.warning('非净值型产品交易金额不能超过可用余额')
              return
            }
          }
        }
        const trxOrders = {
          "batchId": "",
          "dividendEndDt": "",
          "dividendStartDt": "",
          "payDt": "",
          "proCode": "",
          "status": "80",
          "tranDt": "",
          "tranPrice": 0,
          "tranUnit": 0,
          "voaDt": "",
          "voaPrice": 1
        }

        let param = {
          audiResult: "",
          delYn: "",
          finishYn: "",
          formButton: button ? button: "AUDITS",
          pfcatCode: this.pfcatCode,
          trxOrders:  {...trxOrders,...counterParty,status:this.status,batchId:this.batchId},
          trxOrderssBaldividendList: selectContract
        }
      
        this.addBaldividend(param)
      },
      // 提交利息分配订单
      async addBaldividend(data) {
        const { result } = await addBaldividend(data)
        this.$message.success('提交成功')
        this.SET_batchId( (result.batchId || this.batchId) )
        this.getBaldividendInfo()
        // 埋点
        this.addOrdersOptLogs({
          batchId:result.batchId,
          optType: '提交申请单',
          oprations: '提交审核',
          status: '审核中',
          })
          //审核单选择审核人
        if(result.processId){
          this.$refs.wkfUserForm.edit(result.processId);
          this.$refs.wkfUserForm.disableSubmit = false;
        }
         // 上传文件
        this.$refs.orderOther.uploadFiles(this.counterParty.orderType,this.batchId)

      },
      hisPageInited() {

      },
      // 获取利息分配详情
      async getBaldividendInfo() {
        const { result } = await getBaldividendInfo({batchId:this.batchId})
        let { trxOrders,trxOrderssBaldividendList } = result.orderBaldividendVo
        let taskId = result.taskId
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
        for (let { refNo,refContractNo,prjCode,accNo,accName,incomeAmt,tranUnit,repayAmt,unit,proCode,status,odrCode,trustPrjCode,mapCapitalYN } of trxOrderssBaldividendList) {
          selectContract.push({
            editable: false,
            isNew: false,
            prjCode,
            trustPrjCode,
            accNo,
            refNo,
            refContractNo,
            accName,
            key: selectContract.length,
            unit,//可用余额(份额)
            incomeAmt,//交易金额
            proCode,
            tranUnit,//返回份额
            repayAmt,// 投资本金
            odrCode,
            mapCapitalYN
          })
          sumAmt += (+incomeAmt)
          this.sumAmt = sumAmt
          statusarr.push({status}) 
        }
        this.SET_status(statusarr)
        this.SET_taskId(taskId)
    
        // trxOrderssBaldividendList.map(item=>{
        //   if(item.status=='0'){
        //     item.status = 75
        //   }
        // })

        this.selectContract = selectContract
        
        this.sureAccount = [...trxOrderssBaldividendList]
      },
       // 确认到账
      async handleSureAccount(sureAccount=[],isFail){

        if( !sureAccount.length ){
          sureAccount = this.$refs.sureAccount.sureAccount
        }
        let param = {
          formButton:isFail? 'CANCLEPAY': "CFMPAY",
          status: "75",
          trxOrders: {
            batchId: this.batchId
          },
          trxOrderssBaldividendList: []
        }
        for (let { odrCode,accName,payAmt,payDt,zzhye,tranPrice,tranUnit,tranAmt,mappedAmt,mapCapitalYN } of sureAccount) {
          if(!isFail){
           
            if(!payDt){
              this.$message.warning('请输入资金交收日期')
              return
            }
            if( +payAmt > +zzhye){
              this.$message.warning('资金交收金额不能超过系统可用余额')
              return
            }
          }
          if(mapCapitalYN && mapCapitalYN === 'Y'){
            if((+mappedAmt) !== (+tranAmt)){
              this.$message.warning(accName + ':【交易付款金额】已勾稽资金流水金额与应付款金额不符！')
              return
            }
          }
          let item = {
            odrCode,
            payAmt: (+tranPrice)*(+tranUnit).toFixed(2),
            payDt,
            status: "75",
          }
          param.trxOrderssBaldividendList.push(item)
        }
        const { result,success } = await baldividendConfirmOrCancel(param)
        if( success ){
          this.$message.success('操作成功')
          this.getBaldividendInfo()
          // 埋点
          this.addOrdersOptLogs({
            batchId:this.batchId,
            optType: isFail ? '交易失败' :'确认到账',
            oprations: isFail ? '交易失败': '确认到账',
            status: isFail ? '交易失败' : '交易完成',
          })
        }
      },
      // 交易失败
      tradeFail(){
        this.handleSureAccount([],true)
      },
      // 暂存
      tempSave(){
        this.submit('TEMPS')
      },
      // 强制撤回
      async mandatoryWithdrawal(){
        // const { result,success } = await mandatoryWithdrawal({batchId:this.batchId}) 
        // if( success ){
          this.getBaldividendInfo()
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
      initConfig(orderType){
        // INV15 返本 INV16返本+收益分配 INV09 收益分配
        // 1收益分配 2是返本 3返本+收益分配
       if( orderType == 'INV15' ){
        this.pfcatCode = 2
        this.counterParty.orderType = 'INV15'
        delete this.counterParty.dividendStartDt
        delete this.counterParty.dividendEndDt
      }
      if( orderType == 'INV09' ){
        // 1收益分配 2是返本 3返本+收益分配
        this.pfcatCode = 1
        this.counterParty.orderType = 'INV09'
        delete this.counterParty.unit
        delete this.counterParty.voaPrice
        delete this.selectContractItem.tranUnit
      }
      if( orderType == 'INV16' ){
        // 1收益分配 2是返本 3返本+收益分配
        this.pfcatCode = 3
        this.counterParty.orderType = 'INV16'
      }
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
        this.getBaldividendInfo()
      }
      //区分不同类型order/payback
      //order/incomeDistribution
      if( this.$route.path == '/order/payback' ){
        this.initConfig('INV15')
      }
      if( this.$route.path == '/order/incomeDistribution' ){
        this.initConfig('INV09')
      }
      if( this.$route.path == '/order/createInterestDistribution' ){
        this.initConfig('INV16')
      }
      // 审核单中看订单信息
      if( this.businessKey ){
        // INV15 返本 INV16 返本+收益分配 INV09 收益分配
        if( this.businessKey.indexOf('INV15') > 0 ){
          this.initConfig('INV15')
        } else if(this.businessKey.indexOf('INV16') > 0) {
          this.initConfig('INV16')
        }  else  {
          this.initConfig('INV09')
        }

        const batchId = this.businessKey.split(':')[1]
        this.SET_batchId(batchId)
        this.getBaldividendInfo()
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>