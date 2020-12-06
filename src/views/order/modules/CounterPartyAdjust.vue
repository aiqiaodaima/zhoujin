/**
  交易对手

 */
<template>
  <a-form-model ref="counterPartyForm" :model="form" :rules="rules">
    <a-card size="small" style="margin-top: 12px" :bordered="false" :title='title'>
      <a-row>
        <BiCol v-if="'prjCode' in form">
          <BiFormItemSelect :disabled="disabled" :options="prjectInfoList" customKey="prjCode" customVal="trustPrjName" label="项目名称"
          name="prjCode"  v-model="form.prjCode" showSearch @change="changePrjCode"/>
        </BiCol>
        <BiCol v-if="'totalAmtDate' in form">
          <BiFormItemInput disabled  label="系统可用余额（更新日期）" name="totalAmtDate" showSearch v-model="form.totalAmtDate"/>
        </BiCol>
        <BiCol v-if="'savingBalDate' in form">
          <BiFormItemInput disabled  label="专户现金余额（更新日期）" name="savingBalDate" showSearch v-model="form.savingBalDate"/>
        </BiCol>
        <BiCol v-if="'payDt' in form">
          <BiFormItemDatePicker :disabled="disabled" label="申请交易日期" name="payDt" dateFormat='YYYY-MM-DD' v-model="form.payDt"/>
        </BiCol>
        <BiCol v-if="'payAmt' in form">
          <BiInputCapitalAmount :isForm='true' :disabled="disabled" label="申请交易金额" name="payAmt"  v-model="form.payAmt"/>
          <!-- <BiFormItemNumPercent :disabled="disabled" label="申请交易金额" name="payAmt"  v-model="form.payAmt"/> -->
        </BiCol>
        <BiCol v-if="'tranCurCode' in form">
          <BiFormItemSelect :disabled="disabled" :options="dicts.CUR_CODE" label="币种" name="tranCurCode" v-model="form.tranCurCode"/>
        </BiCol>
         <BiCol v-if="'payAccName' in form">
          <BiFormItemInput :disabled="payDisabled" label="付款账户-户名" name="payAccName"  v-model="form.payAccName" />
        </BiCol>
        <BiCol v-if="'payAccNo' in form">
          <BiFormItemInput :disabled="payDisabled" label="付款账户-账户" name="payAccNo"  v-model="form.payAccNo"  showSearch/>
        </BiCol>
        <BiCol v-if="'secCapNo' in form">
          <BiFormItemSelect :disabled="disabled" :options="securitiesAccounts"  label="证券资金账户" name="secCapNo"  v-model="form.secCapNo"/>
        </BiCol>
        <BiCol v-if="'rcvAccName' in form">
          <BiFormItemInput :disabled="rcvDisabled" label="收款账户-户名" name="rcvAccName"  v-model="form.rcvAccName"  showSearch/>
        </BiCol>
        <BiCol v-if="'rcvAccNo' in form">
          <BiFormItemInput :disabled="rcvDisabled" label="收款账户-账户" name="rcvAccNo"  v-model="form.rcvAccNo"  showSearch/>
        </BiCol>
        <BiCol v-if="'rcvBankCode' in form">
          <BiFormItemSelect :disabled="rcvDisabled" :options="dicts.BANK_CODE"  label="收款账户-银行名称" name="rcvBankCode"  v-model="form.rcvBankCode" howSearch/>
        </BiCol>
        <BiCol v-if="'payBankCode' in form">
          <BiFormItemSelect :disabled="payDisabled" :options="dicts.BANK_CODE"  label="付款账户-银行名称" name="payBankCode"  v-model="form.payBankCode" howSearch/>
        </BiCol>
      </a-row>
      <!-- <a-row>
        <BiCol v-if="'payAccName' in form">
          <BiFormItemInput :disabled="payDisabled" label="付款账户-户名" name="payAccName"  v-model="form.payAccName" />
        </BiCol>
        <BiCol v-if="'payAccNo' in form">
          <BiFormItemInput :disabled="payDisabled" label="付款账户-账户" name="payAccNo"  v-model="form.payAccNo"  showSearch/>
        </BiCol>
        <BiCol v-if="'secCapNo' in form">
          <BiFormItemSelect :disabled="disabled" :options="dicts.CUR_CODE" label="证券资金账户" name="secCapNo" v-model="form.secCapNo"/>
        </BiCol>
      </a-row> -->
      <a-row v-if="'payAccOpenBank' in form">
        <a-col span="13" offset="1">
          <BiFormItemInput :disabled="payDisabled" label="付款账户开户行" name="payAccOpenBank" @click="selectpayAccOpenBank" showSearch v-model="form.payAccOpenBank" />
        </a-col>
        <BiModal
          :visible.sync="modal.visible"
          :width="600"
          :title="modal.title"
          :fullscreen.sync="modal.fullscreen"
          :switchFullscreen="modal.switchFullscreen"
          @handleOk='handleOk'
          :confirmLoading='modal.confirmLoading'
        >
          <CusBankList />
        </BiModal>
      </a-row>
      <!-- <a-row>
        <BiCol v-if="'rcvAccName' in form">
          <BiFormItemInput :disabled="rcvDisabled" label="收款账户-户名" name="rcvAccName"  v-model="form.rcvAccName"  showSearch/>
        </BiCol>
        <BiCol v-if="'rcvAccNo' in form">
          <BiFormItemInput :disabled="rcvDisabled" label="收款账户-账户" name="rcvAccNo"  v-model="form.rcvAccNo"  showSearch/>
        </BiCol>
      </a-row> -->
      <a-row v-if="'rcvAccOpenBank' in form">
        <a-col span="13" offset="1">
          <BiFormItemInput :disabled="rcvDisabled" label="收款账户开户行" name="rcvAccOpenBank" @click="selectrcvAccOpenBank" showSearch v-model="form.rcvAccOpenBank" />
        </a-col>
        <BiModal
          :visible.sync="modal.visible"
          :width="600"
          :title="modal.title"
          :fullscreen.sync="modal.fullscreen"
          :switchFullscreen="modal.switchFullscreen"
          @handleOk='handleOk'
          :confirmLoading='modal.confirmLoading'
        >
          <CusBankList />
        </BiModal>
      </a-row>

      <a-row>
        <a-col span="20" offset="1" v-if="'memo' in form" >
          <a-form-model-item label="备注">
            <a-textarea class="no-resize" :disabled="disabled" placeholder="请输入备注" allowClear :rows="4" v-model="form.memo"></a-textarea>
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
  name: "CounterPartyAdjust",
  mixins:[dictMixin],
  provide (){
    return {
      getTranOpenBran:  this.getTranOpenBran
    }
  },
  data(){
    return {
      rules:{
        payDt: [
          { required: true, message: '请选择申请交易日期', trigger: 'change' },
          { validator: validateOverToday, trigger: 'change' }
        ],
        prjCode: [
          { required: true, message: '请选择项目名称', trigger: 'change' },
        ],
        payAmt: [
          { required: true, message: '请输入申请交易金额', trigger: 'blur' },
        ],
        memo: [
          { required: true, message: '备注信息'}
        ],
        tranCurCode: [
          { required: true, message: '请选择币种', trigger: 'change'}
        ],
        payAccName: [
          { required: true, message: '请输入付款账户户名', trigger: 'change'}
        ],
        payAccNo: [
          { required: true, message: '请输入付款账户', trigger: 'change'}
        ],
        rcvAccName: [
          { required: true, message: '请输入收款账户户名', trigger: 'change'}
        ],
        rcvAccNo: [
          { required: true, message: '请输入收款账户', trigger: 'change'}
        ],
        payAccOpenBank: [
          { required: true, message: '付款账户开户行', trigger: 'change'}
        ],
        rcvAccOpenBank: [
          { required: true, message: '收款账户开户行', trigger: 'change'}
        ],
        secCapNo: [
          { required: true, message: '请选择证券资金账户', trigger: 'change'}
        ],

      },
      modal: {
        visible: false,
        title: '选择开户行',
        fullscreen: false,
        switchFullscreen: false,
        confirmLoading: false,
      },
      gbankCode:[]
    }
  },
  components: {
    CusBankList
  },
  computed: {
    ...mapState("order", [
      "proNameList","proSettleAccounts","feeNamesMsg","prjectInfoList",'cusBnfInfos','distTypes','cusLoaInfo',
      "insurerInfo","cusAccInfoList","partys","securitiesAccounts"
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
          insuranceContractId:''
        }
      }
    },
  },
  watch: {

    'form.secCapNo'(value,oldVal){
      if(value){
        this.$bus.$emit('secCapNo',value)
        if(value.indexOf(',')>-1){//撤回时  此下拉只读取库里存的数据，与添加的不一样
          this.gbankCode=value.split(',')
          if(this.gbankCode[0]!=null&&this.gbankCode[0]!="null"&&this.gbankCode[0]!=""){
            this.form.insuranceContractId=this.gbankCode[0]
          }
        }

      }
    }
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
/*    selectModel(){
      let obj = {};
      obj = this.model.find((item)=>{//model就是上面的数据源
        return item.id === id;//筛选出匹配数据
      });

      console.log("modelName"+obj.model)
      //console.log("modelName"+vm.modelName)
    },*/

    getDays (start, end) { // 2019-01-21，2019-01-23
      let dateSpan, iDays
      start = Date.parse(start)
      end = Date.parse(end)
      dateSpan = end - start
      dateSpan = Math.abs(dateSpan)
      iDays = Math.floor(dateSpan / (24 * 3600 * 1000))
      return iDays;
    },
    // 日期区间
    changeDate (val,startDt,endDt) {
      if ( 'termDays' in this.form ){
        this.form.termDays = this.getDays(val[0],val[1] )
      }
      this.$set(this.form,startDt,val[0]|| '')
      this.$set(this.form,endDt,val[1]|| '')
    },
    changePrjCode( prjCode ){
      const target = this.prjectInfoList.filter(item => prjCode === item.prjCode)[0];
      if (target) {
        this.$emit('changePrjCode',target)
      }
    },



    changeDistTypeCode (distTypeCode){
      this.chooseDistType({distType:distTypeCode})
    },
    selectpayAccOpenBank () {
      this.bank = 'pay'
      this.modal.visible = true
    },
    selectrcvAccOpenBank () {
      this.bank = 'rcv'
      this.modal.visible = true
    },

    // 获得开户行
    getTranOpenBran (selectionRows) {
      if(this.bank === 'pay'){
        this.form.payAccOpenBank = selectionRows[0].bankName
      }else if(this.bank === 'rcv'){
        this.form.rcvAccOpenBank = selectionRows[0].bankName
      }
    },
    handleOk () {
      if(this.bank === 'pay'){
        if( !this.form.payAccOpenBank){
          this.$message.warning('请选择一个开户行')
          return
        }
      }else if(this.bank === 'rcv'){
        if( !this.form.rcvAccOpenBank){
          this.$message.warning('请选择一个开户行')
          return
        }
      }

      this.modal.visible = false
    },
  },
  created() {
    this.getDict('CUR_CODE,BANK_CODE')
  }
}
</script>
<style lang="stylus" scoped>

</style>