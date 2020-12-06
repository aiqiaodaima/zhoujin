/** 
TA份额调账事务单
*/
<template>
  <div>
     <!-- 审核单中看订单信息 -->
    <div v-if="businessKey">
      <CounterParty ref='counterParty' title='申请单信息' :disabled='status!=="80"&&status!=="5"' :form='counterParty'/>
      <FundSourceShow ref='fundSource' :disabled='status!=="80"' :fundSource='fundSource' :fundSourceItem='fundSourceItem'/>
      <OrderOther ref='orderOther' :disabled='status!=="80"&&status!=="5"'/>
    </div>
    <!-- 订单申请 -->
    <page-layout v-if="!businessKey"  :title="`TA份额调${counterParty.orderType=='LOA10'?'减':'增'}-${statusName}`">
      <BasicInformation slot="headerContent" :detailData='detailData' />
      <BasicInformationExtra slot="extra" :sumAmt='sumAmt' />
      <BasicInformationAction slot="action" 
        @submit="submit" 
        @tempSave="tempSave"
        @mandatoryWithdrawal="mandatoryWithdrawal"
        />
      <FlowProgress :steps="steps"/>
      <a-collapse accordion style="margin-top:12px" :bordered="false" :activeKey='`${current}`' @change="changeCollapse">
        <a-collapse-panel header="请填写申请单" key="0">
          <CounterParty ref='counterParty' title='申请单信息' :disabled='status!=="80"&&status!=="5"' :form='counterParty' />
          <FundSourceShow ref='fundSource' :disabled='status!=="80"&&status!=="5"' :fundSource='fundSource' :fundSourceItem='fundSourceItem'/>
          <OrderOther ref='orderOther' :disabled='status!=="80"&&status!=="5"'/>
        </a-collapse-panel>
        <a-collapse-panel header="申请单审核中" key="1" :bordered="false" v-if="current>0">
          <WkfAuditHis ref="wkfAuditHis" @pageInited="hisPageInited"/>
        </a-collapse-panel>
      </a-collapse>
      <!-- 操作日志 -->
      <OperationLog/>
      <WkfNextUserModal ref="wkfUserForm" @complete="wkfUserComplete" />
    </page-layout>
  </div>
</template>

<script>
  import PageLayout from '@/components/page/PageLayout'
  import { mapState, mapActions, mapMutations } from "vuex";
  import { BasicInformation,BasicInformationExtra,BasicInformationAction,FlowProgress,
    CounterParty,FundSourceShow,OrderOther,OperationLog,CheckFlow, FundSource
  } from './modules'
  import { doSaveInde,indeView} from '@/api/BiApi'
  import WkfAuditHis from '@views/activiti/modules/WkfAuditHis';
  import WkfNextUserModal from '@views/activiti/modules/WkfNextUserModal'
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
      id: '3',
      name: '交易完成',
      status:['15','20','25','60','50','55']
    }
  ]
  export default {
    name: "TAunitAdjust",
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
      FundSourceShow,
      WkfNextUserModal,
      WkfAuditHis
    },
    mixins: [biUploadMixin],
    inject:['closeCurrent'],
    data () {
      return {
        steps: steps, //步骤
        fileList:[],
        checkFlow:[], //审核流程表格
        counterParty: {
          orderType:'LOA09', //LOA09增强LOA10增减
          odrCode: '',
          prjCode:'', //项目名称
          adjustDetail: '',//交易细类
          transactionDate: '',//实际成交日
          planPayDt: new Date().toLocaleDateString().split('/').join('-'), //申请交易日期
          adjustReason:'',//调整原因
          adjustReasonOth:'',// 调整原因-其他
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
        fundSourceItem:{
          accName:'',//子账户名称
          bnfModeName:'',//受益权模式
          bnfName:'', //受益人
          accTotalUnit:'',// 子账户信托份额
          bnfTotalUnit:'',//受益人持有份额
          tranPrice:'', //净值
          tranUnit:'', //交易份额
        },
      }
    },
    computed: {
      ...mapState("order", [
        "current","statusName","status","batchId","indeSource","taskId"
      ]),
     fundSource:{
        get: function(){
           return this.indeSource
        },
        set: function(v){
          this.SET_IndeSource(v)
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
      ...mapMutations("order",["SET_status","RESET_STATE","SET_batchId","SET_IndeSource",'SET_taskId']),
      ...mapActions("order",["addOrdersOptLogs","ordersOptLogsList","cusAccInfoListBybnfCode","findPartysByPrjCode"]),
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
      hisPageInited() {

      },
      submit(button) {
        //button 保存草稿TEMPS
        const counterParty = this.$refs.counterParty.form
        const validateCounterParty = this.$refs.counterParty.validateCounterParty()
        const fundSource = this.$refs.fundSource.fundSource
        if( !validateCounterParty ){
          return
        }
        if(!fundSource.length){
          this.$message.warning('此项目没有资金来源')
          return
        }
        let sumAmt = 0
        for( let {tranUnit } of fundSource ){
          sumAmt += +tranUnit
        }
        if( sumAmt == 0 ){
          this.$message.warning('请输入交易份额')
          return
        }
        const trxOrders =  {
          trantypeCode:this.counterParty.orderType,
        }
        let param = {
          formButton: button ? button : 'AUDITS',
          trxOrders:  {...trxOrders,...counterParty,status:this.status,batchId:this.batchId},
          trxOrdersAdjustList: fundSource
        }
        this.addTA(param,button)
      },
      // 提交TA份额订单
      async addTA(data,button) {
        const { result,success } = await doSaveInde(data)
        if( success ){
          this.$message.success('提交成功')
          this.SET_batchId( result.batchId || this.batchId)
          this.indeView()
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
      // 获取TA份额详情
      async indeView() {
        const { result } = await indeView({batchId:this.batchId}) 
        let { trxOrdersAdjustList,taskId,TrxOrders } = result
        for (let key in TrxOrders) {
          if( this.counterParty.hasOwnProperty(key) ){
            this.counterParty[key] = TrxOrders[key]
          }
          if( this.detailData.hasOwnProperty(key) ){
            this.detailData[key] = TrxOrders[key]
          }
        }
      
        for (let key in trxOrdersAdjustList[0]) {
          // if( this.counterParty.hasOwnProperty(key) ){
          //   this.counterParty[key] = trxOrdersAdjustList[0][key]
          // }
         
        }
        let { prjCode,accNo} = trxOrdersAdjustList[0]
      
        let sumAmt = 0
        this.SET_taskId(taskId)
        this.SET_status(TrxOrders.status)
        this.fundSource = trxOrdersAdjustList
      
      },
      tempSave(){
        this.submit('TEMPS')
      },
      // 强制撤回
      async mandatoryWithdrawal(){
        this.indeView()
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
      initData(){
         this.RESET_STATE()
        //区分不同类型tAunitAdjustSub递减LOA09增强LOA10增减
        this.counterParty.orderType = this.$route.path == '/order/tAunitAdjustSub'? 'LOA10' :'LOA09'
        if( this.$route.query.batchId ){
          // 获取详情
          this.SET_batchId(this.$route.query.batchId)
          this.ordersOptLogsList()
          this.indeView()
        }       
        // 审核单中看订单信息
        if( this.businessKey ){
          const batchId = this.businessKey.split(':')[1]
          this.SET_batchId(batchId)
          this.indeView()
        }
      }
     
    },
    props:{
      // 审核单业务key
      businessKey:{
        default: ''
      }
    },
    created(){
      this.initData()
    }
  }
</script>

<style lang="stylus" scoped>

</style>