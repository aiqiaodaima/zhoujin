/**
  原状分配
*/
<template>
  <div>
    <!-- 审核单中看订单信息 -->
    <div v-if="businessKey">
      <CounterPartyOriginal ref='counterPartyOriginal' :disabled='status!=80' title='申请单信息' :form='counterPartyOriginal' @changeAccNo="changeAccNo" @changeProInfo="changeProInfo"/>
      <FundSourceOriginal ref='fundSourceOriginal' :disabled='status!=80' :fundSourceOriginal='fundSourceOriginal' :fundSourceOriginalItem='fundSourceOriginalItem' :hasProCode='false'/>
      <OrderOther ref='orderOther' :disabled='status!=80'/>
    </div>
    <page-layout v-if="!businessKey" :title="`原状分配-${statusName}`">
      <BasicInformation slot="headerContent" :detailData='detailData'/>
      <BasicInformationExtra slot="extra" :sumAmt='sumAmt'/>
      <BasicInformationAction slot="action"
        @submit="submit"
        @tempSave="tempSave"
        @comfirmTranUnit="comfirmTranUnit"
        @comfirmAssetUnit="comfirmAssetUnit"
        @cancleOrder="cancleOrder"
      />
      <FlowProgress :steps="steps"/>
      <a-collapse accordion style="margin-top:12px" :bordered="false" :activeKey='`${current}`' @change="changeCollapse">
        <a-collapse-panel header="请填写申请单" key="0">
          <CounterPartyOriginal ref='counterPartyOriginal' :disabled='status!=80' title='申请单信息' :form='counterPartyOriginal' @changeAccNo="changeAccNo" @changeProInfo="changeProInfo"/>
          <FundSourceOriginal ref='fundSourceOriginal' :disabled='status!=80' :fundSourceOriginal='fundSourceOriginal' :fundSourceOriginalItem='fundSourceOriginalItem' :hasProCode='false'/>
          <OrderOther ref='orderOther' :disabled='status!=80'/>
        </a-collapse-panel>
        <a-collapse-panel header="申请单审核中" key="1" :bordered="true" v-if="current>0">
          <WkfAuditHis ref="wkfAuditHis"/>
        </a-collapse-panel>
        <a-collapse-panel header="确认扣减信托份额" key="2" v-if="current>1">
          <DeducTruUnitOriginal ref='deducTruUnitOriginal' :disabled='status!=30' :deducTruUnitOriginal='deducTruUnitOriginal' :deducTruUnitOriginalItem='deducTruUnitOriginalItem' :form='counterPartyOriginal'/>
        </a-collapse-panel>
        <a-collapse-panel header="确认扣减资产份额" key="3" v-if="current>2">
          <template>
            <div>
              <a-form-model :model="counterPartyOriginal" ref="form" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
                <a-row :gutter="24">
                  <a-col :span="6">
                    <a-form-model-item label="实际成交日">
                      <j-date placeholder="请选择实际成交日" :disabled="status !== '35'" v-model="counterPartyOriginal.tranDt" name="tranDt" style="width: 100%;"></j-date>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6" label="成交份额">
                      <BiFormItemNumPercent label="成交份额" :disabled="status !== '35'" v-model="counterPartyOriginal.tranUnit" name='tranUnit' :min="0" :precision="2"/>
                  </a-col>
                  <a-col :span="6" label="实际成交金额">
                    <BiFormItemNumPercent label="实际成交金额" :disabled="status !== '35'" v-model="counterPartyOriginal.tranAmt" name='tranAmt' :min="0" :precision="2"/>
                  </a-col>
                </a-row>
              </a-form-model>
            </div>
          </template>
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
    CounterPartyOriginal,FundSourceOriginal,OrderOther,OperationLog,CheckFlow,
    DeducTruUnitOriginal
  } from './modules'
  import { findCusInvestBal,doSaveOriginal,getOriginalInfo,affirmDeducTrustUnit,comfirmAssetUnit,cancelOrdersOriginal } from '@/api/BiApi'
  import WkfNextUserModal from '@views/activiti/modules/WkfNextUserModal';
  import WkfAuditHis from '@views/activiti/modules/WkfAuditHis';
  import JDate from '../../components/jeecg/JDate'
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
      name: '确认扣减信托份额',
      status:['30']
    },
    {
      id: '3',
      name: '确认扣减资产份额',
      status:['35']
    },
    {
      id: '4',
      name: '交易完成',
      status:['15','20','25','60','50','55']
    }
  ]

  export default {
    name: "OriginalDistribution",
    components: {
      PageLayout,
      BasicInformation,
      BasicInformationExtra,
      BasicInformationAction,
      FlowProgress,
      CounterPartyOriginal,
      FundSourceOriginal,
      OrderOther,
      OperationLog,
      CheckFlow,
      DeducTruUnitOriginal,
      WkfNextUserModal,
      WkfAuditHis,
      JDate
    },
    data(){
      return {
        steps: steps,
        counterPartyOriginal: {
          odrCode: '',
          accNo:  '',
          prjCode: '',//项目名称
          trustPrjName: '',
          voaType: '',//估值类型
          bnfMode: '',//子账户收益权模式
          proCode: '',
          refContractNo: '',//产品购买合同
          refContractName:'',
          avaUnitSum: '',//可用份额
          partyName: '',//资产委托人/受让方
          payDt: new Date().toLocaleDateString().split('/').join('-'),//申请交易日期
          tranDt: new Date().toLocaleDateString().split('/').join('-'),
          tranUnit: '',//交易份额
          payAmt: '',//交易金额
          tranAmt: '',
          deciMakerType: '',//投资决策人
          preprofitYn: '',//转让日前的收益是否同步转让
          tranPrice: '',
          priceDt: '',
          status:'',
          memo: '',//备注

        },
        fundSourceOriginal:[],//资金来源
        deducTruUnitOriginal:[],
        fundSourceOriginalItem: {
          editable: true,
          isNew: true,
        },
        deducTruUnitOriginalItem: {

        },

        detailData: {
          batchId: '',
          odrCode: '',
          createBy: '',
          createDt: '',
          payDt: '',
        },
        sumAmt: 0, //总金额
        rcvDisabled: {
          disabled: false
        },
        payDisabled: {
          disabled: false
        }

      }
    },
    computed: {
      ...mapState("order", [
        "current","statusName","status","batchId","taskId","proNameList"
      ]),
    },
    methods: {
      ...mapMutations("order", ["SET_status", "RESET_STATE", "SET_batchId", "SET_bankCardBalanceDto","SET_proNameList","SET_taskId"]),
      ...mapActions("order", ["addOrdersOptLogs", "ordersOptLogsList","findCusAccInfo", "getCusAccInfoList", "cusAccInfoListByPrjCode"]),
      changeCollapse(key){
        if(key == 1){
          this.$nextTick(() => {
            console.log(this.taskId)
            this.$refs.wkfAuditHis.initPage(null, {taskId:this.taskId});
          });
        }
      },
      tempSave(){
        this.submit('TEMPS')
      },
      submit(button){
        const counterParty = this.$refs.counterPartyOriginal.form
        const fundSource = this.$refs.fundSourceOriginal.fundSourceOriginal
        let param = {
          formButton: button || 'AUDITS',
          trxOrders:  {...counterParty,tranSubtypeCode:'LOA17',status:this.status,batchId:this.batchId},
          trxOrdersAsttransferList: fundSource
        }
        // 已经保存过的传batchId
        console.log(param)
        this.doSave(param,button)
      },

      // 提交原状分配订单
      async doSave(data,button) {
        const { result } = await doSaveOriginal(data)
        this.$message.success('提交成功')
        this.SET_batchId( result.batchId )
        this.getOriginalInfo()
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

      //确认扣减信托份额
      async comfirmTranUnit(){
        const trxOrders = this.$refs.deducTruUnitOriginal.form
        const deducTruUnitOriginal = this.$refs.deducTruUnitOriginal.deducTruUnitOriginal
        let param = {
          trxOrders,
          trxOrdersAsttransferList: []
        }
        console.log(deducTruUnitOriginal)
        for (let { odrCode,accNo,partyCode,planTranUnit } of deducTruUnitOriginal) {
          let trxOrdersAsttransfer = {
            odrCode,
            status: '30',
            trantypeCode: 'LOA17',
            accNo, //子账户
            planTranUnit,
            partyCode,
          }
          param.trxOrdersAsttransferList.push(trxOrdersAsttransfer)
        }
        console.log(param)
        const { result } = await affirmDeducTrustUnit(param)
        this.getOriginalInfo()
        // 埋点
        this.addOrdersOptLogs({
          batchId:this.batchId,
          optType: '确认扣减信托份额',
          oprations: '确认扣减信托份额',
          status: '确认扣减资产份额',
        })
      },
      //扣减资产份额
      async comfirmAssetUnit(){
        const trxOrders = this.counterPartyOriginal
        trxOrders.batchId = this.batchId
        let param = {
          trxOrders: {...trxOrders},
          trxOrdersAsttransferList: this.fundSourceOriginal
        }
        console.log(param)
        const { result } = await comfirmAssetUnit(param)
        this.getOriginalInfo()
        // 埋点
        this.addOrdersOptLogs({
          batchId:this.batchId,
          optType: '确认扣减资产份额',
          oprations: '确认扣减资产份额',
          status: '交易成功',
        })
      },
      //取消订单
      async cancleOrder(){
        const trxOrders = this.counterPartyOriginal
        trxOrders.batchId = this.batchId
        let param = {
          trxOrders: {...trxOrders},
          trxOrdersAsttransferList: this.deducTruUnitOriginal
        }
        console.log(param)
        const { result } = await cancelOrdersOriginal(param)
        this.getOriginalInfo()
        // 埋点
        this.addOrdersOptLogs({
          batchId:this.batchId,
          optType: '取消订单',
          oprations: '取消订单',
          status: '已取消',
        })
      },
      async getOriginalInfo(processId){
        const { result } = await getOriginalInfo({batchId:this.batchId})
        console.log(result)
        let { trxOrders,partyName,trxOrdersAsttransferList,taskId } = result
        let refContrac = []
        let refContract = {
          refContractName: trxOrders.refContractNo + "(" + trxOrders.proName + "-" + trxOrders.proCode + ")",
          refContractNo: trxOrders.refContractNo,
        }
        refContrac.push(refContract)
        this.SET_proNameList(refContrac)
        this.SET_status(trxOrders.status)
        this.SET_taskId(taskId)
        //初始化审核流信息
        if(taskId){
          this.$nextTick(() => {
            if(this.$refs.wkfAuditHis){
              this.$refs.wkfAuditHis.initPage(null, {taskId});
            }
          });
        }
        this.counterPartyOriginal.partyName = partyName
        for (let key in trxOrders) {
          if( this.counterPartyOriginal.hasOwnProperty(key) ){
            this.counterPartyOriginal[key] = trxOrders[key]
          }
          if( this.detailData.hasOwnProperty(key) ){
            this.detailData[key] = trxOrders[key]
          }
        }

        let fundSourceOriginal = []
        let deducTruUnitOriginal = []
        let sumAmt = 0
        console.log(trxOrders.payDt)
        if(trxOrdersAsttransferList){
          for (let { odrCode,accNo,partyCode,mktAmt,planTranAmt,planTranUnit,avaPfitInv,unit,bnfHoldUnit,planTranInv,pfitInv,partyName,bnfHoldAmt,bnfAvaAmt } of trxOrdersAsttransferList) {
            console.log(odrCode)
            console.log(partyCode)
            if(trxOrders.voaType === '1'){
              if(trxOrders.bnfMode === 'P'){
                this.fundSourceOriginalItem = {
                  editable: true,
                  isNew: true,
                  mktAmt: '',
                  planTranAmt: '',
                }
                fundSourceOriginal.push({
                  editable: false,
                  isNew: false,
                  mktAmt: mktAmt,
                  planTranAmt: planTranAmt,
                  key: fundSourceOriginal.length,
                  status: trxOrders.status,
                  odrCode,
                  accNo,
                })
                this.deducTruUnitOriginalItem = {
                  editable: true,
                  isNew: true,
                  mktAmt: '',
                  unit: '',
                  planTranAmt: '',
                  planTranUnit: '',
                }
                deducTruUnitOriginal.push({
                  editable: false,
                  isNew: false,
                  mktAmt: mktAmt,
                  unit: unit,
                  planTranAmt: planTranAmt,
                  planTranUnit: planTranUnit,
                  payDt: trxOrders.payDt,
                  key: deducTruUnitOriginal.length,
                  status: trxOrders.status,
                  odrCode,
                  accNo,
                })
              }else{
                this.fundSourceOriginalItem = {
                  editable: true,
                  isNew: true,
                  partyName: '',
                  bnfHoldAmt: '',
                  bnfAvaAmt: '',
                  planTranAmt: '',
                }
                fundSourceOriginal.push({
                  editable: false,
                  isNew: false,
                  partyName: partyName,
                  bnfHoldAmt: bnfHoldAmt,
                  bnfAvaAmt: bnfAvaAmt,
                  planTranAmt: planTranAmt,
                  key: fundSourceOriginal.length,
                  status: trxOrders.status,
                  odrCode,
                  partyCode,
                })
                this.deducTruUnitOriginalItem = {
                  editable: true,
                  isNew: true,
                  partyName: '',
                  bnfHoldAmt: '',
                  bnfAvaAmt: '',
                  planTranAmt: '',
                  planTranUnit: '',
                }
                deducTruUnitOriginal.push({
                  editable: false,
                  isNew: false,
                  partyName: partyName,
                  bnfHoldAmt: bnfHoldAmt,
                  bnfAvaAmt: bnfAvaAmt,
                  planTranAmt: planTranAmt,
                  planTranUnit: planTranUnit,
                  key: deducTruUnitOriginal.length,
                  status: trxOrders.status,
                  odrCode,
                  partyCode,
                })
              }
            }else{
              if(trxOrders.bnfMode === 'P'){
                this.fundSourceOriginalItem = {
                  editable: true,
                  isNew: true,
                  avaPfitInv: '',
                  unit: '',
                  planTranAmt: '',
                  invAmt: '',
                  pfitInv: '',
                }
                fundSourceOriginal.push({
                  editable: false,
                  isNew: false,
                  avaPfitInv: avaPfitInv,
                  unit: unit,
                  planTranAmt: planTranAmt,
                  invAmt: planTranInv,
                  pfitInv: pfitInv,
                  key: fundSourceOriginal.length,
                  status: trxOrders.status,
                  odrCode,
                  accNo,
                })
                this.deducTruUnitOriginalItem = {
                  editable: true,
                  isNew: true,
                  avaPfitInv: '',
                  unit: '',
                  planTranAmt: '',
                  invAmt: '',
                  pfitInv: '',
                  planTranUnit: '',
                }
                deducTruUnitOriginal.push({
                  editable: false,
                  isNew: false,
                  avaPfitInv: avaPfitInv,
                  unit: unit,
                  planTranAmt: planTranAmt,
                  invAmt: planTranInv,
                  pfitInv: pfitInv,
                  planTranUnit: planTranUnit,
                  key: deducTruUnitOriginal.length,
                  status: trxOrders.status,
                  odrCode,
                  accNo,
                })
              }else{
                this.fundSourceOriginalItem = {
                  editable: true,
                  isNew: true,
                  partyName: '',
                  avaPfitInv: '',
                  unit: '',
                  bnfHoldUnit: '',
                  planTranAmt: '',
                  invAmt: '',
                  pfitInv: '',
                }
                fundSourceOriginal.push({
                  editable: false,
                  isNew: false,
                  partyName: partyName,
                  avaPfitInv: avaPfitInv,
                  unit: unit,
                  bnfHoldUnit: bnfHoldUnit,
                  planTranAmt: planTranAmt,
                  invAmt: planTranInv,
                  pfitInv: pfitInv,
                  key: fundSourceOriginal.length,
                  status: trxOrders.status,
                  odrCode,
                  partyCode,
                })
                this.deducTruUnitOriginalItem = {
                  editable: true,
                  isNew: true,
                  partyName: '',
                  avaPfitInv: '',
                  unit: '',
                  bnfHoldUnit: '',
                  planTranAmt: '',
                  invAmt: '',
                  pfitInv: '',
                  planTranUnit: '',
                }
                deducTruUnitOriginal.push({
                  editable: false,
                  isNew: false,
                  partyName: partyName,
                  avaPfitInv: avaPfitInv,
                  unit: unit,
                  bnfHoldUnit: bnfHoldUnit,
                  planTranAmt: planTranAmt,
                  invAmt: planTranInv,
                  pfitInv: pfitInv,
                  planTranUnit: planTranUnit,
                  key: deducTruUnitOriginal.length,
                  status: trxOrders.status,
                  odrCode,
                  partyCode,
                })
              }
            }
            sumAmt += (+planTranAmt)
            this.sumAmt = sumAmt
          }
          this.fundSourceOriginal = fundSourceOriginal
          this.deducTruUnitOriginal = deducTruUnitOriginal
        }
      },
      async changeAccNo(target){
        this.counterPartyOriginal.refContractNo = null
        this.SET_proNameList(null)
        this.counterPartyOriginal.voaType = target.voaType
        this.counterPartyOriginal.trustPrjName = target.trustPrjName
        this.counterPartyOriginal.prjCode = target.prjCode
        this.counterPartyOriginal.bnfMode = target.bnfMode
        let param = {
          voaType: target.voaType,
          bnfMode: target.bnfMode,
          prjCode: target.prjCode,
          accNo: target.accNo
        }
        const { result } = await findCusInvestBal(param)
        for (let i of result){
          i.refContractName = i.refContractNo + '(' + i.proName + '-' + i.bankProCode + ')'
        }
        this.SET_proNameList(result)
        console.log(this.proNameList)
      },
      async changeProInfo(target){
        this.counterPartyOriginal.partyName = target.partyName
        this.counterPartyOriginal.avaUnitSum = target.avaUnitSum
        this.counterPartyOriginal.tranUnit = target.avaUnitSum
        this.counterPartyOriginal.proCode = target.proCode
        this.counterPartyOriginal.payAmt = target.avaBal
        let { trxOrdersAsttransferList } = target
        let fundSource = []
        let sumAmt = 0
        const voaType = this.counterPartyOriginal.voaType
        const bnfMode = this.counterPartyOriginal.bnfMode
        if(voaType != '3' && bnfMode === 'P'){
          this.fundSourceOriginalItem = {
            editable: true,
            isNew: true,
            mktAmt: '',
            planTranAmt: '',
          }
          for (let { mktAmt } of trxOrdersAsttransferList) {
            fundSource.push({
              editable: false,
              isNew: false,
              key: fundSource.length,
              mktAmt: mktAmt,
              planTranAmt: '',
            })
            //sumAmt += (+planTranAmt)
            //this.sumAmt = sumAmt
          }
        }
        if(voaType === '3' && bnfMode === 'P'){
          this.fundSourceOriginalItem = {
            editable: true,
            isNew: true,
            avaPfitInv: '',
            unit: '',
            invAmt: '',
            planTranAmt: '',
            pfitInv: '',
          }
          for (let { avaPfitInv,unit } of trxOrdersAsttransferList) {
            fundSource.push({
              editable: false,
              isNew: false,
              key: fundSource.length,
              avaPfitInv: avaPfitInv,
              unit: unit,
              invAmt: '',
              planTranAmt: '',
              pfitInv: '',
            })
            //sumAmt += (+planTranAmt)
            //this.sumAmt = sumAmt
          }
        }
        if(voaType != '3' && bnfMode === 'U'){
          this.fundSourceOriginalItem = {
            editable: true,
            isNew: true,
            partyName: '',
            bnfHoldAmt: '',
            bnfAvaAmt: '',
            planTranAmt: '',
          }
          for (let { partyCode,partyName,bnfHoldAmt,bnfAvaAmt } of trxOrdersAsttransferList) {
            fundSource.push({
              editable: false,
              isNew: false,
              key: fundSource.length,
              partyCode,
              partyName: partyName,
              bnfHoldAmt: bnfHoldAmt,
              bnfAvaAmt: bnfAvaAmt,
              planTranAmt: '',
            })
            //sumAmt += (+planTranAmt)
            //this.sumAmt = sumAmt
          }
        }
        if(voaType === '3' && bnfMode === 'U'){
          this.fundSourceOriginalItem = {
            editable: true,
            isNew: true,
            partyName: '',
            avaPfitInv: '',
            unit: '',
            bnfHoldUnit: '',
            invAmt: '',
            planTranAmt: '',
            pfitInv: '',
          }
          for (let { partyCode,partyName,avaPfitInv,unit,bnfHoldUnit } of trxOrdersAsttransferList) {
            fundSource.push({
              editable: false,
              isNew: false,
              key: fundSource.length,
              partyCode,
              partyName: partyName,
              avaPfitInv: avaPfitInv,
              unit: unit,
              bnfHoldUnit: bnfHoldUnit,
              invAmt: '',
              planTranAmt: '',
              pfitInv: '',
            })
            //sumAmt += (+planTranAmt)
            //this.sumAmt = sumAmt
          }
        }
        this.fundSourceOriginal = fundSource
      },
      wkfUserComplete () {
        this.$nextTick(() => {
          this.$router.push({path:"/order/orderTrack"});
        });
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
      this.findCusAccInfo()
      if( this.$route.query.batchId ){
        // 获取详情
        this.SET_batchId(this.$route.query.batchId)
        this.ordersOptLogsList()
        this.getOriginalInfo()
      }
      // 审核单中看订单信息
      if( this.businessKey ){
        const batchId = this.businessKey.split(':')[1]
        this.SET_batchId(batchId)
        this.getOriginalInfo()
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>