<template>
  <a-form-model ref="form" :model="form" :rules="rules" >
    <a-spin :spinning="loading">
      <a-card size="small" title="信托设立费">
        <a-row :gutter="24">
         <a-col :span="8">
            <BiFormItemSelect :disabled="optType == 'view'"  :options="dicts.SETUP_FEE_NAMES" label="费用名称" name="feeType" v-model="form.feeType" />
          </a-col>
          <a-col :span="8">
            <BiFormItemSelect :disabled="optType == 'view'"  :options="dicts.FEE_CAP_SRC" label="资金来源" name="capitalSrc" v-model="form.capitalSrc" />
          </a-col>
          <a-col :span="8">
            <BiFormItemSelect v-if="form.capitalSrc!='1'&&form.capitalSrc!='2'" :disabled="optType == 'view'"  :options="dicts.FEE_PAYER_TYPE" label="支付方" name="payerType" v-model="form.payerType" />
          </a-col>
        </a-row>
        <a-row :gutter="24">
         <a-col :span="8">
            <BiFormItemSelect :disabled="optType == 'view'"  :options="dicts.CUR_CODE" label="币种" name="curCode" v-model="form.curCode" />
          </a-col>
           <a-col :span="8">
            <BiInputCapitalAmount :isForm='true' :disabled="optType == 'view'" label="金额" placeholder="请输入金额"  name="fee" v-model="form.fee" :min="0"  :precision="2"/>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <BiFormItemInput :disabled="optType == 'view'" label="付款账户户名" name="payAccName"  placeholder="请输入" v-model="form.payAccName" />
          </a-col>
          <a-col :span="8">
            <BiFormItemInput :disabled="optType == 'view'" label="付款账户" name="payAccNo" placeholder="请输入" v-model="form.payAccNo" />
          </a-col>
        </a-row>
        <a-row :gutter="24">
         <a-col :span="24">
            <BiFormItemInput :disabled="optType == 'view'" label="付款账户开户行" name="payAccOpenBank" placeholder="请输入" v-model="form.payAccOpenBank" />
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <BiFormItemInput :disabled="optType == 'view'" label="收款账户户名" name="rcvAccName"  placeholder="请输入" v-model="form.rcvAccName" />
          </a-col>
          <a-col :span="8">
            <BiFormItemInput :disabled="optType == 'view'" label="收款账户" name="rcvAccNo"              placeholder="请输入" v-model="form.rcvAccNo" />
          </a-col>
        </a-row>
        <a-row :gutter="24">
         <a-col :span="24">
            <BiFormItemInput :disabled="optType == 'view'" label="收款账户开户行" name="rcvAccOpenBank" placeholder="请输入" v-model="form.rcvAccOpenBank" />
          </a-col>
        </a-row>
        <a-row :gutter="24">
        <a-col :span="24">
          <BiFormItemTextarea :readonly="optType == 'view'"  label="备注" v-model="form.remarks" name="remarks" placeholder="备注"/>
        </a-col>
       </a-row>
      </a-card>
      <a-card size="small" title="资金来源" style="margin-top:30px" v-if="form.capitalSrc!='3'">
        <a-row :gutter="24" v-if="accInfoTypes.length>0&&optType !== 'view'">
          <a-col :span="24">
            <a-form-model-item label="子账户"  :wrapperCol="{span: 24}" prop="accInfo">
                <j-multi-select-tag v-model="form.accInfo" :options="accInfoTypes"  ></j-multi-select-tag>
            </a-form-model-item>
          </a-col>
        </a-row>
        <div class="table-operator" v-if="accInfoTypes.length>0&&optType !== 'view'">
          <a-button type="primary"  icon="plus" @click="addAccInfo" class="addBtton">新增</a-button>
        </div>
        <a-table :columns="conColumns" :dataSource="cusTrustSubAccInfoVos" rowKey="idx" row bordered>
          <template  slot="feeAmt" slot-scope="text, record">
            <div class="editable-row-operations inputStyle" >
              <BiInputCapitalAmount :disabled="optType == 'view'" :min="0"  label='' :precision="2" :value="text" @change="e => feeAmtChange(e, record.idx)" />
             
            </div>
          </template>
          <template  slot="operation" slot-scope="text, record">
            <div class="editable-row-operations" style="text-align:center">
                <a-popconfirm :disabled="optType == 'view'" title="确定删除吗?" @confirm="() => contactorDel(record.idx)">
                  <a > 删除</a>
                </a-popconfirm>
            </div>
          </template>
        </a-table>
      </a-card>
    </a-spin>
  </a-form-model>
</template>

<script>
import { saveAssignee, showAssignee } from '@/api/BiApi'
import JDSelectTag from '@comp/dict/JDSelectTag'
import { postAction, getAction, putAction } from '@api/manage'
import JMultiSelectTag from '@comp/dict/JMultiSelectTag'
import dictMixin from '@mixins/dictMixin'
export default {
  name: 'SetupFeeModal',
  components: {
    JDSelectTag,
    JMultiSelectTag
  },
  mixins: [dictMixin],
  props: {
    optType: {
      default: 'add'
    },
    prjCode:{
      default: ''
    },
    id: {
      default: ''
    }
  },
  data() {
    return {
      conColumns: [
            {
              title:'子账户名称',
              dataIndex: 'accName',
              align:"center",
            },
            {
              title:'受益权模式',
              dataIndex: 'bnfMode',
              align:"center",
              customRender: (text)=> this.getDictNameByCode(this.dicts.BNF_MODE,text)
            },
            {
              title:'可用现金金额',
              dataIndex: 'savingBal',
              align:"center",
              customRender:(text)=>{
                return parseFloat(text).toFixed(2)
              }
            },
            {
              title:'支付金额',
              dataIndex: 'feeAmt',
              align:"center",
              scopedSlots: { customRender: 'feeAmt' }
            },
            {
              title: '操作',
              align:"center",
              dataIndex: 'operation',
              width: '120px',
              scopedSlots: { customRender: 'operation' },
            }
        ],
      // accInfo:'',
      accInfoTypes:[],
      accData:[],
      payData:{},
      isFirst: 0,
      loading: false,
      rules: {
        accInfo:[{ required: true, message: '请选择子账户', trigger: 'change' }],
        capitalSrc: [{ required: true, message: '请选择资金来源', trigger: 'change' }],
        feeType: [{ required: true, message: '请选择费用名称', trigger: 'change' }],
        payerType: [{ required: true, message: '请选择支付方', trigger: 'change' }],
        curCode: [{ required: true, message: '请选择币种', trigger: 'change' }],
        fee: [{ required: true, message: '请输入金额', trigger: 'change' }],
        payAccName: [{ required: true, message: '请输入付款账户户名', trigger: 'change' }],
        payAccNo: [{ required: true, message: '请输入付款账户', trigger: 'change' }],
        payAccOpenBank: [{ required: true, message: '请输入付款账户开户行', trigger: 'change' }],
        rcvAccName: [{ required: true, message: '请输入收款账户户名', trigger: 'change' }],
        rcvAccNo: [{ required: true, message: '请输入收款账户', trigger: 'change' }],
        rcvAccOpenBank: [{ required: true, message: '请输入收款账户开户行', trigger: 'change' }],
      },
      form: {
        capitalSrc:'1'
      },
      url: {
        find: '/prj/cusTrustSetupfee/queryById',
        // getAccInfo:'/bankInterestSettlement/getAccInfo',
        getAccInfo:'/prj/cusTrustSetupfee/getAccInfoByPrjCode',
        getPayBank:'/prj/cusTrustSetupfee/getPayBank',
        getRcvBank:'/prj/cusTrustSetupfee/getRcvBank',
        save: '/prj/cusTrustSetupfee/add',
        edite: '/prj/cusTrustSetupfee/edit'
      },
      cusTrustSubAccInfoVos:[],
    }
  },
  watch: {
    id: function(newVal, oldVal) {
      this.getInfoDis()
    },
    'form.capitalSrc'(newVal) {
      if(this.id)
      return
      if(newVal=='3'){
        this.$set(this.form,'payAccName','')
        this.$set(this.form,'payAccNo','')
        this.$set(this.form,'payAccOpenBank','')
      }else{
        this.$set(this.form,'payAccName',this.payData.payAccName||'')
        this.$set(this.form,'payAccNo',this.payData.payAccNo||'')
        this.$set(this.form,'payAccOpenBank',this.payData.payAccOpenBank||'')
      }
    },
  },
  created() {
    this.getDictConfigs()
    
    if (this.id) {
      this.getInfoDis()
    } else{
      this.getPayBankInfo()
      this.getRcvBankInfo()
    }
  },
  mounted() {
    //mounted here
  },
  methods: {
    getRcvBankInfo(){
      this.loading = true
      getAction(this.url.getRcvBank,{prjCode:this.prjCode})
        .then(res => {
          if (res.success) {
            this.form.rcvAccName=res.result.rcvAccName||''
            this.form.rcvAccNo=res.result.rcvAccNo||''
            this.form.rcvAccOpenBank=res.result.rcvAccOpenBank||''
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.loading=false;
        })
    },
    getPayBankInfo(){
      this.loading = true
      getAction(this.url.getPayBank,{prjCode:this.prjCode})
        .then(res => {
          if (res.success) {
            this.payData=res.result
            this.$set(this.form,'payAccName',res.result.payAccName||'')
            this.$set(this.form,'payAccNo',res.result.payAccNo||'')
            this.$set(this.form,'payAccOpenBank',res.result.payAccOpenBank||'')
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.loading=false;
        })
    },
    feeAmtChange(value,idx){
      const newData = [...this.cusTrustSubAccInfoVos];
      const target = newData.filter(item => idx === item.idx)[0];
      if (target) {
        target['feeAmt'] = value;
        this.cusTrustSubAccInfoVos = newData;
      }
    },
    contactorDel(idx){
      this.cusTrustSubAccInfoVos.forEach((item,i)=>{
          if(item.idx==idx){
            this.cusTrustSubAccInfoVos.splice(i,1)
          }
        })
    },
    addAccInfo(){
      if(!this.form.accInfo){
        this.$message.error('请至少选择一项')
        return
      }
      this.form.accInfo.split(',').forEach((item,i)=>{
        var flag=this.cusTrustSubAccInfoVos.every((infoVo)=>{
          return item!=infoVo.accNo
        })
        if(flag){
          this.cusTrustSubAccInfoVos.unshift({
          accNo:item,accName:this.getAccName(item).accName,bnfMode:(this.getAccName(item).bnfMode||''),savingBal:(this.getAccName(item).savingBal||0),feeAmt:0,idx:this.cusTrustSubAccInfoVos.length>0?(this.cusTrustSubAccInfoVos[0].idx+1):0
        })
        }else{
          this.$message.error(`"${this.getAccName(item).accName}" 已存在`)
        }
      })
    },
    returnDict(dict) {
      dict.forEach(item => {
        item.name = item.text
      })
      return dict
    },
    getAccInfoTypes(){
      this.loading = true
      getAction(this.url.getAccInfo,{prjCode:this.prjCode})
        .then(res => {
          if (res.success) {
            if(res.result.length>0){
              this.savingBal=res.result[0].savingBal
              this.bnfMode=res.result[0].bnfMode
              this.accData=res.result
              this.accInfoTypes=res.result.map((item,idx)=>{
              return {value:item.accNo+'',title:item.accName,text:item.accName,active: "1"}
             })
            }
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.loading=false;
        })
    },
    getAccName(v){
      var acc={}
      for(var i=0;i<this.accData.length;i++){
        if(this.accData[i].accNo==v){
          acc=this.accData[i]
          break
        }
      }
      return acc
    },
    getDictConfigs() {
      this.loading = true
      let promises = [
          this.getAccInfoTypes(),
          this.getDict('FEE_NAMES_MSG,CUR_CODE,FEE_CAP_SRC,FEE_PAYER_TYPE,SETUP_FEE_NAMES,BNF_MODE'),
        ]
        Promise.all(promises).then((res)=>{
          this.loading = false
        })
    },
    getInfoDis() {
      this.loading = true
      getAction(this.url.find, { id: this.id })
        .then(res => {
          if (res.success) {
            this.form = res.result.cusTrustSetupfee
            this.cusTrustSubAccInfoVos=res.result.cusTrustSubAccInfoVos
            this.cusTrustSubAccInfoVos.forEach((item,idx)=>{
              idx==0?this.$set(this.form,'accInfo',item.accNo):this.$set(this.form,'accInfo',this.form.accInfo+','+item.accNo)
              item.idx=this.cusTrustSubAccInfoVos.length-1-idx
            })
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.loading=false;
        })
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          var infoVos=this.cusTrustSubAccInfoVos
          var infoVosName=''
          var flag=infoVos.some((item,index)=>{
              infoVosName=item.accName
              return parseInt(item.feeAmt)>(parseInt(item.savingBal))
          })
          if(flag){
            this.$message.error(`"${infoVosName}" 支付金额大于可用现金金额`)
            return
          }
          if(this.form.capitalSrc!='3'){
            var s=0
            infoVos.forEach((infoVosItem)=>{
              s+=parseInt(infoVosItem.feeAmt)
            })
            if(s!=(parseInt(this.form.fee)||0)){
              this.$message.error("所有子账号支付金额总和必须等于录入金额")
              return
            }
          }
          this.loading = true
          this.form.prjCode=this.prjCode
          var param = {
            cusTrustSetupfee:this.form,
            cusTrustSubAccInfoVos:this.cusTrustSubAccInfoVos
          }
          if (this.id && this.optType == 'edite') {
            this.$set(param.cusTrustSetupfee,'id',this.id)
            return putAction(this.url.edite, param)
              .then(res => {
                if (res.success) {
                  this.$emit('update')
                  this.$message.success('保存成功！')
                } else {
                  this.$message.error(res.message)
                }
              })
              .finally(() => {
                this.loading = false
              })
          } else {
            return postAction(this.url.save, param)
              .then(res => {
                if (res.success) {
                  this.$emit('update')
                  this.$message.success('保存成功！')
                } else {
                  this.$message.error(res.message)
                }
              })
              .finally(() => {
                this.loading = false
              })
          }
        } else {
          this.$message.error('校验未通过')
          return false
        }
      })
    }
  }
}
</script>

<style lang="stylus">
.table-operator .addBtton{
  float:right;
  margin: 0 8px 8px 0;
}
.inputStyle .ant-form-item{
  margin-top:12px;
  margin-bottom:12px;
}
</style>