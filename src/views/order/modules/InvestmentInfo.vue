/**
  投资基本信息

 */
<template>
  <a-form-model ref="investmentForm" :model="form" :rules="rules">
    <a-card size="small" style="margin-top: 12px" :bordered="false" title='申请单信息'>
      <a-row >
        <a-col span="20" offset="1">
          <BiFormItemSelect :disabled="disabled" :options="cusAccInfoList" name="accNo" customKey="accNo" customVal="accName" label="子账户名称"
                            @change="changeAccCode($event)"  showSearch v-model="form.accNo"
                            placeholder="请选择"/>
        </a-col>
      </a-row>

      <a-row >
        <a-col span="20" offset="1">
          <BiFormItemInput disabled  label="项目名称" name="proName"  v-model="form.proName"/>
        </a-col>
      </a-row>

      <a-row>
        <BiCol>
          <BiFormItemInput disabled  label="系统可用余额（更新日期）" name="totalAmtDate"  v-model="form.totalAmtDate"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput disabled  label="专户现金余额（更新日期）" name="savingBalDate" v-model="form.savingBalDate"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :disabled="disabled"  :options="stockInfoList" :label="form.trantypeCode =='INV13'?'股权/有限合伙名称':'非私募基金类有限合伙公司名称'" @change="stockChange" customKey="proCode" customVal="proName" name="proCode" v-model="form.proCode"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :disabled="disabled" :options="form.trantypeCode =='INV13'?dicts.STOCK_TRAN_TYPE:dicts.FUND_TRAN_TYPE" label="交易类型" name="tranSubtypeCode" v-model="form.tranSubtypeCode"/>
        </BiCol>
         <BiCol>
           <BiInputCapitalAmount :isForm='true' :disabled="disabled" label="申请交易金额" name="payAmt"  v-model="form.payAmt"/>
        </BiCol>
        <BiCol>
          <BiInputCapitalAmount :isForm='true' :disabled="disabled" :label="form.isJointStock=='N'?'持股数量':'持股比例（%）'" name="payStake"  v-model="form.payStake"/>
        </BiCol>
        <BiCol>
          <BiInputCapitalAmount :isForm='true' :disabled="disabled" label="估值价值" name="valuationVal"  v-model="form.valuationVal"/>
        </BiCol>
        <BiCol>
          <BiFormItemDatePicker :disabled="disabled" label="申请交易日期" name="payDt" dateFormat='YYYY-MM-DD' v-model="form.payDt"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :disabled="disabled" :options="form.trantypeCode =='INV13'?dicts.STOCK_TCFS:dicts.FUND_TCFS" label="退出方式" name="exitWay" v-model="form.exitWay"/>
        </BiCol>
        <BiCol v-if="form.trantypeCode =='INV13'">
          <BiFormItemSelect :disabled="disabled" :options="dicts.YN" label="固有资金是否参与投资" name="isInvestment" v-model="form.isInvestment"/>
        </BiCol>
        <BiCol v-if="form.trantypeCode =='INV13'">
          <BiInputCapitalAmount :isForm='true' :disabled="disabled" label="固有资金投资金额" name="investmentAmt"  v-model="form.investmentAmt"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :disabled="disabled" :options="dicts.money_direzione" label="资金投向" name="moneyWay" v-model="form.moneyWay"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :disabled="disabled" :options="dicts.STOCK_YWZL" label="业务种类" name="businessType" v-model="form.businessType"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :disabled="disabled" :options="dicts.DECI_MAKER_TYPE" label="投资决策人" name="deciMakerType" v-model="form.deciMakerType"/>
        </BiCol>
        <BiCol v-if="form.trantypeCode =='INV14'">
          <BiFormItemSelect :disabled="disabled" :options="dicts.Y_N" label="是否聘请投资顾问" name="hasAdviser" v-model="form.hasAdviser"/>
        </BiCol>
      </a-row>

      <a-row>
        <a-col span="20" offset="1">
          <a-form-model-item label="备注">
            <a-textarea class="no-resize" :disabled="disabled" placeholder="请输入备注" allowClear :rows="4" v-model="form.memo"></a-textarea>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-card>
  </a-form-model>
</template>
<script>
import {queryCapitalAviAmt,findAviAmt,getStockInfoList} from '@/api/BiApi'
import { formatAmt } from '@utils/util'
import dictMixin from '@mixins/dictMixin'
let validateOverToday = (rule, value, callback) => {
  const today = new Date().toLocaleDateString()
  if (value === '') {
    callback(new Error('请选择申请交易日期!'));
  }
  //  else if ((new Date(today).getTime()-new Date(value).getTime())>0) {
  //   callback(new Error("申请交易日期应该大于等于今日!"));
  // } 
  else {
    callback();
  }
};
export default {
  name: "InvestmentInfo",
  mixins:[dictMixin],
  data(){
    return {
      stockInfoList:[],
      rules:{
        payDt: [
          { required: true, message: '请选择申请交易日期', trigger: 'change' },
          { validator: validateOverToday, trigger: 'change' }
        ],
        accNo: [
          { required: true, message: '请选择子账户名称', trigger: 'change' },
        ],
        payAmt: [
          { required: true, message: '请输入申请交易金额', trigger: 'blur'}
        ],
        payStake: [
      { required: true, message: '必填字段', trigger: 'blur'}
        ],
        exitWay: [
          { required: true, message: '请选择退出方式', trigger: 'change'}
        ],
        isInvestment: [
          { required: true, message: '请选择固有资金是否参与投资', trigger: 'change'}
        ],
        moneyWay: [
          { required: true, message: '请选择资金投向', trigger: 'change'}
        ],
        businessType: [
          { required: true, message: '请选择业务种类', trigger: 'change'}
        ],
        deciMakerType: [
          { required: true, message: '请选择投资决策人', trigger: 'change'}
        ],
        tranSubtypeCode: [
          { required: true, message: '请选择交易类型', trigger: 'change'}
        ],
        proCode: [
      { required: true, message: '必填字段', trigger: 'change'}
    ],
        hasAdviser: [
      { required: true, message: '请选择是否聘请投资顾问', trigger: 'change'}
    ],
      },
    }
  },
  components: {
  },
  computed: {
  },
  watch:{
    'form.trantypeCode'() {
      this.getStockInfoList()
    }
  },
  mounted(){
    //获取股权名称/合伙公司
    this.getStockInfoList();
  },
  props: {
    disabled:{
      default: false
    },
    form: {
      default(){
        return {
          payDt: new Date().toLocaleDateString().split('/').join('-'), //申请交易日期
        }
      }
    },
    cusAccInfoList:{
      default() {
        return []
      }
    },
    prjectInfoList:{
      default(){
        return []
      }
    }
  },
  methods: {
    validateInvestmentForm () {
      let isSuccess = false
      this.$refs.investmentForm.validate( async(valid) => {
        isSuccess = valid
      });
      return isSuccess
    },

    async stockChange(value){
      this.stockInfoList.forEach(stock=>{
        if (stock.proCode==value){
          this.form.isJointStock=stock.isJointStock
          this.$forceUpdate()
        }
      })
    },
    async changeAccCode(value){
      //先把上一次选择子账户带出的数据清空
      this.form.proName=''
      this.form.totalAmtDate=''
      this.form.savingBalDate=''
      this.cusAccInfoList.forEach(target=>{
        if (target.accNo==value){
          this.form.prjCode=target.prjCode;
          this.prjectInfoList.forEach(pro=>{
            if (target.prjCode==pro.prjCode){
              this.form.proName=pro.trustPrjName+'（'+pro.trustPrjCode+'）';
              this.findAmt(target);
            }
          })
        }
      })

    },
    async findAmt(target){
      // 获取可用余额
      console.log(target, 'target')
      const { result } = await queryCapitalAviAmt({prjCode:target.prjCode,accNo:target.accNo,proCode:''})
      this.form.totalAmtDate = (result.queryCapitalAviAmtDto && result.queryCapitalAviAmtDto.totalAmt || 0.00) + '  (' + (result.queryCapitalAviAmtDto && result.queryCapitalAviAmtDto.updateDate || '--') + ')'
      this.form.savingBalDate = (result.bankCardBalanceDto && result.bankCardBalanceDto.savingBal || 0.00) + '  (' + (result.bankCardBalanceDto && result.bankCardBalanceDto.flowDateStr || '--') + ')'
      //强制刷新组件（撤销订单后，切换子账户，系统可用余额、专户现金余额没有带出来）
      this.$forceUpdate()
    },
    async getStockInfoList(){
      let param={}
      if (this.form.trantypeCode=='INV13') {
        param.type='GQ'
      }
      if (this.form.trantypeCode=='INV14') {
        param.type='JJ'
      }

      const res = await getStockInfoList(param)
      if (res.success) {
        this.stockInfoList= res.result.filter(sto=>{
          if (sto.proName!='' && sto.proName!=null && sto.proName!=undefined) {
            return sto
          }
        })
      }
      this.$forceUpdate()
    }

  },
  created() {
    let that=this
    that.getDict('FUND_TCFS,STOCK_TRAN_TYPE,STOCK_TCFS,YN,STOCK_YWZL,DECI_MAKER_TYPE,money_direzione,FUND_TRAN_TYPE,Y_N')
  }
}
</script>
<style lang="stylus" scoped>

</style>