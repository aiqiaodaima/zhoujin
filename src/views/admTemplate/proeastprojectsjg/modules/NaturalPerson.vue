<template>
  <a-form-model ref="assetForm" :model="form" :rules="rules" v-cloak>
    <a-spin :spinning="loading">
       <a-layout :style="{margin:'0px'}">
          <a-layout-content :style="{margin:'8px'}">
            <a-card  title="基本信息" :bordered="false">
              <a-row>
                <BiCol>
                  <BiFormItemSelect :options="dicts.GQ_GDLX" label="股东类型" name="gdlx" v-model="form.gdlx"/>
                </BiCol>
                <BiCol>
                  <BiFormItemInput label="姓名" name="gdmc" placeholder="请输入姓名" v-model="form.gdmc"/>
                </BiCol>
                <BiCol>
                  <BiFormItemSelect :options="dicts.IDNTYPES" label="证件类型" name="zjlx" v-model="form.zjlx"/>
                </BiCol>
              </a-row>
                <a-row>
                <BiCol>
                  <BiFormItemInput label="证件号码" name="gdzjhm" placeholder="请输入证件号码" v-model="form.gdzjhm"/>
                </BiCol>
                <BiCol>
                  <BiRangeDatePicker label="有效期"  name="gdzjjssj"  :dateEnd="form.gdzjjssj" :dateStart="form.gdzjkssj" @change="changeDate($event,'gdzjkssj','gdzjjssj')"  />
                </BiCol>
              </a-row>
            </a-card>


            <a-card class="card" title="附件上传" :bordered="false">
              <br/>
              <a-row title="附件上传" :bordered="false">
                <BiCol>
                  <BiUpload v-model="files"></BiUpload>
                </BiCol>
                <br/>
              </a-row>
              <br/>
            </a-card>


          </a-layout-content>
          <a-layout-footer :style="{ position: 'fixed', zIndex: 1, right:'12px', textAlign: 'center',left:'12px' , bottom:0 , background:'#fff'}">
   <!--         <a-button @click="toBack" v-if="optType=='view'">返回</a-button>
            <a-button @click="doSave" v-if="optType!='view'">暂存</a-button>-->
            <a-button type="primary" @click="doSave" style="margin-left: 70px;" v-if="optType!='view'">提交</a-button>

          </a-layout-footer>
       </a-layout>
    </a-spin>
  </a-form-model>
</template>

<script>

import JDSelectTag from '@comp/dict/JDSelectTag'
import biUploadMixin from '@mixins/biUploadMixin'
import JDate from '@/components/jeecg/JDate'
import dictMixin from '@mixins/dictMixin'
import JDateRange from '@/components/jeecg/JDateRange'
import {proEastProjectsJydsjggdqueryById,proEastProjectsJydsjggdEdit,proEastProjectsJydsjggdAdd} from '@/api/BiApi'
export default {
  name: 'NaturalPerson',
  inheritAttrs:false,
  components: {
    JDateRange,
    JDSelectTag,
    JDate
  },
  mixins: [dictMixin,biUploadMixin],
  props: {

    prjCode:{
      default: ''
    },
    id: {
      default: ''
    },
    partyCode:{
      default: ''
    },
    type: {
      default: 'add'
    },
    groupindex: {
      default: '-1'
    },
    tabcar: {
      tabcar: ''
    },



    disabled:{
        default: false
    },

  },
  data() {
    return {
      gdgrinfo:[],
      files: [],
     // gdlx: '',
      datainfo:{},

      gdgrinfoItem: {
        "id": "",
        "xtjgdm": "",
        "jrxkzh": "",
        "xtjgmc": "",
        "shxydm": "",
        "dsmc": "NP",
        "dsbh": "",
        "gdlx": "",
        "gdmc": "",
        "kgfs": "",
        "cgbl": "",
        "zjlx": "",
        "gdzjhm": "",
        "czjr": "",
        "bzlb": "",
        "cgsl": "",
        "gdzjkssj": "",
        "gdzjjssj": "",
        editable: true,
        isNew: true
      },
      record:{},
      isFirst: 0,
      loading: false,
      rules:{
        gdlx: [
          { required: true, message: '请选择股东类型', trigger: 'change' }
        ],
        gdmc: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        zjlx: [
          { required: true, message: '请选择证件类型', trigger: 'blur' }
        ],
        gdzjhm: [
          { required: true, message: '请输入证件号码', trigger: 'blur' }
        ],
        gdzjjssj: [
          { required: true, message: '请输入证件有效期', trigger: 'change' }
        ]
        },
      form: {
        dsmc:'NP'

      },

    }
  },
  watch: {

  },
  created() {

    if(this.partyCode){
      this.getInfoDis()
    }
    this.getDict('IDNTYPES,GQ_GDLX,ORGIDNTYPES')
  },
  methods: {
    changeDate(val, startKey, endKey, childKey) {
      this.$set(childKey ? this.form[childKey] : this.form, startKey, val[0] || '')
      this.$set(childKey ? this.form[childKey] : this.form, endKey, val[1] || '')
    },
    toBack(){
       this.$router.push({name:"customer-customer"});
    },

    doSave(){
      //将详情填写内容回显到列表
      this.gdgrinfoItem.gdlx=this.form.gdlx
      this.gdgrinfoItem.gdmc=this.form.gdmc
      this.gdgrinfoItem.zjlx=this.form.zjlx
      this.gdgrinfoItem.gdzjhm=this.form.gdzjhm
      this.gdgrinfoItem.gdzjkssj=this.form.gdzjkssj
      this.gdgrinfoItem.gdzjjssj=this.form.gdzjjssj

      let res = ''
      let param = {
        ppjggd:{...this.form},
        files:[]
      }

      this.$refs.assetForm.validate(async (valid) => {
        if (valid && this.type == 'add') {
          res = await proEastProjectsJydsjggdAdd(param)
          if (res.success) {
            this.$message.success('操作成功')
            this.$emit('update')
            // console.log("ceshifanhuizhi"+JSON.stringify(res))
            this.uploadFiles('GdNaturalPerson', 'gdxxnp' + res.result.id) //上传附件

            //获取返回储存的股东信息id 放入传递数组中，待列表信息补录完成后更新股东信息
            this.gdgrinfoItem.id=res.result.id
            this.$emit('getReply', this.gdgrinfoItem,this.groupindex)

          }
        }
        if(this.type=='edite') {

          //更新详情选项卡修改数据
          res = await proEastProjectsJydsjggdEdit(param)
          if (res.success) {
            this.$message.success('操作成功')
            this.$emit('update')
            this.uploadFiles('GdNaturalPerson', 'gdxxnp' + res.result.id) //上传附件
            //获取返回储存的股东信息id 放入传递数组中，待列表信息补录完成后更新股东信息
            this.gdgrinfoItem.id=res.result.id
            //回显已经保存的列表补录信息
            this.gdgrinfoItem.kgfs = this.form.kgfs
            this.gdgrinfoItem.czjr = this.form.czjr
            this.gdgrinfoItem.bzlb = this.form.bzlb
            this.gdgrinfoItem.cgbl = this.form.cgbl
            this.gdgrinfoItem.cgsl = this.form.cgsl

            this.$emit('getReply', this.gdgrinfoItem,this.groupindex)
          }

        }

      })



    },
    async proEastProjectsJydsjggdqueryById() {
      const res = await proEastProjectsJydsjggdqueryById({ id: this.id })
      if (res.success) {
        this.form=res.result
        this.getFiles('GdNaturalPerson','gdxxnp'+this.id)//附件回显

      }
    }

  },
  mounted() {

    if (this.id&&this.tabcar==this.form.dsmc) {//在交易机构新增或者修改进股东弹窗时，只有前选项卡的数据才回显到表单
        this.proEastProjectsJydsjggdqueryById()
      }


  }
}
</script>

<style lang="scss" scoped>
@import '~@assets/less/common.less';
.ant-tabs-nav .ant-tabs-tab{
  margin: 0;
}
 /deep/ .ant-table-wrapper{
  clear: both;
}
</style>