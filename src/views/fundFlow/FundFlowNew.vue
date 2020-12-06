<template>
  <a-form-model ref="fundFlowForm" :model="form" :rules="rules">
    <a-row>
      <BiCol>
        <BiFormItemSelect :options="prjList" label="项目名称" name="trustPrjName" @change="changePrjName" :value="form.trustPrjName"  showSearch/>
      </BiCol>
      <BiCol>
        <BiFormItemInput label="项目编号" name="trustPrjCode" placeholder="请输入项目编号" v-model="form.trustPrjCode" disabled/>
      </BiCol>
      <BiCol>
        <BiFormItemInput label="交易流水号" name="flowNo" placeholder="请输入交易流水号" v-model="form.flowNo"/>
      </BiCol>
      <BiCol>
        <BiFormItemDatePicker :disabled='id?true:false' showTime label="交易日期" name="flowDateStr" dateFormat='YYYY-MM-DD HH:mm:ss' v-model="form.flowDateStr"/>
      </BiCol>
      <BiCol>
        <BiFormItemInput label="对方账号" name="tranAccNo" placeholder="请输入对方账号" v-model="form.tranAccNo"/>
      </BiCol>
      <BiCol>
        <BiFormItemInput label="对方账户户名" name="tranAccName" placeholder="请输入对方账户户名" v-model="form.tranAccName"/>
      </BiCol>
      <BiCol>
        <BiFormItemInput label="对方账户开户行" name="tranOpenBran" @click="selectTranOpenBran" showSearch v-model="form.tranOpenBran" />
      </BiCol>
      <BiCol>
        <BiFormItemSelect :options="dicts.CAP_IN_EXP" label="收支方向" name="incomeExpenses" v-model="form.incomeExpenses"/>
      </BiCol>
      <BiCol>
        <BiInputCapitalAmount name="flowAmt" :isForm='true' label="收支发生额" v-model="form.flowAmt" :min="0" :precision="2" :step="0.1"/>
        <!-- <BiFormItemNumPercent name="flowAmt" label="收支发生额" v-model="form.flowAmt" :min="0" :precision="2"/> -->
      </BiCol>
      <BiCol>
        <!-- <BiFormItemNumPercent name="savingBal" label="银行账号余额" v-model="form.savingBal" :min="0" :precision="2"/> -->
        <BiInputCapitalAmount name="savingBal" :isForm='true' label="银行账户余额" v-model="form.savingBal" :min="0" :precision="2"/>
      </BiCol>
      <BiCol>
        <BiFormItemSelect :options="dicts.CUR_CODE" label="币种" name="curCode" v-model="form.curCode"/>
      </BiCol>
      <BiCol>
        <BiFormItemTextarea label="摘要" placeholder="请输入摘要" v-model="form.memo"/>
      </BiCol>
    </a-row>
    <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-button @click="onSubmit" type="primary">保存</a-button>
        <a-button style="margin-left: 8px" @click="back">返回</a-button>
    </a-form-item>
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
  </a-form-model>
  
</template>

<script>
import { addTrxCapitalFlows, editTrxCapitalFlows,getPrjList,  getTrxCapitalFlow } from '@/api/BiApi'

import dictMixin from '@mixins/dictMixin'
import CusBankList from './CusBankList'
let validateOverToday = (rule, value, callback) => {
  const today = new Date()
  if (value === '') {
    callback(new Error('请选择交易日期!'));
  } else if ((new Date(today).getTime()-new Date(value).getTime())<0) {
    callback(new Error("交易日期应该不能超过当前时间!"));
  } else {
    callback();
  }
};
  export default {
    name: 'FundFlowNew',
    mixins:[dictMixin],
    inject:['closeCurrent'],
    provide (){ 
      return {
        getTranOpenBran:  this.getTranOpenBran
    }},
    components: {
      CusBankList
    },
    data () {
      return {
        form: {
          trustPrjName: '',
          prjCode: '',
          flowNo: '',
          // flowDateStr: '',
          tranAccNo: '',
          tranAccName: '',
          tranOpenBran: '',
          bankCode: '',
          incomeExpenses: '',
          flowAmt: '',
          savingBal: '',
          curCode: '',
          memo: '',
          accNo: '', //账户
          trustPrjCode: '',//项目编号
        },
        rules: {
          trustPrjName: [
            { required: true, message: '请选择项目名称', trigger: 'change' },
          ],
          trustPrjCode: [
            { required: true, message: '请输入项目编号', trigger: 'input' },
          ],
          flowDateStr: [
            { required: true, message: '请选择交易日期', trigger: 'change' },
            { validator: validateOverToday, trigger: 'change' }
          ],
          incomeExpenses: [
            { required: true, message: '请选择收支方向', trigger: 'change' },
          ],
          flowAmt: [
            { required: true, message: '请输入收支发生额', trigger: 'input' },
          ],
          savingBal: [
            { required: true, message: '请输入银行账户余额', trigger: 'input' },
          ],
          curCode: [
            { required: true, message: '请选择币种', trigger: 'change' },
          ],
        },
        prjList: [], // 项目
        modal: {
          visible: false,
          title: '选择开户行',
          fullscreen: false,
          switchFullscreen: false,
          confirmLoading: false,
        },
        id: ''
      }
    },
    methods: {
      async onSubmit () {
        this.$refs.fundFlowForm.validate( async(valid) => {
          if (valid) {
            let res = ''
            // 编辑
            if (this.id) {
              res = await editTrxCapitalFlows(this.form)
            } else {
              res = await addTrxCapitalFlows(this.form) // 新增
            }
            if (res.success) {
              this.$message.success('操作成功');
              this.back()
              
            }
          }
        });
      },
      changePrjName (value) {
        const selectPrj = this.prjList.filter(item=> { return item.value == value} )
        if( !selectPrj.length ){
          this.form.trustPrjName = ''
          this.form.accNo = ''
          this.form.prjCode = ''
          this.form.trustPrjCode = ''
          return
        }
        let { name, accNo, bankCode,trustPrjCode } = selectPrj[0]
        this.form.trustPrjName = name || ''
        this.form.accNo = accNo
        this.form.bankCode = bankCode || ''
        this.form.prjCode = value
        this.form.trustPrjCode = trustPrjCode
      },
      selectTranOpenBran () {
        this.modal.visible = true
      },
      // 获得开户行
      getTranOpenBran (selectionRows) {
        this.form.tranOpenBran = selectionRows[0].bankName
        // this.form.bankCode = selectionRows[0].bankCode
      },
      handleOk () {
        if( !this.form.tranOpenBran ){
          this.$message.warning('请选择一个开户行')
          return 
        }
        this.modal.visible = false
      },
      async getTrxCapitalFlow () {
        const res = await getTrxCapitalFlow({id:this.id})
        if( res.success ){
          this.form = {...this.form,...res.result}
        }
      },
      async getPrjList () {
        const res = await getPrjList({pageSize:999})
        if( res.success ){
          this.prjList = res.result.records.map(item=>{return { name:item.TRUST_PRJ_NAME,trustPrjCode:item.TRUST_PRJ_CODE,value:item.PRJ_CODE, accNo:item.ACC_NO,bankCode:item.BANK_CODE }})
        }
      },
      back () {
        this.form = {
          trustPrjName: '',
          prjCode: '',
          flowNo: '',
          // flowDateStr: '',
          tranAccNo: '',
          tranAccName: '',
          tranOpenBran: '',
          bankCode: '',
          incomeExpenses: '',
          flowAmt: '',
          savingBal: '',
          curCode: '',
          memo: '',
          accNo: '', //账户
          trustPrjCode: '',//项目编号
        }
        this.closeCurrent()
        this.$router.replace({ path: '/fundFlowList' })
      }
    },
    mounted() {

    },
    created() {
      // 获取项目
      this.getPrjList()
      this.getDict('CAP_IN_EXP,CAP_STATUS,CUR_CODE')
      if ( this.$route.query.id && this.$route.query.trustPrjName) {
        this.id = this.$route.query.id
        this.form.trustPrjName = this.$route.query.trustPrjName
        this.getTrxCapitalFlow()
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .card{
    margin-bottom: 24px;
  }
  .desc{
    line-height: 1
  }
</style>