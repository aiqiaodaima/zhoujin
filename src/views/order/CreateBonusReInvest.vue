/** 
  红利再投
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
  <page-layout v-if="!businessKey" :title="`红利再投-${statusName}`">
    <BasicInformation slot="headerContent" :detailData='detailData' />
    <BasicInformationExtra slot="extra" :sumAmt='sumAmt' />
    <BasicInformationAction slot="action" 
    @submit="submit" 
    @tempSave="tempSave"
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
  import { addDeposit,getDepositInfo,mandatoryWithdrawal} from '@/api/BiApi'
  import WkfNextUserModal from '@views/activiti/modules/WkfNextUserModal';
  import WkfAuditHis from '@views/activiti/modules/WkfAuditHis';
  import biUploadMixin from '@mixins/biUploadMixin'

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
        selectContract:[],//选择合同
        selectContractItem:{
          editable: true,
          isNew: true,
          refNo: '',
          refContractNo:'',
          prjCode: '',
          accNo: '',
          accName: '',
          unit: '',//可用余额(份额)
          incomeUnit:'',//交易份额
          proCode: '',
          repayAmt: '',// 投资本金
        },
        fileList:[],
        checkFlow:[], //审核流程表格
        counterParty: {
          orderType:'INV10',
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
        for( let { unit,incomeUnit,refContractNo } of selectContract ){
          if( !refContractNo ){
            this.$message.warning('请选择产品购买合同号')
            return
          }
          if( !incomeUnit ){
            this.$message.warning('请输入交易金额')
            return
          }
          if(+incomeUnit > unit){
            this.$message.warning('交易金额不能超过可用余额')
            return
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
          formButton: button ? button: "AUDITS",
          trxOrders:  {...trxOrders,...counterParty,status:this.status,batchId:this.batchId},
          trxOrderssBaldividendList: selectContract
        }
         
        this.addDeposit(param,button)
      },
      hisPageInited(){

      },
      // 提交红利再投订单
      async addDeposit(data,button) {
        const { result } = await addDeposit(data)
        this.$message.success('提交成功')
        this.SET_batchId( result.batchId )
        this.getDepositInfo()
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
        this.$refs.orderOther.uploadFiles('INV10',this.batchId)
      },
      // 获取红利再投详情
      async getDepositInfo() {
        const { result } = await getDepositInfo({batchId:this.batchId}) 
        let { trxOrders,trxOrderssBaldividendList,taskId } = result.orderDepositVo

        // 跨过审批流
        // if( trxOrders.status=='0' ){
        //   trxOrders.status = '50'
        // }

        this.SET_status(trxOrders.status)
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
        for (let { refNo,refContractNo,prjCode,accNo,accName,incomeAmt,tranUnit,repayAmt,unit,proCode,incomeUnit,odrCode } of trxOrderssBaldividendList) {
          selectContract.push({
            editable: false,
            isNew: false,
            prjCode,
            accNo,
            accName,
            refNo,
            refContractNo,
            key: selectContract.length,
            unit,//可用余额(份额)
            incomeAmt,//交易金额
            proCode,
            repayAmt,// 投资本金
            incomeUnit,//交易份额
            odrCode,
          })
          sumAmt += (+incomeUnit)
          this.sumAmt = sumAmt
        }
        this.selectContract = selectContract
        
      },
      // 暂存
      tempSave(){
        this.submit('TEMPS')
      },
       // 强制撤回
      async mandatoryWithdrawal(){
        // const { result,success } = await mandatoryWithdrawal({batchId:this.batchId}) 
        // if( success ){
          this.getDepositInfo()
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
      this.RESET_STATE()
      if( this.$route.query.batchId ){
        // 获取详情
        this.SET_batchId(this.$route.query.batchId)
        this.ordersOptLogsList()
        this.getDepositInfo()
      }
      // 审核单中看订单信息
      if( this.businessKey ){
        const batchId = this.businessKey.split(':')[1]
        this.SET_batchId(batchId)
        this.getDepositInfo()
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>