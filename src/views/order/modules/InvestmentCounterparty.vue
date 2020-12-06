<template>
  <a-form-model ref="investmentCounterpartyForm" :model="form" :rules="rules">
    <a-card size="small" style="margin-top: 12px" :bordered="false" title='交易对手'>
      <a-row>
        <BiCol >
          <BiFormItemSelect :disabled="disabled"  :options="dicts.STOCK_JYDSLX" label="交易对手类型" @change="counterpartTypeChange" name="counterpartType" v-model="form.counterpartType"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :disabled="disabled" :options="counterpartList" label="交易对手名称"  name="counterpartName" @change="counterpartNameChange" customKey="counterpartName" customVal="jydsqc" showSearch v-model="form.counterpartName"/>
        </BiCol>
        <BiCol >
          <BiFormItemInput :disabled="disabled"  label="户名" name="investmentAccName"  v-model="form.investmentAccName"/>
        </BiCol>
        <BiCol >
          <BiFormItemInput :disabled="disabled"  label="账户" name="investmentAccNo"  v-model="form.investmentAccNo"/>
        </BiCol>
        <BiCol >
          <BiFormItemSelect :disabled="disabled" :options="dicts.BANK_CODE" label="开户行" name="investmentAccOpenBank" v-model="form.investmentAccOpenBank"/>
        </BiCol>
      </a-row>

    </a-card>
  </a-form-model>
</template>

<script>
  import {getCounterpartList} from '@/api/BiApi'
  import dictMixin from '@mixins/dictMixin'
  export default {
    name: 'InvestmentCounterparty',
    mixins:[dictMixin],
    data(){
      return {
        counterpartList:[],
        rules:{
          counterpartType: [
            { required: true, message: '请选择交易对手类型', trigger: 'change' },
          ],
          counterpartName: [
            { required: true, message: '请选择交易对手名称', trigger: 'change' },
          ],
          investmentAccName: [
            { required: true, message: '请输入户名', trigger: 'blur'}
          ],
          investmentAccNo: [
            { required: true, message: '请输入账户', trigger: 'blur'}
          ],
          investmentAccOpenBank: [
            { required: true, message: '请选择开户行', trigger: 'change'}
          ],
        },

      }
    },
    components: {
    },
    computed: {
    },
    mounted(){

    },
    watch:{
      'form.counterpartType'(val) {
        let param={
          type:val
        }
        this.getCounterpartList(param)
      },
    },
    props: {
      disabled:{
        default: false
      },
      form: {
      },
    },
    methods: {
      validateinvestmentCounterparty () {
        let isSuccess = false
        this.$refs.investmentCounterpartyForm.validate( async(valid) => {
          isSuccess = valid
        });
        return isSuccess
      },
      counterpartNameChange(){
            this.counterpartList.filter(co=>{
              if (co.counterpartName==this.form.counterpartName){
                this.form.investmentAccName=co.zhmc
                this.form.investmentAccNo=co.zhhm
                if (this.form.counterpartType=='N'){
                  this.form.investmentAccOpenBank=co.khh
                } else {
                  this.form.investmentAccOpenBank=co.khhmc
                }

              }
            })
      },
      counterpartTypeChange(key){
        this.form.counterpartName=''
        this.form.investmentAccName=''
        this.form.investmentAccNo=''
        this.form.investmentAccOpenBank=''
        let param={}
        if (key=='Y'){
          param.type='Y'
        }
        if (key=='N'){
          param.type='N'
        }
        if (key=='F'){
          param.type='F'
        }
        this.getCounterpartList(param)
      },
      async getCounterpartList(param){
        const res = await getCounterpartList(param)
        if (res.success) {
          this.counterpartList = res.result.list
        }
      }

    },
    created() {
      this.getDict('STOCK_JYDSLX,BANK_CODE')
    }
  }
</script>

<style scoped>

</style>