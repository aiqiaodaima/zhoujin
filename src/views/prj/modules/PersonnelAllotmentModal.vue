<template>
  <a-form-model ref="form" :model="form" :rules="rules" v-cloak>
    <a-spin :spinning="loading">
      <a-card size="small" title="项目人员调配" v-if="rolecodeOptions.length>0">
        <a-row :gutter="24">
          <a-col :span="24">
            <BiFormItemSelect  :options="rolecodeOptions" label="调整角色"  v-model="form.roleCode" name="roleCode" />
          </a-col>
        </a-row>
        <a-row :gutter="24" v-if="form.roleCode&&imCodesNewTypes.length>0">
          <a-col :span="24">
            <a-form-model-item label="调整后人员"  :wrapperCol="{span: 24}" prop="imCodesNew2">
                <j-multi-select-tag v-model="form.imCodesNew2" :options="imCodesNewTypes"  ></j-multi-select-tag>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <BiFormItemSelect :options="dicts.PRJ_MEMBER_CG_RSN" label="调整原因"   v-model="form.updReason" name="updReason" />
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
import { initDictOptionsBatch } from '../../../components/dict/JDictSelectUtil'
import JMultiSelectTag from '../../../components/dict/JMultiSelectTag'
import dictMixin from '@mixins/dictMixin'
export default {
  name: 'PersonnelAllotmentModal',
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
    },
    selectedRowKeys:{
      default: []
    }
  },
  data() {
    return {
      roleCode:'',
      imCodesNew2:[],
      imCodesNewTypes:[],
      rolecodeOptions:[],
      imCodesNewOptions:[],
      dictOptionsData:[],
      loading: false,
      rules: {
        updReason:[{ required: true, message: '调整原因不能为空', trigger: ['change','blur'] },],
        roleCode: [{ required: true, message: '调整角色不能为空', trigger: ['change','blur'] },],
        imCodesNew2: [{ required: true, message: '调整后人员不能为空', trigger: ['change','blur'] },],
      },
      form: {},
      url: {
        save:'/prj/staffing/save',
        change: '/prj/cusFeeReguBank/queryById',
        getOptions:'/prj/staffing/getRole',
        getdicts:'/prj/staffing/getRoleUser'
      }
    }
  },
  watch:{
    'form.roleCode':function(newVal,oldVal){
      this.loading = true
      postAction(this.url.getdicts,{roleCode:newVal})
        .then(res => {
          if (res.success) {
            this.imCodesNewData=res.result
            this.imCodesNewTypes=res.result.map((item,idx)=>{
              return {value:idx+'',title:item.realname,text:item.realname,active: "1"}
            })
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.loading=false;
        })
    }
  },
  created() {
    this.getDictConfigs()
    this.loading = true
      let promises = [
          this.getDict('PRJ_MEMBER_CG_RSN')
        ]
        Promise.all(promises).then((res)=>{
          this.loading = false
        })
  },
  mounted() {
    //mounted here
  },
  methods: {
     getDictConfigs() {
      this.loading = true
      postAction(this.url.getOptions)
        .then(res => {
          if (res.success) {
            this.rolecodeOptions = res.result.map((item,idx)=>{
              return {value:item.roleCode,name:item.roleName}
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
          this.loading = true
          var imCodesNewArr=[]
          this.form.imCodesNew2.split(',').forEach((item)=>{
            imCodesNewArr.push(this.imCodesNewData[item].id)
          })

          console.log(this.form.imCodesNew2)
          var param={
            cusLoaUserMap:{}
          }
          param.imCodesNew=imCodesNewArr
          param.cusLoaUserMap.roleCode=this.form.roleCode
          param.updReason=this.form.updReason
          param.prjCodes=this.selectedRowKeys
          console.log('param=',param);
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