<template>
  <a-form-model ref="InvestmentFlowForm" :model="form" :rules="rules">
    <a-card size="small" style="margin-top: 12px" :bordered="false" :title='title'>
      <a-row >
        <a-col span="20" offset="1">
          <BiFormItemSelect disabled :options="cusAccInfoList" name="accNo" customKey="accNo" customVal="accName" label="子账户名称"
                            @change="changeAccCode($event)"  showSearch v-model="form.accNo"
                            placeholder="请选择"/>
        </a-col>
      </a-row>

      <a-row>
        <BiCol>
          <BiFormItemInput disabled  label="系统可用余额（更新日期）"  v-model="form.totalAmtDate"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput disabled  label="专户现金余额（更新日期）" v-model="form.savingBalDate"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiFormItemDatePicker disabled label="申请交易日期" name="payDt" dateFormat='YYYY-MM-DD' v-model="form.payDt"/>
        </BiCol>
        <BiCol>
          <BiInputCapitalAmount :isForm='true' disabled label="申请交易金额" name="payAmt"  v-model="form.payAmt"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
        <a-button  type="primary" @click="match">勾稽流水</a-button>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiFormItemDatePicker :disabled="disabled" label="资金交收日期" name="tranDt" dateFormat='YYYY-MM-DD' v-model="form.tranDt"/>
        </BiCol>
        <BiCol>
          <BiInputCapitalAmount :isForm='true' disabled label="资金交收金额" name="tranAmt"  v-model="form.tranAmt"/>
        </BiCol>
      </a-row>
    </a-card>
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
      <MatchFlow v-if="modal.visible" :odrCode="odrCode"  ref="matchFlow"/>
    </BiModal>
  </a-form-model>
</template>
<script>
  import { } from '@/api/BiApi'
  import dictMixin from '@mixins/dictMixin'
  import MatchFlow from '@views/fundFlow/MatchFlow'
  let validateOverToday = (rule, value, callback) => {
    const today = new Date().toLocaleDateString()
    if (value === '') {
      callback(new Error('请选择资金交收日期!'));
    } else if ((new Date(today).getTime()-new Date(value).getTime())>0) {
      callback(new Error("资金交收日期应该大于等于今日!"));
    } else {
      callback();
    }
  };
  export default {
    name: 'InvestmentFlow',
    mixins:[dictMixin],
    data(){
      return {
        rules:{
          tranDt: [
            { required: true, message: '请选择资金交收日期', trigger: 'change' },
            { validator: validateOverToday, trigger: 'change' }
          ],
          tranAmt: [
            { required: true, message: '请输入资金交收金额', trigger: 'blur' },
          ],

        },
        modal: {
          visible: false,
          title: '流水钩稽',
          fullscreen: false,
          switchFullscreen: false,
          confirmLoading: false,
        },

      }
    },
    components: {
      MatchFlow
    },
    computed: {
    },
    mounted(){
    },
    props: {
      disabled:{
        default: false
      },
      title:{
        default: '核对流水确认划款'
      },
      form: {
        default(){
          return {
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
      async handleOk(){
        this.form.mapCapitalYN='Y'
        this.modal.visible = false
        this.$emit('handleUpdate')
      },
      match() {
        this.modal.visible = true
        this.odrCode = this.form.odrCode
      },
    },
    created() {
      this.getDict('STOCK_TRAN_TYPE,STOCK_TCFS,YN,STOCK_YWZL,DECI_MAKER_TYPE,money_direzione')
    }
  }
</script>
<style lang="stylus" scoped>

</style>