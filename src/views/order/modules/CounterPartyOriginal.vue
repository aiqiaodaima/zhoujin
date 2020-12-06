/**
  交易对手
 */
<template>
  <a-form-model ref="counterPartyForm" :model="form" :rules="rules">
    <a-card size="small" style="margin-top: 12px" :bordered="false" :title='title'>
      <a-row>
        <BiCol v-if="'accNo' in form">
          <BiFormItemSelect :disabled="disabled" :options="cusAccInfoList" customKey="accNo" customVal="accName" label="子账户"
            name="accNo"  v-model="form.accNo"  showSearch @change="changeAccNo"/>
        </BiCol>
        <BiCol v-if="'trustPrjName' in form">
          <BiFormItemInput disabled  label="项目名称" name="trustPrjName" showSearch v-model="form.trustPrjName"/>
        </BiCol>
        <BiCol v-if="'voaType' in form">
          <BiFormItemSelect disabled :options="dicts.VOA_TYPE"  label="估值类型" name="voaType"  v-model="form.voaType"  showSearch/>
        </BiCol>
        <BiCol v-if="'bnfMode' in form">
          <BiFormItemSelect disabled :options="dicts.BNF_MODE"  label="子账户收益权模式" name="bnfMode"  v-model="form.bnfMode"  showSearch/>
        </BiCol>
        <BiCol v-if="'refContractNo' in form">
          <BiFormItemSelect :disabled="disabled" :options="proNameList" customKey="refContractNo" customVal="refContractName"
            label="产品购买合同" name="refContractNo"  v-model="form.refContractNo" @change="changeProNameInfo" showSearch/>
        </BiCol>
        <BiCol v-if="'avaUnitSum' in form">
          <BiFormItemNumPercent disabled label="可用份额" name="avaUnitSum" v-model="form.avaUnitSum"/>
        </BiCol>
        <BiCol v-if="'partyName' in form">
          <BiFormItemInput disabled label="资产委托人/受让方" name="partyName"  v-model="form.partyName"/>
        </BiCol>
        <BiCol v-if="'payDt' in form">
          <BiFormItemDatePicker :disabled="disabled"  label="申请交易日期" name="payDt" dateFormat='YYYY-MM-DD' v-model="form.payDt"/>
        </BiCol>
        <BiCol v-if="'tranUnit' in form">
          <BiFormItemNumPercent :disabled="disabled" label="交易份额" name="tranUnit"  v-model="form.tranUnit" showSearch/>
        </BiCol>
        <BiCol v-if="'deciMakerType' in form">
          <BiFormItemSelect :disabled="disabled" :options="dicts.DECI_MAKER_TYPE"  label="投资决策人" name="deciMakerType"  v-model="form.deciMakerType"  showSearch/>
        </BiCol>
        <BiCol v-if="'preprofitYn' in form">
          <BiFormItemSelect :disabled="disabled" :options="dicts.PREPROFIT_YN"  label="转让日前未付收益归属" name="preprofitYn"  v-model="form.preprofitYn"  showSearch/>
        </BiCol>
        <BiCol v-if="'payAmt' in form">
          <BiFormItemNumPercent :disabled="disabled" label="交易金额" name="payAmt"  v-model="form.payAmt" showSearch/>
        </BiCol>
      </a-row>
      <a-row>
        <a-col span="20" offset="1" v-if="'memo' in form" >
          <a-form-model-item label="备注">
            <a-textarea class="no-resize" placeholder="请输入备注" allowClear :rows="4" v-model="form.memo"></a-textarea>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-card>
  </a-form-model>
</template>
<script>
import moment from 'moment';
import { mapState, mapActions, mapMutations } from "vuex";
import { subAccountInformation,findDataByPrjCode } from '@/api/BiApi'
import dictMixin from '@mixins/dictMixin'
import vueBus from '@/utils/vueBus';
import CusBankList from '../../fundFlow/CusBankList'
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
  name: "CounterPartyOriginal",
  mixins:[dictMixin],
  provide (){
    return {
      getTranOpenBran:  this.getTranOpenBran
    }
  },
  data(){
    return {
      rules:{
        accNo: [
          { required: true, message: '请选择子账户', trigger: 'change' },
        ],
        refContractNo: [
          { required: true, message: '请选择购买合同', trigger: 'change' },
        ],
        payDt: [
          { required: true, message: '请选择申请交易日期', trigger: 'change' },
          { validator: validateOverToday, trigger: 'change' }
        ],
        prjCode: [
          { required: true, message: '请选择项目名称', trigger: 'change' },
        ],
        deciMakerType: [
          { required: true, message: '请选择投资决策人', trigger: 'change' },
        ],
        payAmt: [
          { required: true, message: '请输入申请交易金额', trigger: 'blur' },
        ],
        preprofitYn: [
          { required: true, message: '请输入申请交易金额', trigger: 'blur' },
        ],
        tranUnit: [
          { required: true, message: '请输入申请交易金额', trigger: 'blur' },
        ],
        memo: [
          { required: true, message: '备注信息'}
        ],

      },
      modal: {
        visible: false,
        title: '选择开户行',
        fullscreen: false,
        switchFullscreen: false,
        confirmLoading: false,
      },

    }
  },
  components: {
    CusBankList
  },
  computed: {
    ...mapState("order", [
      "proNameList","proSettleAccounts","feeNamesMsg","prjectInfoList",'cusBnfInfos','distTypes','cusLoaInfo',
      "insurerInfo","cusAccInfoList","partys"
    ]),
  },
  props: {
    disabled:{
      default: false
    },
    rcvDisabled:{
      default: false
    },
    payDisabled:{
      default: false
    },
    title:{
      default: '交易对手'
    },
    form: {
      default(){ // 默认认购
        return {
          payDt: new Date().toLocaleDateString().split('/').join('-'), //申请交易日期
        }
      }
    },
  },
  methods: {
    moment,
    ...mapActions("order",["getProNameList","getProSettleAccounts","findFeeNamesMsg","choosePrject","getPrjectInfoList",
      "findBnfAvaSaving","chooseDistType","getInsurerInfo","cusAccInfoListByPrjCode","cusAccInfoListByOrgCode",
      "findPartysByPrjCode"]),
    validateCounterParty () {
      let isSuccess = false
      this.$refs.counterPartyForm.validate( async(valid) => {
        isSuccess = valid
      });
      return isSuccess
    },
    changeProNameInfo(refContractNo){
      const target = this.proNameList.filter(item => refContractNo === item.refContractNo)[0];
      this.$emit('changeProInfo',target)
    },
    changeAccNo(accNo){
      const target = this.cusAccInfoList.filter(item => accNo === item.accNo)[0];
      this.$emit('changeAccNo',target)
    },


  },
  created() {
    this.getDict('BNF_MODE,DECI_MAKER_TYPE,PREPROFIT_YN,VOA_TYPE')
  }
}
</script>
<style lang="stylus" scoped>

</style>