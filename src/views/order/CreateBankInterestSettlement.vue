
/** 
  投资交易单-银行结息
*/
<template>
  <div>
     <!-- 审核单中看订单信息 -->
    <div v-if="businessKey">
      <CounterParty ref="counterParty" :disabled="status!=80" :form="counterParty" />
      <FundSourceBis
        ref="fundSource"
        :disabled="status!=80"
        :fundSource="fundSource"
        :fundSourceItem="fundSourceItem"
      />
    </div>
    <!-- 订单申请 -->
    <page-layout
      v-if="!businessKey"
      :title="`银行结息-${statusName}`"
      >
      <BasicInformation slot="headerContent" :detailData="detailData" />
      <BasicInformationExtra slot="extra" :sumAmt="sumAmt" />
      <BasicInformationAction slot="action" @submit="submit" @tempSave="tempSave" />
      <FlowProgress :steps="steps"/>
      <a-collapse accordion style="margin-top:12px" :bordered="false" :activeKey="`${current}`" @change="changeCollapse">
        <a-collapse-panel header="请填写申请单" key="0">
          <CounterParty ref="counterParty" :disabled='status!=80&&status!=="5"' :form="counterParty" :isAccNo='true'/>
          <FundSourceBis
            ref="fundSource"
            :disabled='status!=80&&status!=="5"'
            :fundSource="fundSource"
            :fundSourceItem="fundSourceItem"
          />
        </a-collapse-panel>
        <a-collapse-panel header="申请单审核中" key="1" :bordered="false" v-if="current>0">
          <WkfAuditHis ref="wkfAuditHis" @pageInited="hisPageInited" />
        </a-collapse-panel>
      </a-collapse>
      <!-- 操作日志 -->
      <OperationLog />
      <WkfNextUserModal ref="wkfUserForm" @complete="wkfUserComplete" />
    </page-layout>
  </div>
</template>

<script>
import PageLayout from '@/components/page/PageLayout'
import { mapState, mapActions, mapMutations } from 'vuex'
import {
  BasicInformation,
  BasicInformationExtra,
  BasicInformationAction,
  FlowProgress,
  CounterParty,
  FundSourceBis,
  OrderOther,
  OperationLog,
  CheckFlow,
  FlowTransfer,
  TradeShare
} from './modules'
import { addSubscribe, getSubscribeInfo, confirmOrCancel,mandatoryWithdrawal } from '@/api/BiApi'
import WkfNextUserModal from '@views/activiti/modules/WkfNextUserModal'
import WkfAuditHis from '@views/activiti/modules/WkfAuditHis'
import { postAction, getAction } from '@api/manage'
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
    id: '3',
    name: '交易完成',
    status:['15','20','25','60','50','55']
  }
]
export default {
  name: 'CreateBankInterestSettlement',
  components: {
    PageLayout,
    BasicInformation,
    BasicInformationExtra,
    BasicInformationAction,
    FlowProgress,
    CounterParty,
    FundSourceBis,
    OrderOther,
    OperationLog,
    CheckFlow,
    FlowTransfer,
    TradeShare,
    WkfNextUserModal,
    WkfAuditHis
  },
  mixins: [],
  inject:['closeCurrent'],
  data() {
    return {
      fundSource: [], //资金来源
      fundSourceItem: {
        editable: true,
        isNew: true,
        bnfMode: '', //收益权模式
        accNo: '', //子账户
        imStyle: '', //投资管理方式
        transactionAmount: '' //交易金额
      },
      detailData: {
        createBy: '',
        createDt: '',
        batchId: ''
      },
      fileList: [],
      checkFlow: [], //审核流程表格
      counterParty: {
        orderType:'INV12',
        prjCode: '', //项目编号
        transactionDate: '', //实际成交日
        totalAmount: '', //实际成交金额
        dividendStartDt: '', //计息区间开始
        dividendEndDt: '',//结束
        memo: '', //备注
        orderType:'INV12'
      },
      sumAmt: 0, //总金额
      steps: steps, //步骤
    }
  },
  computed: {
    ...mapState('order', ['current', 'statusName', 'status', 'batchId','taskId'])
  },
  filters: {},
  watch:{
      current: {
        handler(val){
          this.changeCollapse(val)
        },
        immediate: true,
        deep: true
      }
    },
  methods: {
    ...mapMutations('order', ['SET_status', 'RESET_STATE', 'SET_batchId','SET_taskId']),
    ...mapActions('order', ['addOrdersOptLogs', 'ordersOptLogsList']),
    //button 保存草稿TEMPS
    submit(button) {
      // 表单主体信息
      const counterParty = this.$refs.counterParty.form
      const validateCounterParty = this.$refs.counterParty.validateCounterParty()
      if( !validateCounterParty ){
        return
      }
      // 资金来源信息
      const fundSource = this.$refs.fundSource.fundSource
      // 数据校验
      if (!fundSource.length) {
        this.$message.warning('请至少添加一条资金来源！')
        return
      }
      // 验证实际成交金额与交易金额总和是否一致
        let transactionAmountSum = 0
      for (let { accNo, transactionAmount } of fundSource) {
        if (!accNo) {
          this.$message.warning('请选择子账户')
          return
        }
        if (transactionAmount === '' || transactionAmount === null) {
          this.$message.warning('请输入交易金额')
          return
        }
        transactionAmountSum += (+transactionAmount)
      }
      if( transactionAmountSum != +counterParty.totalAmount ){
        this.$message.warning('交易金额总和不等于实际成交金额')
        return
      }
      
      // 参数封装
      let param = {
        bankInterestSettlementCommon: {
          ...counterParty,
          status: this.status,
          batchId: this.batchId,
          formButton: button || '',
          // orderNumber: this.orderNumber
        },
        source: fundSource
      }
      // 已经保存过的传batchId
      this.addSubscribe(param, button)
    },
    changeCollapse(key){
      if(key == 1){
        this.$nextTick(() => {  
          this.$refs.wkfAuditHis.initPage(null, {taskId:this.taskId});
        });
      }
    },
    // 提交银行利息订单
    addSubscribe(data, button) {
      let result = ''
      //定义流程ID
      let processId = ''
      // 发送请求
      postAction('/bankInterestSettlement/add', data).then(res => {
        result = res.result
        this.SET_batchId( res.result.batchId)
        processId = res.result.processId
        this.$message.success( button ? '保存草稿成功':'提交成功')
        // 获取银行结息详细信息
        this.getInfo()
        // 埋点
        this.addOrdersOptLogs({
          batchId: result.batchId,
          optType: button ? '保存草稿' : '提交申请单',
          oprations: button ? '保存草稿' : '提交审核',
          status: button ? '待提交' : '审核中'
        })
        //审核单选择审核人
        if(processId){
          this.$refs.wkfUserForm.edit(processId);
          this.$refs.wkfUserForm.disableSubmit = false;
        } 
      })
    },
    hisPageInited() {},
    getInfo() {
      let param = {
        batchId: this.batchId
      }
      getAction('/bankInterestSettlement/list', param).then(res => {
        console.log('查询银行结息返回结果', res)
        const {bankInterestSettlementCommon,source,taskId} = res.result
         for (let key in bankInterestSettlementCommon) {
          if( this.counterParty.hasOwnProperty(key) ){
            this.counterParty[key] = bankInterestSettlementCommon[key]
          }
          if( this.detailData.hasOwnProperty(key) ){
            this.detailData[key] = bankInterestSettlementCommon[key]
          }
        }
        this.SET_status(bankInterestSettlementCommon.status)
        this.SET_taskId(taskId)
        let sumAmt = 0
        this.fundSource = source.map((item,i)=>{
          sumAmt += (+item.transactionAmount)
          return {...item,editable: false,isNew: false,key:i,}
        })
        this.sumAmt = sumAmt
        //初始化审核流信息
        if(taskId){
          this.$nextTick(() => {  
            if(this.$refs.wkfAuditHis){
              this.$refs.wkfAuditHis.initPage(null, {taskId});
            }
          });
        }
      })
     
    },
    tempSave() {
      this.submit('TEMPS')
    },
    // 强制撤回
    async mandatoryWithdrawal(){
      // const { result,success } = await mandatoryWithdrawal({batchId:this.batchId}) 
      // if( success ){
        this.getInfo()
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
  created() {
    this.RESET_STATE()
    if (this.$route.query.batchId) {
      // 获取详情
      this.SET_batchId(this.$route.query.batchId)
      this.getInfo()
      this.ordersOptLogsList()
    }
    // 审核单中看订单信息
    if( this.businessKey ){
      const batchId = this.businessKey.split(':')[1]
      this.SET_batchId(batchId)
      this.getInfo()
    }
  }
}
</script>

<style lang="stylus" scoped></style>