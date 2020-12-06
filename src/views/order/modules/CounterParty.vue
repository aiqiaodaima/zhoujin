/**
  交易对手
  proCode:'', //资产名称
  issuerBran: '',//发行机构
  tranAccNo: '',//资金交收账户
  expReturnRate: '0',//年化预期收益率
  moneyDirezione: '',//资金投向
  enddayCalType: '',//头尾处理
  planPayDt: new Date().toLocaleDateString().split('/').join('-'), //申请交易日期
  deciMakerType: '', // 投资决策人
  planTranDt: '',// 起息日
  planExpireDt: '',// 到期日
  trustCapitaleUse: '',//信托资金约定用途
  cdivflag: '',//收益分配方式
  dividendStartDt: '',//计息区间
  voaDt: '',//分配核算日
  voaPrice: '',//成交单位价格
  tranSubtypeCode:'',//费用类型
  feeTypeOth:'',//费用名称
  payObject: '',//结算对象
  ifSelfPrepay: '',//资金交收方式
  startDt: '',//费用区间起始日
  endDt: '',//费用区间结束日
  termDays: '',//天数
  rcvAccName: '',//收款账户
  prjCode: //项目名称
 */
<template>
  <a-form-model ref="counterPartyForm" :model="form" :rules="rules">
    <a-card size="small" style="margin-top: 12px" :bordered="false" :title='title'>
      <a-row>
        <BiCol v-if="'orgCode' in form">
          <BiFormItemSelect :disabled="disabled" :options="insurerInfo" customKey="orgCode" customVal="orgName"  label="保险人" name="orgCode"  v-model="form.orgCode" @change="changeinsurer"  showSearch/>
        </BiCol> 
        <BiCol v-if="'tranSubtypeCode' in form">
          <BiFormItemSelect :disabled="disabled" :options="dicts.FEE_PAY_FEE_NAMES"  label="费用类型" name="tranSubtypeCode"  v-model="form.tranSubtypeCode" @change="changeFeeTypeCode"  showSearch/>
        </BiCol>
        <BiCol v-if="'feeTypeCode' in form">
          <BiFormItemSelect :disabled="disabled" :options="feeNamesMsg"  label="费用名称" name="feeTypeCode"  v-model="form.feeTypeCode" @change="changeFeeTypeName" customKey="itemValue" customVal="itemText"  showSearch/>
        </BiCol>
        <BiCol v-if="'payObject' in form">
          <BiFormItemSelect :disabled="disabled" :options="dicts.SETTLE_OBJECT"  label="结算对象" name="payObject"  v-model="form.payObject"  showSearch/>
        </BiCol>
        <BiCol v-if="'prjCode' in form">
          <BiFormItemSelect :disabled="disabled" :options="prjectInfoList" customKey="prjCode" customVal="trustPrjName" label="项目名称" 
          name="prjCode"  v-model="form.prjCode"  showSearch @change="changePrjCode"/>
        </BiCol>
        <BiCol v-if="'accNo' in form">
          <BiFormItemSelect :disabled="disabled" :options="cusAccInfoList" customKey="accNo" customVal="accName" label="子账户" 
          name="accNo"  v-model="form.accNo"  showSearch @change="changeAccNo"/>
        </BiCol>
        <BiCol v-if="'savingBal' in form">
          <BiFormItemInput disabled  label="可用现金余额" name="savingBal" v-model="form.savingBal"/>
        </BiCol>
        
        <BiCol v-if="'dirpartyCode' in form">
          <BiFormItemSelect :disabled="disabled" :options="cusDirInfos" customKey="partyCode" customVal="partyName" label="项目执行人" 
          name="dirpartyCode"  v-model="form.dirpartyCode"  showSearch @change="changeDirpartyCode"/>
        </BiCol>

        <BiCol v-if="'partyCodeTran' in form">
          <BiFormItemSelect :disabled="disabled" :options="partys" customKey="partyCode" customVal="partyName" label="转让方" 
          name="partyCodeTran"  v-model="form.partyCodeTran"  showSearch @change="changePartyCodeTran"/>
        </BiCol>
        <BiCol v-if="'unit' in form">
          <BiInputCapitalAmount :isForm='true'  label="持有份额" name="unit" v-model="form.unit" disabled/>
        </BiCol>
        <BiCol v-if="'partyCodeBnf' in form">
          <BiFormItemSelect :disabled="disabled" :options="partysBnf.length==0?partys:partysBnf" customKey="partyCode" customVal="partyName" label="受让方" 
          name="partyCodeBnf"  v-model="form.partyCodeBnf"  showSearch />
        </BiCol>
        <BiCol v-if="'planTranUnit' in form">
          <BiInputCapitalAmount :isForm='true' :disabled="disabled" :min='1' label="成交份额" name="planTranUnit" v-model="form.planTranUnit"/>
        </BiCol>
        <BiCol v-if="'voaType' in form">
          <BiFormItemSelect :options="dicts.VOA_TYPE"  label="估值类型" 
          name="voaType"  v-model="form.voaType" disabled/>
        </BiCol>
        <BiCol v-if="'partyCode' in form">
          <BiFormItemSelect :disabled="disabled" :options="cusBnfInfos"  label="受益人" name="partyCode"  
          v-model="form.partyCode"  showSearch customKey="partyCode" customVal="partyName" @change="changePartyCode"/>
        </BiCol>
        <BiCol v-if="'distType' in form">
          <BiFormItemSelect :disabled="disabled" :options="dicts.DIST_NAME"  label="分配类型" name="distType"  v-model="form.distType"  showSearch @change="changeDistTypeCode"/>
        </BiCol>
        <BiCol v-if="'distTypeCode' in form">
          <BiFormItemSelect :disabled="disabled" :options="distTypes" customKey="paramCode" customVal="paramName"  label="分配名称" name="distTypeCode"  v-model="form.distTypeCode"  showSearch/>
        </BiCol>
        <BiCol v-if="'proCode' in form">
          <BiFormItemSelect :disabled="disabled" :options="proNameList" customKey="proCode" customVal="proName" label="资产名称" name="proCode"  :value="form.proCode" @change="changeProName"  showSearch/>
        </BiCol>
        <BiCol v-if="'issuerBran' in form">
          <BiFormItemSelect disabled :options="admOrgnaiztions"  label="发行机构" name="issuerBran"  v-model="form.issuerBran" />
          <!-- <BiFormItemInput  label="发行机构" name="issuerBran" v-model="form.issuerBran" disabled/> -->
        </BiCol>
        <BiCol v-if="'ifSelfPrepay' in form">
          <BiFormItemSelect :disabled="disabled" :options="dicts.CAP_SET_MED"  label="资金交收方式" name="ifSelfPrepay"  v-model="form.ifSelfPrepay" @change="changeIfSelfPrepay"  showSearch/>
        </BiCol>
        <BiCol v-if="'startDt' in form">
          <BiRangeDatePicker name="startDt"  :disabled="disabled" label="计费区间" :dateEnd="form.endDt" :dateStart="form.startDt" @change="changeDate($event,'startDt','endDt')"  />
        </BiCol>
        <BiCol v-if="'termDays' in form">
          <BiFormItemInput  label="天数" name="termDays" v-model="form.termDays" disabled/>
        </BiCol>
        <BiCol v-if="'rcvAccNameFee' in form">
          <BiFormItemInput  label="收款账户-户名" name="rcvAccNameFee" v-model="form.rcvAccNameFee"/>
        </BiCol>
        <BiCol v-if="'rcvAccNoFee' in form">
          <BiFormItemInput  label="收款账户-账号" name="rcvAccNoFee" v-model="form.rcvAccNoFee"/>
        </BiCol>
        <BiCol v-if="'rcvAccOpenBankFee' in form">
          <BiFormItemInput  label="收款账户-开户行" name="rcvAccOpenBankFee" v-model="form.rcvAccOpenBankFee"/>
        </BiCol>
        <BiCol v-if="'tranAccNo' in form">
          <BiFormItemSelect :disabled="disabled || this.form.ifSelfPrepay==2" :options="proSettleAccounts"  
            label="资金交收账户" name="tranAccNo"  v-model="form.tranAccNo"  showSearch />
        </BiCol>
        <BiCol v-if="'planPayDt' in form">
          <BiFormItemDatePicker :disabled="disabled"  label="申请交易日期" name="planPayDt" dateFormat='YYYY-MM-DD' v-model="form.planPayDt"/>
        </BiCol>
        <BiCol v-if="'rcvBankCode' in form">
          <BiFormItemSelect :disabled="disabled" :options="dicts.BANK_CODE"  label="银行名称" name="rcvBankCode"  v-model="form.rcvBankCode" howSearch/>
        </BiCol>
        <BiCol v-if="'transactionDate' in form">
          <BiFormItemDatePicker :disabled="disabled"  label="实际成交日" name="transactionDate" dateFormat='YYYY-MM-DD' v-model="form.transactionDate"/>
        </BiCol>
        <BiCol v-if="'adjustReason' in form">
          <BiFormItemSelect :disabled="disabled" :options="dicts.ADJUST_REASON"  label="调整原因" name="adjustReason"  v-model="form.adjustReason" @change="changeReason"  showSearch/>
        </BiCol>
        <BiCol v-if="'adjustReasonOth' in form">
          <BiFormItemInput :disabled="disabled" label="调整原因-其他" name="adjustReasonOth" v-model="form.adjustReasonOth"/>
        </BiCol>
        <BiCol v-if="'planTranDt' in form">
          <BiFormItemDatePicker :disabled="disabled" label="起息日" name="planTranDt" dateFormat='YYYY-MM-DD' v-model="form.planTranDt"/>
        </BiCol>
        <BiCol v-if="'planExpireDt' in form">
          <BiFormItemDatePicker :disabled="disabled" label="到期日" name="planExpireDt" dateFormat='YYYY-MM-DD' v-model="form.planExpireDt"/>
        </BiCol>
         <BiCol v-if="'valueDate' in form">
          <BiFormItemDatePicker :disabled="disabled" label="起息日" name="valueDate" dateFormat='YYYY-MM-DD' v-model="form.valueDate"/>
        </BiCol>
        <BiCol v-if="'interestDate' in form">
          <BiFormItemDatePicker :disabled="disabled" label="到期日" name="interestDate" dateFormat='YYYY-MM-DD' v-model="form.interestDate"/>
        </BiCol>
        <BiCol v-if="'expReturnRate' in form">
          <BiFormItemInput label="年化预期收益率%" name="expReturnRate" v-model="form.expReturnRate" disabled/>
        </BiCol>
         <BiCol v-if="'cdivflag' in form">
          <BiFormItemSelect :disabled="disabled" :options="dicts.C_DIVFLAG"  label="收益分配方式" name="cdivflag"  v-model="form.cdivflag"  showSearch/>
        </BiCol>
        <BiCol v-if="'enddayCalType' in form">
          <BiFormItemSelect :disabled="disabled" :options="dicts.ENDDAY_CAL_TYPE"  label="头尾处理" name="enddayCalType"  v-model="form.enddayCalType"  showSearch/>
        </BiCol>
        <BiCol v-if="'trustCapitaleUse' in form">
          <BiFormItemSelect :disabled="disabled" :options="dicts.TRUST_CAPITALE_USE"  label="信托资金约定用途" name="trustCapitaleUse"  v-model="form.trustCapitaleUse"  showSearch/>
        </BiCol>
        <BiCol v-if="'moneyDirezione' in form">
          <BiFormItemSelect :disabled="disabled" :options="dicts.money_direzione" label="资金投向" name="moneyDirezione"  v-model="form.moneyDirezione"  showSearch/>
        </BiCol>
        <BiCol v-if="'deciMakerType' in form">
          <BiFormItemSelect :disabled="disabled" :options="dicts.DECI_MAKER_TYPE"  label="投资决策人" name="deciMakerType"  v-model="form.deciMakerType"  showSearch/>
        </BiCol>
        <BiCol v-if="'dividendStartDt' in form">
          <BiRangeDatePicker :disabled="disabled" label="计息区间" :dateEnd="form.dividendEndDt" :dateStart="form.dividendStartDt"
           @change="changeDate($event,'dividendStartDt','dividendEndDt')" name="dividendStartDt" />
        </BiCol>
        <BiCol v-if="'voaDt' in form">
          <BiFormItemDatePicker :disabled="disabled" label="分配核算日" name="voaDt" dateFormat='YYYY-MM-DD' v-model="form.voaDt"/>
        </BiCol>
        <BiCol v-if="'voaPrice' in form">
          <BiFormItemNumPercent :disabled="disabled" label="成交单位价格" name="voaPrice" :precision='4'  v-model="form.voaPrice" @change="changeVoaPrice"/>
        </BiCol>
        <BiCol v-if="'totalAmount' in form">
          <BiInputCapitalAmount :isForm='true' :disabled="disabled" label="实际成交金额" name="totalAmount"  v-model="form.totalAmount"/>
          <!-- <BiFormItemNumPercent :disabled="disabled" label="实际成交金额" name="totalAmount"  v-model="form.totalAmount"/> -->
        </BiCol>
       
        <BiCol v-if="'tranAmt' in form">
          <BiInputCapitalAmount :isForm='true' :disabled="disabled || form.disabled" label="申请交易金额" name="tranAmt"  v-model="form.tranAmt"/>
        </BiCol>
        <BiCol v-if="'tranInv' in form">
          <BiInputCapitalAmount :isForm='true' :disabled="disabled" label="本金金额" name="tranInv"  v-model="form.tranInv"/>
        </BiCol>
        <BiCol v-if="'pfitInv' in form">
          <BiInputCapitalAmount :isForm='true' :disabled="disabled" label="收益金额" name="pfitInv"  v-model="form.pfitInv"/>
        </BiCol>
        <BiCol v-if="'dealDt' in form">
          <BiFormItemDatePicker :disabled="disabled" label="成交日" name="dealDt" dateFormat='YYYY-MM-DD' v-model="form.dealDt"/>
        </BiCol>
        <BiCol v-if="'priceDt' in form">
          <BiFormItemDatePicker :disabled="disabled" label="净值日期" name="priceDt" dateFormat='YYYY-MM-DD' v-model="form.priceDt"/>
        </BiCol>
        <BiCol v-if="'tranPrice' in form">
          <BiFormItemNumPercent :disabled="disabled" label="成交单位净值" name="tranPrice" :precision='4'  v-model="form.tranPrice" @change="changeTranPrice"/>
        </BiCol>
        <BiCol v-if="'tranUnit' in form">
          <BiInputCapitalAmount :isForm='true' :disabled="disabled || form.disabled" label="成交份额" name="tranUnit"  v-model="form.tranUnit"/>
        </BiCol>
        <BiCol v-if="'recAdoptYn' in form">
          <BiFormItemInput disabled label="资格验证" v-model="form.recAdoptYn"  showSearch/>
        </BiCol> 
        <BiCol v-if="'aidProject' in form">
          <BiFormItemInput :disabled="disabled" label="资助项目" v-model="form.aidProject"  showSearch/>
        </BiCol>
        <BiCol v-if="'memo' in form">
          <BiFormItemInput :disabled="disabled" label="交易备注" v-model="form.memo"  showSearch/>
        </BiCol>
      </a-row>
      <a-row v-if="'aidDirection' in form">
        <a-col :span="16" :offset="1">
          <BiFormItemSelect :disabled="disabled" :options="dicts.SUBSIDIZE_DIRECTION" label="资助方向" 
          name="aidDirection"   v-model="form.aidDirection"  showSearch  mode="multiple"/>
          </a-col>
      </a-row>
      <a-row v-if="'payAccNo' in form">
        <a-col :span="16" :offset="1">
          <BiFormItemInput disabled label="付款账户"  :value="`${form.payAccNo} ${form.payAccName} ${form.payAccOpenBank}`" />
        </a-col>
      </a-row>
      <a-row v-if="'rcvAccNo' in form">
        <a-col :span="16" :offset="1">
          <BiFormItemInput disabled label="收款账户" :value="`${form.rcvAccNo} ${form.rcvAccName} ${form.rcvAccOpenBank} `"  />
        </a-col>
      </a-row>
    </a-card>
  </a-form-model>
</template>
<script>
import moment from 'moment';
import { mapState, mapActions, mapMutations } from "vuex";
import { subAccountInformation,findDataByPrjCode,findRcvAccount,queryCapitalAviAmt } from '@/api/BiApi'
import dictMixin from '@mixins/dictMixin'
import vueBus from '@/utils/vueBus';

let validateOverToday = (rule, value, callback) => {
  const today = new Date().toLocaleDateString()
  if (value === '') {
    callback(new Error('请选择申请交易日期!'));
  } 
  // else if ((new Date(today).getTime()-new Date(value).getTime())>0) {
  //   callback(new Error("申请交易日期应该大于等于今日!"));
  // }
   else {
    callback();
  }
};
export default {
  name: "CounterParty",
  mixins:[dictMixin],
  data(){
    return {
      rules:{
        proCode: [
          { required: true, message: '请选择资产名称', trigger: 'change' },
        ],
        tranAccNo: [
          { required: true, message: '请选择资金交收账户', trigger: 'change' },
        ],
        planPayDt: [
          { required: true, message: '请选择申请交易日期', trigger: 'change' },
          { validator: validateOverToday, trigger: 'change' }
        ],
        trustCapitaleUse: [
          { required: true, message: '请选择信托资金约定用途', trigger: 'change' },
        ],
        moneyDirezione: [
          { required: true, message: '请选择资金投向', trigger: 'change' },
        ],
        deciMakerType: [
          { required: true, message: '请选择投资决策人', trigger: 'change' },
        ],
        voaDt: [
          { required: true, message: '请选择分配核算日', trigger: 'change' },
        ],
        voaPrice: [
          { required: true, message: '请输入成交单位价格', trigger: 'blur' },
        ],
        tranSubtypeCode: [
          { required: true, message: '请选择费用类型', trigger: 'change' },
        ],
        feeTypeCode: [
          { required: true, message: '请选择费用名称', trigger: 'change' },
        ],
        payObject: [
          { required: true, message: '请选择结算对象', trigger: 'change' },
        ],
        ifSelfPrepay: [
          { required: true, message: '请选择资金交收方式', trigger: 'change' },
        ],
        startDt: [
          { required: true, message: '请选择计费区间', trigger: 'change' },
        ],
        dividendStartDt: [
          { required: true, message: '请选择计息区间', trigger: 'change' },
        ],
        rcvAccNameFee: [
          { required: true, message: '请输入收款账户-户名', trigger: 'blur' },
        ],
        rcvAccNoFee: [
          { required: true, message: '请输入收款账户-账号', trigger: 'blur' },
        ],
        rcvAccOpenBankFee: [
          { required: true, message: '请输入收款账户-开户行', trigger: 'blur' },
        ],
        prjCode: [
          { required: true, message: '请选择项目名称', trigger: 'change' },
        ],
        partyCode: [
          { required: true, message: '请选择受益人', trigger: 'change' },
        ],
        distTypeCode: [
          { required: true, message: '请选择分配名称', trigger: 'change' },
        ],
        distType: [
          { required: true, message: '请选择分配类型', trigger: 'change' },
        ],
        orgCode: [
          { required: true, message: '请选择保险人', trigger: 'change' },
        ],
        accNo: [
          { required: true, message: '请选择子账户', trigger: 'change' },
        ],
        partyCodeBnf: [
          { required: true, message: '请选择受让方', trigger: 'change' },
        ],
        partyCodeTran: [
          { required: true, message: '请选择转让方', trigger: 'change' },
        ],
        aidDirection: [
          { required: true, message: '请选择资助方向', trigger: 'change' },
        ],
        adjustReason: [
          { required: true, message: '请选择调整原因', trigger: 'change' },
        ],
        transactionDate: [
          { required: true, message: '请选择实际成交日', trigger: 'change' },
        ],
        dealDt: [
          { required: true, message: '请选择成交日', trigger: 'change' },
        ],
        priceDt: [
          { required: true, message: '请选择净值日期', trigger: 'change' },
        ],
        tranAmt: [
          { required: true, message: '请输入申请交易金额', trigger: 'blur' },
        ],
        planTranUnit: [
          { required: true, message: '请输入成交份额', trigger: 'blur' },
        ],
        totalAmount:[
          { required: true, message: '请输入实际成交金额', trigger: 'blur' },
        ],
        tranPrice:[
          { required: true, message: '请输入成交单位净值', trigger: 'blur' },
        ],
        
      },
      partysBnf: [],//受让人
      gbankCode:[],//资金交收账户

    }
  },
  components: {
  },
  computed: {
    ...mapState("order", [
      "proNameList","proSettleAccounts","feeNamesMsg","prjectInfoList",'cusBnfInfos','distTypes','cusLoaInfo',
      "insurerInfo","cusAccInfoList","partys","cusDirInfos"
    ]),
  },
  props: {
    disabled:{
      default: false
    },
    title:{
      default: '交易对手'
    },
    // 是否需要获取项目下的子账户列表
    isAccNo: {
      default: false
    },
    // 是否初始化获取所有项目列表
    getPrjectFlag:{
      default: true
    },
    form: {
      default(){ // 默认认购
        return {
          proCode:'', //资产名称
          issuerBran: '',//发行机构
          tranAccNo: '',//资金交收账户
          expReturnRate: '0',//年化预期收益率
          moneyDirezione: '',//资金投向
          enddayCalType: '',//头尾处理
          planPayDt: new Date().toLocaleDateString().split('/').join('-'), //申请交易日期
          deciMakerType: '', // 投资决策人
          planTranDt: '',// 起息日
          planExpireDt: '',// 到期日
          trustCapitaleUse: '',//信托资金约定用途
          cdivflag: '',//收益分配方式
          rcvBankCode: '',
          rCode:'',//资金交收账户rcvBankCode
        }
      }
    },
  },
  methods: {
    moment,
    ...mapMutations("order",["SET_partys"]),
    ...mapActions("order",["getProNameList","getProSettleAccounts","findFeeNamesMsg","choosePrject","getPrjectInfoList",
      "findBnfAvaSaving","chooseDistType","getInsurerInfo","cusAccInfoListByPrjCode","cusAccInfoListByOrgCode","getCusInvestBal",
      "findPartysByPrjCode","cusAccInfoListBybnfCode","queryInde","findCusBnfInfo","getPolicyInformation"]),
    changeProName (value) {
      this.$bus.$emit('proCode',value)
      const selected = this.proNameList.filter(item=> { return  item.proCode==value })
      if( !selected.length ){
        this.form.proCode = ''
        this.form.issuerBran = ''
        return
      }
      // 获取产品下的子账户合同号，认购时候不需要
      if(this.form.orderType !== 'INV01' ){
        this.getCusInvestBal({proCode:value})
      }

      let { issuerBran,expReturnRate,issuerCode,incomeType,capitalSettlementMethod,headAndTailProcessing } = selected[0]
      this.form.proCode = value
      this.form.issuerBran = issuerCode
      this.form.incomeType = incomeType
      if(this.form.hasOwnProperty('ifSelfPrepay')){
        this.form.ifSelfPrepay = capitalSettlementMethod
      }
      if(this.form.hasOwnProperty('enddayCalType')){
        this.form.enddayCalType = headAndTailProcessing
      }
      // 联动资金交收账户
      this.changeIfSelfPrepay(capitalSettlementMethod)
      
      this.form.expReturnRate = expReturnRate || 0
      this.getProSettleAccounts({ proCode: value })
    },
    validateCounterParty () {
      let isSuccess = false
      this.$refs.counterPartyForm.validate( async(valid) => {
        isSuccess = valid
      });
      return isSuccess
    },
    getDays (start, end) { // 2019-01-21，2019-01-23
      let dateSpan, iDays
      start = Date.parse(start)
      end = Date.parse(end)
      dateSpan = end - start
      dateSpan = Math.abs(dateSpan)
      iDays = Math.floor(dateSpan / (24 * 3600 * 1000))
      return iDays;
    },
    //资金交收账户切换
    changeIfSelfPrepay(val){
      if(this.form.hasOwnProperty('tranAccNo')){
        val == 2 ? (this.form.tranAccNo = '银行自动扣款') : (this.form.tranAccNo = '')
        
      }
      if(this.form.hasOwnProperty('rcvAccNoFee')){
        if(val == 2){
          //费用支付
          this.form.rcvAccOpenBankFee = '银行自动扣款'
          this.form.rcvAccNoFee = '银行自动扣款'
          this.form.rcvAccNameFee = '银行自动扣款'

        }
        if(val == 1 ){
          //费用支付
          this.form.rcvAccOpenBankFee = ''
          this.form.rcvAccNoFee = ''
          this.form.rcvAccNameFee = ''
        }
      }
    },
 /*   valchange(val){
      this.gbankCode=val.split('|')
      this.form.rCode=this.gbankCode[1]
      console.log("huoqu"+this.form.rCode)


    },*/
    // 日期区间
    changeDate (val,startDt,endDt) {
      if ( 'termDays' in this.form ){
        this.form.termDays = this.getDays(val[0],val[1] )
      }
      this.$set(this.form,startDt,val[0]|| '')
      this.$set(this.form,endDt,val[1]|| '')
    },
    changeFeeTypeCode (code) {
      this.$bus.$emit('changeFeeTypeCode',code)
      this.findFeeNamesMsg({ tranSubtypeCode:code })
    },
    changeVoaPrice(val){
      this.$bus.$emit('changeVoaPrice',val)
    },
    changeTranPrice(val){
      this.form.tranUnit = ((+this.form.tranAmt)/(+val)).toFixed(2)
    },
    async changeFeeTypeName (code) {
      const target = this.feeNamesMsg.filter(item => code === item.itemValue)[0];
      if(target){
        this.form.feeTypeName = target.itemText
        const { result,success } = await findRcvAccount({code})
        if(success){
           let {rcvAccNo,rcvAccName,rcvAccOpenBank} = result.trxOrdersFees
           this.form.rcvAccNoFee = rcvAccNo
           this.form.rcvAccNameFee = rcvAccName
           this.form.rcvAccOpenBankFee = rcvAccOpenBank
        }
      }
    },
    changePrjCode( prjCode ){
      this.$bus.$emit('prjCode',prjCode)
      const target = this.prjectInfoList.filter(item => prjCode === item.prjCode)[0];
      if (target) {
        // 分配处理
        if( this.form.orderType=='LOA04'){
          this.choosePrject({prjCode})
          this.form.voaType = target.voaType
          this.form.partyCode = ''
          this.$bus.$emit('voaType',target.voaType)
        }
        // 慈善资助
        if( this.form.orderType=='LOA1601' || this.form.orderType=='LOA1602' ){
          this.findCusBnfInfo({prjCode}).then(()=>{
            this.form.payAccNo = this.cusLoaInfo.accNo || ''
            this.form.payAccName = this.cusLoaInfo.accName || ''
            this.form.payAccOpenBank = this.cusLoaInfo.accOpenBank || ''
            this.form.bankCode = this.cusLoaInfo.bankCode || ''
          })
          this.form.trustPrjName = target.trustPrjName
          this.form.voaType = target.voaType
          this.form.dirpartyCode = ''
          this.form.accNo = ''
          this.form.savingBal = ''
          this.cusAccInfoListByPrjCode({prjCode})
          this.$bus.$emit('voaType',target.voaType)
          this.$bus.$emit('cusBnfInfoList',[])
          
          if(this.form.orderType=='LOA1602'){
            this.form.rcvAccNo = ''
            this.form.rcvAccName = ''
            this.form.rcvAccOpenBank = ''
          }
          // 清空已选受益人
        }
        // 子账户间资产转让，资金调账,银行结息
        if( this.form.orderType=='LOA07' || this.form.orderType=='LOA1401'|| this.form.orderType=='LOA1402'|| this.form.orderType=='INV12' || this.isAccNo){
          this.cusAccInfoListByPrjCode({prjCode})
        }
        // 受益人间份额转让
        if( this.form.orderType=='LOA06' ){
          this.cusAccInfoListBybnfCode({prjCode,bnfMode:'U'})
          this.form.accNo = ''
          this.form.partyCodeTran = ''
          this.form.partyCodeBnf = ''
          this.form.planTranUnit = ''
          this.form.unit = ''
          this.SET_partys([])
          this.partysBnf = []
        }
        // TA份额调整
        if( this.form.orderType=='LOA09' || this.form.orderType=='LOA10' ){
          this.queryInde({prjCode})
        }
        
      }
    },
    changePartyCode (partyCode){
      const target = this.cusBnfInfos.filter(item => partyCode === item.partyCode)[0];
      if( target ) {
        this.form.partyName = target.partyName || ''

        this.form.payAccNo = this.cusLoaInfo.accNo || ''
        this.form.payAccName = this.cusLoaInfo.accName || ''
        this.form.payAccOpenBank = this.cusLoaInfo.accOpenBank || ''

        this.form.rcvAccNo = target.accNo || ''
        this.form.rcvAccName = target.accName || ''
        this.form.rcvAccOpenBank = target.accOpenBank || ''

        this.findBnfAvaSaving({partyCode,prjCode:target.prjCode})
      }
    },
    changeDirpartyCode (partyCode){
      const target = this.cusDirInfos.filter(item => partyCode === item.partyCode)[0];
      if( target && this.form.orderType=='LOA1602' ) {
        this.form.rcvAccNo = target.accNo || ''
        this.form.rcvAccName = target.accName || ''
        this.form.rcvAccOpenBank = target.accOpenBank || ''
      }
    },
    async changeAccNo(accNo){
      const target = this.cusAccInfoList.filter(item => accNo === item.accNo)[0];
      let param = {prjCode:target.prjCode,accNo}
      // 受益人间份额转让测试数据
      this.findPartysByPrjCode(param)
      if(this.form.hasOwnProperty('savingBal')){
        // 子账户现金可用余额
        const { result } = await queryCapitalAviAmt(param)
        this.form.savingBal = result.queryCapitalAviAmtDto && result.queryCapitalAviAmtDto.totalAmt || 0
      }
      
    },
    changePartyCodeTran(partyCode){
      const target = this.partys.filter(item => partyCode === item.partyCode)[0];
      this.partysBnf = this.partys.filter(item => partyCode != item.partyCode);
      this.form.unit= target.unit
      this.form.partyName = target.partyName
      this.form.partyCodeBnf = ''
    },
    async changeinsurer (orgCode){
      const target = this.insurerInfo.filter(item => orgCode === item.orgCode)[0];
      this.$bus.$emit('orgCode',orgCode)
      if( target ) {
        this.form.rcvAccNo = target.accNo || ''
        this.form.rcvAccName = target.accName || ''
        this.form.rcvAccOpenBank = target.accOpenBank || ''
        // 根据保险人选择保险合同
        this.getPolicyInformation({orgCode})
        // this.cusAccInfoListByOrgCode({orgCode})
      }
    },
    changeDistTypeCode (distTypeCode){
      this.form.distTypeCode = ''
      if(distTypeCode){
        this.chooseDistType({distType:distTypeCode})
      }
    },
    changeReason(val){
      if( val == 2 ){
        this.rules.adjustReasonOth =   [
          { required: true, message: '请输入调整原因-其他', trigger: 'blur' },
        ]
        this.rules = {...this.rules}
      } else {
        if(this.rules.hasOwnProperty('adjustReasonOth')){
          delete this.rules.adjustReasonOth
          this.rules = {...this.rules}
        }
      }
    },
    initData(){
      //获取资产名称
      this.getProNameList()
      // 是否初始化所有的子账户
      if( this.getPrjectFlag ){
        this.getPrjectInfoList()
      }
      // 获取保险人信息
      this.getInsurerInfo({organType:'IN'})
      // 资产发行机构
      this.getAdmOrgnaiztionInfo({pageSize:999})
      this.getDict('ENDDAY_CAL_TYPE,money_direzione,DECI_MAKER_TYPE,TRUST_CAPITALE_USE,C_DIVFLAG,FEE_PAY_FEE_NAMES,SETTLE_OBJECT,CAP_SET_MED,VOA_TYPE,DIST_NAME,CAP_SET_MED,ADJUST_REASON,SUBSIDIZE_DIRECTION,BANK_CODE')
    }
  },
  created() {
    this.initData()
  },
  watch:{
    'form.proCode'(value,oldVal){
      if(value){
        this.$bus.$emit('proCode',value)
        // 获取产品下的子账户合同号，认购时候不需要
        if(this.form.orderType !== 'INV01' ){
          this.getCusInvestBal({proCode:value})
        }
        this.getProSettleAccounts({ proCode: value })
      }
    },
    'form.tranAccNo'(value,oldVal){
      if(value){
        this.$bus.$emit('tranAccNo',value)
        this.gbankCode=value.split(',')
        if(this.gbankCode[1]!=null&&this.gbankCode[1]!="null"&&this.gbankCode[1]!=""){
          this.form.rCode=this.gbankCode[1]
        }
      }
    }
  },
  mounted() {
  
  },
}
</script>
<style lang="stylus" scoped>

</style>