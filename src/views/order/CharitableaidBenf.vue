/**
  慈善资助受益人收款事务单
*/
<template>
  <div> 
     <!-- 审核单中看订单信息 -->
    <div v-if="businessKey">
      <CounterParty ref='counterParty' title='申请单信息' :disabled='status!=="80"' :form='counterParty' :getPrjectFlag='false'/>
      <Bnfinfo ref='fundSource' :disabled='status!=="80"' :fundSource='fundSource' :fundSourceItem='fundSourceItem'/>
      <OrderOther ref='orderOther' :disabled='status!=="80"'/>
    </div>
    <!-- 订单申请 --> 
    <page-layout v-if="!businessKey"  :title="`${counterParty.orderType == 'LOA1601'?'受益人直接收款':'项目执行人收款'}-${statusName}`">
      <BasicInformation slot="headerContent" :detailData='detailData' />
      <BasicInformationExtra slot="extra" :sumAmt='sumAmt' />
      <BasicInformationAction slot="action"
        @submit="submit"
        @comfirmUnit="handleDeductionUnit"
        @cancleOrder="cancleOrder"
        @comfirmTransfer="handleTransferMoney"
        @tempSave="tempSave"
        @mandatoryWithdrawal="mandatoryWithdrawal"
        v-if="basicActionFlag"
        />
      <FlowProgress :steps="steps"/>
      <a-collapse accordion style="margin-top:12px" :bordered="false" :activeKey='`${current}`' @change="changeCollapse">
        <a-collapse-panel header="请填写申请单" key="0">
          <CounterParty ref='counterParty' title='申请单信息' :disabled='status!=="80"&&status!=="5"' :form='counterParty' :getPrjectFlag='false'/>
          <Bnfinfo ref='fundSource' :disabled='status!=="80"&&status!=="5"' :fundSource='fundSource' :fundSourceItem='fundSourceItem'/>
          <OrderOther ref='orderOther' :disabled='status!=="80"&&status!=="5"'/>
        </a-collapse-panel>
        <a-collapse-panel header="申请单审核中" key="1" :bordered="false" v-if="current>0">
          <WkfAuditHis ref="wkfAuditHis" @pageInited="hisPageInited"/>
        </a-collapse-panel>
        <a-collapse-panel header="确认扣减份额" key="2" v-if="current>1">
          <DeductionUnit v-if="counterParty.orderType == 'LOA1601'" ref='deductionUnit' :disabled='status!=="70"' :deductionUnit="deductionUnit" 
          @handleDeductionUnit="handleDeductionUnit" :deductionUnitItem="deductionUnitItem"
          :deductionUnitFormItem="deductionUnitFormItem"
          />
          <CounterParty v-if="counterParty.orderType == 'LOA1602'" ref='deductionUnit' title='扣减信托份额' :disabled='status!=="70"' :form='counterPartyFormItem' :getPrjectFlag='false'/>
        </a-collapse-panel>
        <a-collapse-panel header="核对流水确认划款" key="3" v-if="current>2">
          <TransferMoneyCharitable v-if="counterParty.orderType == 'LOA1601'"  ref='transferMoney' :disabled='status!=="10"&&status!=="101"'  :transferMoney="transferMoney"
          @handleTransferMoney="handleTransferMoney" :transferMoneyItem="transferMoneyItem" @handleUpdate="orderCharitableAidView"/>
          <template v-if="counterParty.orderType == 'LOA1602'" >
            <a-form-model :model="transferMoneyItem" >
              <a-row>
                <BiCol>
                  <BiFormItemDatePicker :disabled='true' label="付款日" name="actualTranDt" dateFormat='YYYY-MM-DD' v-model="transferMoneyItem.actualTranDt" />
                </BiCol>
                <BiCol>
                  <BiFormItemNumPercent :isForm='true' :disabled='true' label="收支金额" name="actualTranAmt"  v-model="transferMoneyItem.actualTranAmt"/>
                </BiCol>
                <BiCol>
                  <BiFormItemNumPercent :isForm='true' :disabled='true' label="已钩稽" name="mappedAmt"  v-model="transferMoneyItem.mappedAmt"/>
                </BiCol>
                <a-button type="primary" @click="match()">钩稽流水</a-button>
              </a-row>
            </a-form-model>
          </template>
        </a-collapse-panel>
      </a-collapse>
      <!-- 操作日志 -->
      <OperationLog/>
      <WkfNextUserModal ref="wkfUserForm" @complete="wkfUserComplete"/>
      <BiModal
          :visible.sync="modal.visible"
          width="90%"
          :title="modal.title"
          :fullscreen.sync="modal.fullscreen"
          :switchFullscreen="modal.switchFullscreen"
          @handleOk='handleOk'
          @handleCancel='handleOk'
          :confirmLoading='modal.confirmLoading'
          >
          <MatchFlow v-if="modal.visible" :odrCode="transferMoneyItem.odrCode"  ref="matchFlow"/>
        </BiModal>
    </page-layout>
  </div>
</template>

<script>
  import PageLayout from '@/components/page/PageLayout'
  import { mapState, mapActions, mapMutations } from "vuex";
  import { BasicInformation,BasicInformationExtra,BasicInformationAction,FlowProgress,
    CounterParty,Bnfinfo,OrderOther,OperationLog,CheckFlow,DeductionUnit,TransferMoneyCharitable
  } from './modules'
  import { addCharitableaid,orderCharitableAidView,editCharitableaid,charitableaidPrjectInfoList} from '@/api/BiApi'
  import WkfNextUserModal from '@views/activiti/modules/WkfNextUserModal';
  import WkfAuditHis from '@views/activiti/modules/WkfAuditHis';
  import biUploadMixin from '@mixins/biUploadMixin'
  import MatchFlow from '@views/fundFlow/MatchFlow'
  import { fundFlowSwitchStatus,findSumMapAmt } from '@/api/BiApi'
import { validateFormAndTables } from '../../utils/JEditableTableUtil';

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
      name: '核对流水确认划款',
      status:['10','101']
    },
    {
      id: '4',
      name: '交易完成',
      status:['15','5','50','55']
    }
  ]
  export default {
    name: "CharitableaidBenf",
    components: {
      PageLayout,
      BasicInformation,
      BasicInformationExtra,
      BasicInformationAction,
      FlowProgress,
      CounterParty,
      Bnfinfo,
      OrderOther,
      OperationLog,
      CheckFlow,
      DeductionUnit,
      TransferMoneyCharitable,
      WkfNextUserModal,
      WkfAuditHis,
      MatchFlow
    },
    mixins: [biUploadMixin],
    inject:['closeCurrent'],
    data () {
      return {
        steps: steps, //步骤
        // fundSource:[],//资金来源
        fundSourceItem:{
          partyName:'', //受益人
          idn: '', // 证件号码
          idnType: '',// 证件类型
          tranAmt:'', //交易金额
          accNo:'',
          accName:'',
          accOpenBank:'',
          tranInv:'', //本金金额
          pfitInv:'', //收益金额
        },
        fileList:[],
        checkFlow:[], //审核流程表格
        counterParty: {
          orderType:'LOA1601',
          prjCode:'', //项目名称
          trustPrjName: '',
          voaType: '',//估值类型
          accNo: '',// 子账户名称

          savingBal:'',// 可用余额
          aidDirection:[],//资助方向
          aidProject:'',//  资助项目
          dirpartyCode:'',//  项目执行人
          // partyCode: '',//受益人
          // partyName: '',//
          planPayDt: new Date().toLocaleDateString().split('/').join('-'), //申请交易日期
          curCode: 'rmb',// 币种
          tranAmt: '', // 申请交易金额
          payAccNo: '',// 付款账户
          payAccName: '',
          payAccOpenBank: '',
          // rcvAccNo: '',// 收款账户
          // rcvAccName: '',
          // rcvAccOpenBank: '',
          // recAdoptYn: '',//资格验证
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
          partyName:'', //受益人
          idn: '', // 证件号码
          idnType: '',// 证件类型
          tranAmt:'', //交易金额
          accOpenBank:'',
          tranInv:'', //本金金额
          pfitInv:'', //收益金额
          // dealDt:'',
          // priceDt:'',
          tranUnit:'',
          // tranPrice:'',
        },
        deductionUnitFormItem:{
          dealDt:'',
          priceDt:'',
          tranPrice:1
        },
        counterPartyFormItem:{
          dealDt:'',//成交日
          priceDt:'',//净值日期
          tranPrice:1,//成交单位净值
          tranAmt:'',//交易金额
          tranUnit:'',//成交份额
          tranInv:'',//本金金额
          pfitInv:'',//收益金额
          disabled: true
        },
        transferMoney: [],//确认划款
        transferMoneyItem: {
          tranAmt:'',
          actualTranDt:'',
          actualTranAmt:'',
          partyName:'',
          accOpenBank:'',
          mappedAmt:'',
          odrCode:''
        },
        fundSource:[],
        mapCapitalYN: '',
        modal: {
          visible: false,
          title: '流水钩稽',
          fullscreen: false,
          switchFullscreen: false,
          confirmLoading: false,
        },
      }
    },
    computed: {
      ...mapState("order", [
        "current","statusName","status","batchId","financedList","taskId"
      ]),

     basicActionFlag(){
        return this.current !== 4
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
      ...mapMutations("order",["SET_status","RESET_STATE","SET_batchId","SET_financedList",'SET_taskId','SET_prjectInfoList']),
      ...mapActions("order",["addOrdersOptLogs","ordersOptLogsList","findCusBnfInfo","cusAccInfoListByPrjCode"]),
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
            this.$refs.wkfAuditHis&&this.$refs.wkfAuditHis.initPage(null, {taskId:this.taskId});
          });
        }
      },
      async handleOk(){
        this.modal.visible = false
        this.orderCharitableAidView()
        // this.$emit('handleUpdate')
      },
      match() {
        this.modal.visible = true
      },
      hisPageInited(){},
      submit(button) {
        //button 保存草稿TEMPS
        const counterParty = this.$refs.counterParty.form
        const validateCounterParty = this.$refs.counterParty.validateCounterParty()
        const fundSource = this.$refs.fundSource.fundSource
        const validateFundSource = this.$refs.fundSource.validateFundSource()
        if( !validateCounterParty || !validateFundSource ){
          return
        }
       if(button !=='TEMPS'){

         // 验证申请交易金额等于交易金额总和
         let tranAmtSum = 0
         for( let {tranAmt,tranInv,pfitInv } of fundSource ){
           if( !tranAmt ){
             this.$message.warning('请输入交易金额')
             return
           }
          // 不估值时候交易金额等于本金金额和收益金额之和 受益人收款
           if(this.counterParty.orderType == 'LOA1601' && counterParty.voaType == '3' && (+tranAmt !== (+tranInv+(+pfitInv) ))){
             this.$message.warning('交易金额不等于本金金额与收益金额之和')
             return
           }
           tranAmtSum += +tranAmt
         }
         if( tranAmtSum != +counterParty.tranAmt ){
           this.$message.warning('交易金额总和不等于申请交易金额')
           return
         }
         if(  +counterParty.tranAmt > +counterParty.savingBal ){
           this.$message.warning('申请交易金额不能超过可用现金余额')
           return
         }
        // 不估值时候交易金额等于本金金额和收益金额之和 受益人收款
          if(this.counterParty.orderType == 'LOA1602' && counterParty.voaType == '3' && (+counterParty.tranAmt !== (+counterParty.tranInv+(+counterParty.pfitInv) ))){
            this.$message.warning('交易金额不等于本金金额与收益金额之和')
            return
          }
       }
        counterParty.aidDirection = counterParty.aidDirection.join(',')
        const trxOrders =  {
          trantypeCode:this.counterParty.orderType,
        }
        let param = {
          formButton: button || '',
          trxOrdersBenefits:  {...trxOrders,...counterParty,status:this.status,batchId:this.batchId},
          cusBnfInfoList: fundSource,
        }
        this.addCharitableaid(param,button)
      },
      // 提交慈善资助订单
      async addCharitableaid(data,button) {
        const { result,success } = await addCharitableaid(data)
        if( success ){
          this.$message.success('提交成功')
          this.SET_batchId( result.batchId )
          this.orderCharitableAidView()
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
      // 获取慈善资助详情
      async orderCharitableAidView() {
        console.log(result)
        const { result } = await orderCharitableAidView({batchId:this.batchId})
        // debugger
        console.log(result)
        let { orderBenefits,cusBnfInfoList,taskId,mapCapitalYN } = result
        this.mapCapitalYN = mapCapitalYN
        this.SET_taskId(taskId)
        this.$bus.$emit('voaType',orderBenefits.voaType)

        for (let key in orderBenefits) {
          if( this.counterParty.hasOwnProperty(key) ){
            this.counterParty[key] = orderBenefits[key]
          }
          if( this.detailData.hasOwnProperty(key) ){
            this.detailData[key] = orderBenefits[key]
          }
          if( this.deductionUnitFormItem.hasOwnProperty(key) ){
            this.deductionUnitFormItem[key] = orderBenefits[key]
          }
          if( this.counterPartyFormItem.hasOwnProperty(key) ){
            this.counterPartyFormItem[key] = orderBenefits[key]
          }
        }
        if( this.counterPartyFormItem.hasOwnProperty('tranPrice') && !this.counterPartyFormItem.tranPrice ){
          this.counterPartyFormItem.tranPrice = 1
          this.counterPartyFormItem.tranUnit = this.counterPartyFormItem.tranAmt

        }

        this.counterParty.aidDirection = orderBenefits.aidDirection && orderBenefits.aidDirection.split(',')
        this.SET_status(orderBenefits.status)

        this.findCusBnfInfo({prjCode:orderBenefits.prjCode})
        this.cusAccInfoListByPrjCode({prjCode:orderBenefits.prjCode})
        // this.$bus.$emit('cusBnfInfoList',[])

        this.sumAmt = orderBenefits.tranAmt

        cusBnfInfoList.forEach(item=>{
          item.status = orderBenefits.status
          item.tranUnit = this.counterPartyFormItem.tranPrice && ((+item.tranAmt)/(+this.counterPartyFormItem.tranPrice)).toFixed(2)
          // item.tranUnit = 1
        })
        this.fundSource = [...cusBnfInfoList]
        this.deductionUnit = [...cusBnfInfoList]
        this.transferMoney = [...cusBnfInfoList]
        if(this.counterParty.orderType == 'LOA1602'){
          let { actualTranDt, actualTranAmt, mappedAmt,odrCode } = cusBnfInfoList[0]
          this.transferMoneyItem = {...this.transferMoneyItem,actualTranDt,actualTranAmt,mappedAmt,odrCode}
        }

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
        let param = {
          formButton: isFail ? 'CANCLEPAY' : "CFMPAY",
          status: "70",
          trxOrdersBenefits: {
            batchId: this.batchId,
            ...this.deductionUnitFormItem
          },
          cusBnfInfoList: []
        }
        if(this.counterParty.orderType == 'LOA1601'){

          if( !deductionUnit.length ){
            deductionUnit = this.$refs.deductionUnit.deductionUnit
          }
          const validatedeDuctionUnit = this.$refs.deductionUnit.validatedeDuctionUnit()
          if(!validatedeDuctionUnit){
            return
          }

          for (let { tranPrice,accNo,tranUnit,dealDt,odrCode,prjCode,priceDt,tranAmt,partyCode,bnfMode } of deductionUnit) {
            if(!isFail){
              // if(!dealDt){
              //   this.$message.warning('请选择成交日')
              //   return
              // }
              // if(!priceDt){
              //   this.$message.warning('请选择净值日期')
              //   return
              // }
              // if(!tranUnit){
              //   this.$message.warning('请输入扣减份额')
              //   return
              // }
              // if(!tranPrice){
              //   this.$message.warning('请输入成交单位价格')
              //   return
              // }
            }
            let item = {
              odrCode,prjCode,accNo,priceDt,dealDt,tranAmt,tranPrice,tranUnit,partyCode,bnfMode
            }
            param.cusBnfInfoList.push(item)
          }

        }
        if(this.counterParty.orderType == 'LOA1602'){
          param.trxOrdersBenefits = {...param.trxOrdersBenefits,...this.counterPartyFormItem}
        }

        const { result,success } = await editCharitableaid(param)
        if( success ){
          this.orderCharitableAidView()
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
        if(this.status == '101'){
          this.$message.warning('节点在tcpm划款审批中，还未能确认划款')
          return
        }
        if(this.counterParty.orderType == 'LOA1601'){

          if( !transferMoney.length ){
            transferMoney = this.$refs.transferMoney && this.$refs.transferMoney.transferMoney
          }
          for (let { odrCode,accName,tranAmt,mappedAmt } of transferMoney) {
            if(this.mapCapitalYN && this.mapCapitalYN === 'Y'){
              if((+mappedAmt) !== (+tranAmt)){
                this.$message.warning(accName + ':【交易付款金额】已勾稽资金流水金额与应付款金额不符！')
                return
              }
            }
          }
        } else {
          if(this.mapCapitalYN && this.mapCapitalYN === 'Y'){
            if((+this.transferMoneyItem.mappedAmt) !== (+this.transferMoneyItem.actualTranAmt)){
              this.$message.warning('已勾稽资金流水金额与应付款金额不符！')
              return
            }
          }
        }
        let param = {
          formButton: isFail ? 'CANCLEPAY' : "CFMPAY",
          status: "10",
          trxOrdersBenefits: {
            batchId: this.batchId
          },
          cusBnfInfoList: []
        }
        if(this.counterParty.orderType == 'LOA1601'){
          param.cusBnfInfoList = [...transferMoney]
        }
        const { result,success } = await editCharitableaid(param)
        if( success ){
          this.orderCharitableAidView()
          // 埋点
          this.addOrdersOptLogs({
            batchId:this.batchId,
            optType: isFail ? '交易失败' :'确认划款',
            oprations: isFail ? '交易失败': '确认划款',
            status: isFail ? '交易失败' : '交易完成',
          })
        }
      },
      // 强制撤回
      async mandatoryWithdrawal(){
        const { result,success } = await mandatoryWithdrawal({batchId:this.batchId})
        if( success ){
          this.orderCharitableAidView()
          // 埋点
          this.addOrdersOptLogs({
            batchId:this.batchId,
            optType: '强制撤回',
            oprations: '强制撤回',
            status:  '待提交',
            })
        }
      },
      wkfUserComplete () {
        this.$nextTick(() => {
          this.$router.push({path:"/order/orderTrack"});
        });
        this.closeCurrent()
      },
      async getPrjList(){
        const { result,success } = await charitableaidPrjectInfoList({dataPermissionFlag:this.businessKey?true:''})
        this.SET_prjectInfoList(result)
      },
      initConfig(orderType){
        //区分不同类型 1601 受益人收款 1602 项目执行人收款
        if(orderType == 'LOA1602'){
          this.counterParty.orderType = 'LOA1602'

          this.counterParty.rcvAccNo = ''
          this.counterParty.rcvAccName = ''
          this.counterParty.rcvAccOpenBank = ''
          this.counterParty = {...this.counterParty}
        } else {
          this.counterParty.orderType = 'LOA1601'
          delete this.counterParty.rcvAccNo
          delete this.counterParty.rcvAccName
          delete this.counterParty.rcvAccOpenBank
          this.counterParty = {...this.counterParty}
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
        this.RESET_STATE()
        this.getPrjList()
       //区分不同类型 1601 受益人收款 1602 项目执行人收款
       if(this.$route.path == '/order/charitableaidPrjExecutor'){
        this.initConfig('LOA1602')
       } else {
        this.initConfig('LOA1601')
       }

      if( this.$route.query.batchId ){
        // 获取详情
        this.SET_batchId(this.$route.query.batchId)
        this.ordersOptLogsList()
        this.orderCharitableAidView()
      }
      // 审核单中看订单信息
      if( this.businessKey ){
        if( this.businessKey.indexOf('LOA1602') > -1 ){
          // --------------------------------------------修改过
          this.initConfig('LOA1602')
        } else {
          this.initConfig('LOA1601')
        }
        const batchId = this.businessKey.split(':')[1]
        this.SET_batchId(batchId)
        this.orderCharitableAidView()
      }
      // 监听项目的估值类型变化 voaType：1为估值
      this.$bus.$on('voaType',(voaType)=>{
        // this.voaType = voaType
        // 估值
        // debugger
        if(voaType==1){
          delete this.counterParty.pfitInv
          delete this.counterParty.tranInv
          delete this.fundSourceItem.pfitInv
          delete this.fundSourceItem.tranInv
          delete this.deductionUnitItem.pfitInv
          delete this.deductionUnitItem.tranInv
          delete this.counterPartyFormItem.pfitInv
          delete this.counterPartyFormItem.tranInv

          this.counterParty = {...this.counterParty}
          this.fundSourceItem = {...this.fundSourceItem}
          this.deductionUnitItem = {...this.deductionUnitItem}
          this.counterPartyFormItem = {...this.counterPartyFormItem}
          this.deductionUnitFormItem = {...this.deductionUnitFormItem,priceDt:'',tranPrice:1}

        } else {
          // debugger
          delete this.deductionUnitFormItem.priceDt
          delete this.deductionUnitFormItem.tranPrice
          delete this.counterPartyFormItem.priceDt

          delete this.counterPartyFormItem.tranPrice

          this.deductionUnitFormItem = {...this.deductionUnitFormItem}
          this.counterPartyFormItem = {...this.counterPartyFormItem}

          if(this.counterParty.orderType == 'LOA1602'){
            delete this.fundSourceItem.pfitInv
            delete this.fundSourceItem.tranInv
            this.fundSourceItem = {...this.fundSourceItem}
            this.counterParty = {...this.counterParty,pfitInv:'',tranInv:''}
          }
          if(this.counterParty.orderType == 'LOA1601'){
            this.fundSourceItem = {...this.fundSourceItem,pfitInv:'',tranInv:''}
          }
          this.deductionUnitItem = {...this.deductionUnitItem,pfitInv:'',tranInv:''}
        }
      })
    }
  }
</script>

<style lang="stylus" scoped>

</style>