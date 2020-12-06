/** 
 受益人间份额转让事务单
*/
<template>
  <div>
     <!-- 审核单中看订单信息 -->
    <div v-if="businessKey">
      <CounterParty ref='counterParty' title='申请单信息' :disabled='status!="80"&&status!="5"' :form='counterParty'/>
      <OrderOther ref='orderOther' :disabled='status!="80"&&status!="5"'/>
    </div>
    <!-- 订单申请 -->
    <page-layout v-if="!businessKey"  :title="`受益人间份额转让-${statusName}`">
      <BasicInformation slot="headerContent" :detailData='detailData' />
      <BasicInformationExtra slot="extra" :sumAmt='counterParty.planTranUnit' />
      <BasicInformationAction slot="action" 
        @submit="submit" 
        @tempSave="tempSave"
        @mandatoryWithdrawal="mandatoryWithdrawal"
        />
      <FlowProgress :steps="steps"/>
      <a-collapse accordion style="margin-top:12px" :bordered="false" :activeKey='`${current}`' @change="changeCollapse">
        <a-collapse-panel header="请填写申请单" key="0">
          <CounterParty ref='counterParty' title='申请单信息' :disabled='status!="80"&&status!="5"' :form='counterParty'/>
          <OrderOther ref='orderOther' :disabled='status!="80"&&status!="5"'/>
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
    CounterParty,FundSourceShow,OrderOther,OperationLog,CheckFlow
  } from './modules'
  import { asttransferAdd,asttransferView} from '@/api/BiApi'
  import WkfAuditHis from '@views/activiti/modules/WkfAuditHis';
  import WkfNextUserModal from '@views/activiti/modules/WkfNextUserModal'
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
      id: '3',
      name: '交易完成',
      status:['15','20','25','60','50','55']
    }
  ]
  export default {
    name: "Asttransfer",
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
          odrCode: '',
          orderType:'LOA06',
          prjCode:'', //项目名称
          accNo: '',//
          planPayDt: new Date().toLocaleDateString().split('/').join('-'), //申请交易日期
          partyCodeTran: '',//转让方
          partyName: '',
          partyCodeBnf: '',//受让方
          partyNameBnf: '',
          planTranUnit: '',//成交份额
          // invAmt: '',//持有份额
          unit: '',//持有份额
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
      }
    },
    computed: {
      ...mapState("order", [
        "current","statusName","status","batchId","financedList","taskId"
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
      ...mapMutations("order",["SET_status","RESET_STATE","SET_batchId","SET_financedList",'SET_taskId']),
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
        if( !validateCounterParty ){
          return
        }
        if(+counterParty.planTranUnit > +counterParty.unit){
          this.$message.warning('成交份额不能大于持有份额')
          return
        }
        const trxOrders =  {
         
        }
        let param = {
          formButton: button ? button : 'AUDITS',
          trxOrders:  {...trxOrders,...counterParty,status:this.status,batchId:this.batchId},
          trxOrdersAsttransfer: { 
            "accNo":counterParty.accNo,
            "batchId": this.batchId,
            "planTranDt": counterParty.planPayDt,
            "planTranUnit": counterParty.planTranUnit,
            "partyCode": counterParty.partyCodeTran,
            "partyCodeBnf": counterParty.partyCodeBnf,
            "odrCode":  counterParty.odrCode
          }
        }
        this.addBenefitsscribe(param,button)
      },
      // 提交受益人间份额转让订单
      async addBenefitsscribe(data,button) {
        const { result,success } = await asttransferAdd(data)
        if( success ){
          this.$message.success('提交成功')
          this.SET_batchId( result.batchId || this.batchId)
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
      // 获取受益人间份额转让详情
      async benefitsBack() {
        const { result } = await asttransferView({batchId:this.batchId}) 
        let { unitTransferInfo,taskId } = result

        for (let key in unitTransferInfo[0]) {
          if( this.counterParty.hasOwnProperty(key) ){
            this.counterParty[key] = unitTransferInfo[0][key]
            this.counterParty.partyCodeTran = unitTransferInfo[0].partyCode
          }
          if( this.detailData.hasOwnProperty(key) ){
            this.detailData[key] = unitTransferInfo[0][key]
          }
        }
        let { prjCode,accNo} = unitTransferInfo[0]
        this.cusAccInfoListBybnfCode({prjCode,bnfMode:'U'})
        this.findPartysByPrjCode({prjCode,accNo})

        let sumAmt = 0
        let statusarr = []
        this.SET_status((unitTransferInfo[0].status))
        this.SET_taskId(taskId)
       
      },
      tempSave(){
        this.submit('TEMPS')
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
        this.benefitsBack()
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