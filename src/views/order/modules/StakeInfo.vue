<template>
  <a-form-model ref="StakeInfoForm" :model="form" :rules="rules">
    <a-card size="small" style="margin-top: 12px" :bordered="false" :title='title'>
      <a-row>
        <a-col span="20" offset="1">
          <BiFormItemSelect disabled :options="cusAccInfoList" name="accNo" customKey="accNo" customVal="accName" label="子账户名称"
                            @change="changeAccCode($event)"  showSearch v-model="form.accNo"
                            placeholder="请选择"/>
        </a-col>
      </a-row>
      <a-row>
        <BiCol>
          <BiFormItemInput disabled  label="项目名称"  v-model="form.trustPrjName"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput disabled  label="项目编号" v-model="form.trustPrjCode"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect disabled  :options="stockInfoList" label="股权/有限合伙名称" customKey="proCode" customVal="proName" name="proCode" v-model="form.proCode"/>
        </BiCol>
      </a-row>

      <a-row>
        <BiCol>
          <BiFormItemDatePicker :disabled="disabled" label="实际成交日" name="actualTranDt" dateFormat='YYYY-MM-DD' v-model="form.actualTranDt"/>
        </BiCol>
        <BiCol>
          <BiInputCapitalAmount :isForm='true' :disabled="disabled" label="持股比例" name="actualTranStake"  v-model="form.actualTranStake"/>
        </BiCol>
        <BiCol>
          <BiInputCapitalAmount :isForm='true' :disabled="disabled" label="实际成交金额" name="actualTranAmt"  v-model="form.actualTranAmt"/>
        </BiCol>
      </a-row>
      <a-row >
        <a-col span="20" offset="1">
          <BiFormItemInput :disabled="disabled"  label="合同编号" name="refContractNo"  v-model="form.refContractNo"/>
        </a-col>
      </a-row>
      <a-row >
        <a-col span="20" offset="1">
          <BiFormItemInput :disabled="disabled"  label="合同名称" name="refContractName"  v-model="form.refContractName"/>
        </a-col>
      </a-row>
    </a-card>
  </a-form-model>
</template>
<script>
  import { getStockInfoList } from '@/api/BiApi'
  import dictMixin from '@mixins/dictMixin'
  let validateOverToday = (rule, value, callback) => {
    const today = new Date().toLocaleDateString()
    if (value === '') {
      callback(new Error('请选择实际成交日!'));
    } else if ((new Date(today).getTime()-new Date(value).getTime())>0) {
      callback(new Error("实际成交日应该大于等于今日!"));
    } else {
      callback();
    }
  };
  export default {
    name: 'StakeInfo',
    mixins:[dictMixin],
    data(){
      return {
        stockInfoList:[],
        rules:{
          actualTranDt: [
            { required: true, message: '请选择实际成交日', trigger: 'change' },
            { validator: validateOverToday, trigger: 'change' }
          ],
          actualTranAmt: [
            { required: true, message: '请输入资金交收金额', trigger: 'blur' },
          ],
          actualTranStake: [
            { required: true, message: '请输入持股比例', trigger: 'blur' },
          ],
          refContractNo: [
            { required: true, message: '请输入合同编号', trigger: 'blur' },
          ],
          refContractName: [
            { required: true, message: '请输入合同名称', trigger: 'blur' },
          ],

        },

      }
    },
    components: {
    },
    computed: {
    },
    mounted(){
      //获取股权名称/合伙公司
      this.getStockInfoList();
    },
    props: {
      disabled:{
        default: false
      },
      title:{
        default: '确认股权比例'
      },
      form: {
        default(){
          return {
            actualTranDt: new Date().toLocaleDateString().split('/').join('-'),
          }
        }
      },
      cusAccInfoList:{
        default() {
          return []
        }
      }
    },
    methods: {
      validateStakeInfoForm () {
        let isSuccess = false
        this.$refs.StakeInfoForm.validate( async(valid) => {
          isSuccess = valid
        });
        return isSuccess
      },
      async getStockInfoList(){
        let param={}
        if (this.form.tranTypeCode=='INV13') {
          param.type='GQ'
        }
        if (this.form.tranTypeCode=='INV14') {
          param.type='JJ'
        }

        const res = await getStockInfoList(param)
        if (res.success) {
          this.stockInfoList = res.result;
        }

      }
    },
    created() {
      this.getDict('STOCK_TRAN_TYPE,STOCK_TCFS,YN,STOCK_YWZL,DECI_MAKER_TYPE,money_direzione')
    }
  }
</script>
<style lang="stylus" scoped>

</style>