<template>
  <a-form-model ref="fundFlowForm" :model="form" :rules="rules">
    <a-card class="card" title="证券资金账户信息" :bordered="false">
      <a-row>
        <BiCol>
          <BiFormItemSelect :options="prjList" label="项目名称" name="trustPrjName" @change="changePrjName" :value="form.trustPrjName"  showSearch/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="项目编号" name="trustPrjCode" placeholder="请输入项目编号" v-model="form.trustPrjCode" disabled/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.PRJ_SEC_COMPANY" label="证券公司" name="secCompany" v-model="form.secCompany" />
        </BiCol>
        <BiCol>
          <BiFormItemInput label="证券资金账号" v-model="form.secCapNo" name="secCapNo"  placeholder="请输入银行账号"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="沪市股东账号" name="hsHolderNo" placeholder="请输入沪市股东账号" v-model="form.hsHolderNo"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="深市股东账号" name="ssHolderNo" placeholder="请输入深市股东账号" v-model="form.ssHolderNo"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="密码" name="password" placeholder="请输入密码" v-model="form.password"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.ACCOUNT_STATUS" label="账户状态" name="accStatus" v-model="form.accStatus"/>
        </BiCol>
        <BiCol>
          <BiFormItemDatePicker label="开户日期" name="accOpenDt"  v-model="form.accOpenDt"/>
        </BiCol>
        <BiCol>
          <BiFormItemDatePicker label="销户日期" name="accDesDt"  v-model="form.accDesDt"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.BANK_CODE" label="三方存管" name="triDeposit" v-model="form.triDeposit"/>
        </BiCol>
        <BiCol>
          <BiFormItemCascader name="areas" label="开户地址" v-model="form.areas" :needCountry='false'/>
        </BiCol>
        <BiCol>
          <BiFormItemInput name="address" label="详细地址"  placeholder="请输入详细地址" v-model="form.address"/>
        </BiCol>
        <BiCol>
          <BiFormItemTextarea label="备注" placeholder="请输入备注" v-model="form.memo"/>
        </BiCol>
      </a-row>
    </a-card>
    <a-card class="card" title="附件" :bordered="false">
      <a-row style="margin-bottom: 10px;">
        <BiCol>
          <BiUpload v-model="files"></BiUpload>
        </BiCol>
      </a-row>
    </a-card>
    <div class="btns">
      <a-button @click="onSubmit" type="primary" v-if="type !== 'view'">提交审核</a-button>
      <a-button style="margin-left: 8px" @click="back">返回</a-button>
    </div>
  </a-form-model>
</template>

<script>
import { saveOrUpdate,getPrjList,findById } from '@/api/BiApi'
 
import dictMixin from '@mixins/dictMixin'
import biUploadMixin from '@mixins/biUploadMixin'

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
    mixins:[dictMixin,biUploadMixin],
    inject:['closeCurrent'],
    provide (){
      return {
        getTranOpenBran:  this.getTranOpenBran
    }},
    components: {
    },
    data () {
      return {
        areas:[],
        form: {
          trustPrjName: '',
          prjCode: '',
          secCompany: '',
          secCapNo: '',
          hsHolderNo: '',
          ssHolderNo: '',
          password: '',
          accStatus: '',
          accOpenDt: '',
          accDesDt: '',
          triDeposit: '',//三方存管
          bankCode:'',//三方存管字典是从设立项目中的银行那里获取的
          memo: '',
          accNo: '', //账户
          trustPrjCode: '',//项目编号
          provCode: '',
          cityCode:'',
          countyCode:'',
          address: '',//详细地址
          areas: [],
        },
        rules: {
          trustPrjName: [
            { required: true, message: '请选择项目名称', trigger: 'change' },
          ],
          trustPrjCode: [
            { required: true, message: '请输入项目编号', trigger: 'blur' },
          ],
          flowDateStr: [
            { required: true, message: '请选择交易日期', trigger: 'change' },
            { validator: validateOverToday, trigger: 'change' }
          ],
          secCompany: [
            { required: true, message: '请选择证券公司', trigger: 'change' },
          ],
          secCapNo: [
            { required: true, message: '请输入证券资金账号', trigger: 'blur' },
          ],
          hsHolderNo: [
            { required: true, message: '请输入沪市股东账号', trigger: 'blur' },
          ],
          ssHolderNo: [
            { required: true, message: '请输入深市股东账号', trigger: 'blur' },
          ],
          address: [
            { required: true, message: '请输入详细地址', trigger: 'blur' },
          ],
          areas: [
            { required: true, message: '请选择开户地址', trigger: 'change' },
          ],
          accStatus: [
            { required: true, message: '请选择账户状态', trigger: 'change' },
          ],
          triDeposit: [
            { required: true, message: '请选择三方存管', trigger: 'change' },
          ],
        },
        prjList: [], // 项目
        files:'',
        id: '',
        type: '',
      }
    },
    methods: {
      async onSubmit () {
        this.$refs.fundFlowForm.validate( async(valid) => {
          if(this.form.accOpenDt && this.form.accDesDt){
            if(new Date(this.form.accOpenDt) > new Date(this.form.accDesDt)){
              this.$message.warning('销户日期不能早于开户日期')
              return
            }
          }
          if( this.form.areas.length ){
            this.form.provCode = this.form.areas[0],
            this.form.cityCode = this.form.areas[1],
            this.form.countyCode = this.form.areas[2]
          }
          if (valid) {
            let res = ''
            // 编辑
            if (this.id) {
              res = await saveOrUpdate(this.form)
            } else {
              res = await saveOrUpdate(this.form) // 新增
            }
            if (res.success) {
              this.$message.success('操作成功');
              let id = this.id || res.result.id
               // 上传文件
              this.uploadFiles('securitiesAccount',id)

              this.closeCurrent()
              this.$router.replace({ path: '/securitiesAccount/securitiesAccountList' })
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
      async getPrjList () {
        const res = await getPrjList({pageSize:999})
        if( res.success ){
          this.prjList = res.result.records.map(item=>{return { name:item.TRUST_PRJ_NAME,trustPrjCode:item.TRUST_PRJ_CODE,value:item.PRJ_CODE, accNo:item.ACC_NO,bankCode:item.BANK_CODE }})
        }
      },
      async findById(){
        const res = await findById({id:this.id})
        // 获取文件
        this.getFiles('securitiesAccount',this.id)

        this.areas = [res.result.provCode, res.result.cityCode, res.result.countyCode]
        if( res.success ){
          this.form = {...res.result,areas:this.areas}
        }
      },
      back () {
        this.closeCurrent()
        // this.$router.replace({ path: '/securitiesAccount/securitiesAccountList' })
      }
    },
    mounted() {

    },
    created() {
      // 获取项目
      this.getPrjList()
      // 加了一个BANK_CODE
      this.getDict('PRJ_SEC_COMPANY,ACCOUNT_STATUS,TRIPARTITE_CUSTODY,BANK_CODE')
      if ( this.$route.query.id) {
        this.id = this.$route.query.id
        this.type = this.$route.query.type || ''
        this.form.trustPrjName = this.$route.query.trustPrjName
        this.findById()
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .card{
    margin-bottom: 12px;
  }
  .desc{
    line-height: 1
  }
  .btns{
    position: fixed;
    bottom: 10px;
    left: 50%;
  }
</style>