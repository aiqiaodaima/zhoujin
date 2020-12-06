<template>
  <a-form-model ref="form" :model="form" :rules="rules">
    <a-spin :spinning="loading">
      <a-card size="small" title="费用收款信息">
        <a-row :gutter="24">
         <a-col :span="8">
            <BiFormItemSelect v-if="dicts.FEE_NAMES&&dicts.FEE_NAMES.length>0" :disabled="optType == 'view'"  :options="dicts.FEE_NAMES.slice(0,2)" label="费用性质" name="feeCatCode" v-model="form.feeCatCode" />
          </a-col>
         <a-col :span="8">
            <BiFormItemSelect  v-if="typeOrsubTypes&&typeOrsubTypes.length>0" :disabled="optType == 'view'" :options="typeOrsubTypes" label="费用名称" name="feeTypeCode" v-model="form.feeTypeCode" />
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <BiFormItemInput :disabled="optType == 'view'" label="户名" name="accName" placeholder="请输入" v-model="form.accName" />
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <BiFormItemInput :disabled="optType == 'view'" label="账号" name="accNo" placeholder="请输入" v-model="form.accNo" />
          </a-col>
        </a-row>
        <a-row :gutter="24">
         <a-col :span="24">
            <BiFormItemInput :disabled="optType == 'view'" label="开户行" name="accOpenBank" placeholder="请输入" v-model="form.accOpenBank" />
          </a-col>
        </a-row>
        <a-row :gutter="24">
        <a-col :span="24">
          <BiFormItemTextarea :disabled="optType == 'view'"  label="备注" v-model="form.remarks" name="remarks" placeholder="备注"/>
        </a-col>
      </a-row>
      </a-card>
    </a-spin>
  </a-form-model>
</template>

<script>
import { saveAssignee, showAssignee } from '@/api/BiApi'
import JDSelectTag from '@comp/dict/JDSelectTag'
import { postAction, getAction, putAction } from '@api/manage'
import dictMixin from '@mixins/dictMixin'
import * as customizeConfigs from '@/customizeConfig'
export default {
  name: 'FeeAccountModal',
  components: {
    JDSelectTag
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
    },
    businessKey: {
      default: ''
    }
  },
  data() {
     let customizeEnv = customizeConfigs.customizeEnv
    return {
      customizeEnv :customizeEnv,
      typeOrsubTypes: [],
      isFirst: 0,
      loading: false,
      rules: {
        feeCatCode: [{ required: true, message: '请选择费用性质', trigger: 'change' }],
        feeTypeCode: [{ required: true, message: '请选择费用名称', trigger: 'change' }],
        accName: [{ required: true, message: '请输入户名', trigger: 'change' }],
        accNo: [{ required: true, message: '请输入账号', trigger: 'change' }],
        accOpenBank: [{ required: true, message: '请输入开户行', trigger: 'change' }]
      },
      form: {},
      url: {
         // typeOrsubType: 'sys/dict/typeOrsubType', 
        typeOrsubType: 'sys/dict/getSonType',  
        find: '/prj/cusFeeReguBank/queryById',
        save: '/prj/cusFeeReguBank/add',
        edite: '/prj/cusFeeReguBank/edit'
      },
      dictOptionsData: []
    }
  },
  watch: {
    'form.feeCatCode': function(newVal, oldVal) {
        this.isFirst++
        let param = {
          dictCode: 'FEE_NAMES',
          parentValue: newVal || '01'
        }
        if (this.isFirst > 1) {
          getAction(this.url.typeOrsubType, param)
            .then(res => {
              if (res.success) {
                //this.typeOrsubTypes=res.result
                this.typeOrsubTypes = this.returnDict(res.result)
                if (this.typeOrsubTypes.length > 0) {
                  this.form.feeTypeCode = this.typeOrsubTypes[0].value
                } else {
                  this.form.feeTypeCode = ''
                }
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
    },
    id: function(newVal, oldVal) {
      this.getInfoDis()
    }
  },
  created() {
    //businessKey不为空，则为从审批页面进入
    if(this.businessKey){
      var bankRuleId=this.businessKey.split(':')[1]
      if(bankRuleId){
        this.id = bankRuleId
        this.optType = 'view'
      }
    }
    // 户名、账户默认值
    if(this.customizeEnv === 'zrt'){
       this.form.accName = '北京龙宇亿腾印刷设计有限公司工行北京九龙山支行营业室';
      this.form.accNo = '0200096209000113633'
    }
    if (this.id) {
      this.getInfoDis()
    }else{
      this.getDictConfigs()
    }    
  },
  mounted() {
    //mounted here
  },
  methods: {
    returnDict(dict) {
      dict.forEach(item => {
        item.name = item.text
      })
      return dict
    },
    getDictConfigs() {
      this.loading = true
      let promises = [
          this.getDict('FEE_NAMES,FEE_NAMES_MSG,TEMPLATE_COST_NAME')
        ]
        Promise.all(promises).then((res)=>{
          let param = {
              dictCode: 'FEE_NAMES',
              parentValue: this.form.feeCatCode || '01'
            }
            getAction(this.url.typeOrsubType, param).then(res => {
              if (res.success) {
                this.typeOrsubTypes = this.returnDict(res.result)
              }
            })
        }).finally(() => {
          this.loading = false
        })
    },
    getInfoDis() {
      this.loading = true
      getAction(this.url.find, { id: this.id })
        .then(res => {
          if (res.success) {
            this.form = res.result
            this.getDictConfigs()
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
          this.loading = true
          const param = this.form
          param.prjCode=this.prjCode
          if (this.id && this.optType == 'edite') {
            param.id = this.id
            return putAction(this.url.edite, param)
              .then(res => {
                if (res.success) {
                  var processId=''
                  if(res.result){
                    processId=res.result.processId||''
                  }
                  this.$emit('update',processId)
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
                  var processId=''
                  if(res.result){
                    processId=res.result.processId||''
                  }
                  this.$emit('update',processId)
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

<style lang="stylus" scoped>
@import '~@assets/less/common.less';
</style>