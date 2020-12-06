<template>   
  <a-form-model ref="form" :model="form" :rules="rules" v-cloak>
    <a-spin :spinning="loading">
      <a-card size="small" title="分配条款">
        <a-row :gutter="24">
          <a-col :span="24">
            <BiFormItemInput
              :disabled="optType == 'view'"
              label="模板名称"
              name="name"
              placeholder="请输入模板名称"
              v-model="form.name"
            />
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <BiFormItemSelect
              :disabled="optType == 'view'"
              v-if="dicts.KYC_DIST_NAME&&dicts.KYC_DIST_NAME.length>0"
              :options="dicts.KYC_DIST_NAME.slice(0,3)"
              label="分配类型"
              name="disType"
              v-model="form.disType"
            />
          </a-col>
          <a-col :span="8">
            <BiFormItemSelect
              v-if="typeOrsubTypes&&typeOrsubTypes.length>0"
              :disabled="optType == 'view'"
              :options="typeOrsubTypes"
              label="分配细类"
              name="disSubType"
              v-model="form.disSubType"
            />
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <BiFormItemSelect
              :disabled="optType == 'view'"
              :options="dicts.CONTRACT_SERIE"
              label="合同系列"
              name="contractSerie"
              v-model="form.contractSerie"
            />
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <BiFormItemTextarea
              :disabled="optType == 'view'"
              label="分配规则"
              v-model="form.disRule"
              name="disRule"
              placeholder="分配规则"
            />
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <BiFormItemTextarea
              :readonly="optType == 'view'"
              label="金额及频次限制"
              v-model="form.disAmtRate"
              name="disAmtRate"
              placeholder="金额及频次限制"
            />
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <BiFormItemTextarea
              :readonly="optType == 'view'"
              label="验证要求"
              v-model="form.validationRequired"
              name="validationRequired"
              placeholder="验证要求"
            />
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <BiFormItemTextarea
              ref="textarea"
              :readonly="optType == 'view'"
              label="特别约定"
              v-model="form.appoint"
              name="appoint"
              placeholder="特别约定"
            />
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
export default {
  name: 'KYCAllocationSchemeModal',
  components: {
    JDSelectTag
  },
  mixins: [dictMixin],
  props: {
    optType: {
      default: 'add'
    },
    id: {
      default: ''
    }
  },
  data() {
    return {
      isFirst: 0,
      typeOrsubTypes: [],
      loading: true,
      rules: {
        name: [{ required: true, message: '请输入模板名称', trigger: 'change' }],
        disType: [{ required: true, message: '请选择分配类型', trigger: 'change' }],
        disSubType: [{ required: true, message: '请选择分配细类', trigger: 'change' }],
        contractSerie: [{ required: true, message: '请选择合同系列', trigger: 'change' }]
      },
      form: {
         disSubType:''
      },
      url: {
        typeOrsubType: 'sys/dict/typeOrsubType', //分配细类字典项
        find: '/baseline/admkyv/queryById',//查看
        save: '/baseline/admkyv/add',//添加
        
      },
      dictOptionsData: []
    }
  },
  watch: {
    id: function(newVal, oldVal) {
      this.getInfoDis()
    },
    'form.disType': function(newVal, oldVal) {
      this.isFirst++
      let param = {
        dictCode: 'KYC_DIST_NAME',
        parentValue: newVal || '01'
      }
      if (this.isFirst > 0) {
        //this.loading=true;
        getAction(this.url.typeOrsubType, param)
          .then(res => {
            if (res.success) {
              //this.typeOrsubTypes=res.result
              this.typeOrsubTypes = this.returnDict(res.result)
              if (this.typeOrsubTypes.length > 0) {
                if(this.form.disSubType)
                this.form.disSubType = this.typeOrsubTypes[0].value
              } else {
                this.form.disSubType = ''
              }
            }
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  },
  created() {
    if (this.id) {
      this.getInfoDis()
    } else {
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
      let promises = [this.getDict('CONTRACT_SERIE,KYC_DIST_NAME')]
      Promise.all(promises)
        .then(res => {
          let param = {
            dictCode: 'KYC_DIST_NAME',
            parentValue: this.form.disType || '01'
          }
          getAction(this.url.typeOrsubType, param).then(res => {
            if (res.success) {
              this.typeOrsubTypes = this.returnDict(res.result)
            }
          })
        })
        .finally(() => {
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
        })
        .finally(() => {
          //this.loading=false;
        })
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const param = this.form
          if (this.id && this.optType == 'edite') {
            param.id = this.id
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

<style lang="stylus" scoped>
@import '~@assets/less/common.less';
</style>