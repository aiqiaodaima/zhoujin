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
                <BiFormItemInput label="名称" name="gdmc" placeholder="请输入名称" v-model="form.gdmc"/>
              </BiCol>
              <BiCol>
                <BiFormItemSelect :options="dicts.ORGIDNTYPES" label="证件类型" name="zjlx" v-model="form.zjlx"/>
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
  import JDate from '@/components/jeecg/JDate'
  import dictMixin from '@mixins/dictMixin'
  import biUploadMixin from '@mixins/biUploadMixin'
  import moment from 'moment'
  import JDateRange from '@/components/jeecg/JDateRange'
  import {proEastProjectsJydsjggdqueryById,proEastProjectsJydsjggdEdit,proEastProjectsJydsjggdAdd} from '@/api/BiApi'
  export default {
    name: 'GdNaturalPerson',
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

      disabled:{
        default: false
      },
      type: {
        default: 'add'
      },
      tabcar: {
        tabcar: ''
      },




    },
    data() {
      return {

        gdjginfo:[],
        files: [],
        editingId:'',
        optType:'',
        gdlx:'',
        gdjginfoItem: {
          "id": "",
          "xtjgdm": "",
          "jrxkzh": "",
          "xtjgmc": "",
          "shxydm": "",
          "dsmc": "ME",
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
          "zjkssj": "",
          "zjjssj": "",
          editable: true,
          mefilegroup:[],
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
            { required: true, message: '请输入名称', trigger: 'blur' }
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
          dsmc:'ME'
        },
        url: {
          find: '/prj/cusInfo/query',
          save: '/prj/cusInfo/add',
          edite: '/prj/cusInfo/edit'
        },
        dictOptionsData: []
      }
    },
    watch: {
      "form.cusBasicInfo.yxDate"(val){
        if(val[0]==''){
          this.currentDate=moment()
          this.form.cusBasicInfo.yxDate=[]
        }else{
          // if(val[0]!=undefined)
          // this.currentDate=moment(val[0], "YYYYMMDD")
        }
        this.form.cusBasicInfo.idnStdDt=val[0]||''
        this.form.cusBasicInfo.idnEndDt=val[1]||''
      },
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

        this.gdjginfoItem.gdlx=this.form.gdlx
        this.gdjginfoItem.gdmc=this.form.gdmc
        this.gdjginfoItem.zjlx=this.form.zjlx
        this.gdjginfoItem.gdzjhm=this.form.gdzjhm
        this.gdjginfoItem.zjkssj=this.form.zjkssj
        this.gdjginfoItem.zjjssj=this.form.zjjssj


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
              this.uploadFiles('GdMechanism', 'gdxxme' + res.result.id) //上传附件

              //获取返回储存的股东信息id 放入传递数组中，待列表信息补录完成后更新股东信息
              this.gdjginfoItem.id=res.result.id
              this.$emit('getReply', this.gdjginfoItem,this.groupindex)

            }
          }
          if(this.type=='edite') {

            //更新详情选项卡修改数据
            res = await proEastProjectsJydsjggdEdit(param)
            if (res.success) {
              this.$message.success('操作成功')
              this.$emit('update')
              // console.log("ceshifanhuizhi"+JSON.stringify(res))
              this.uploadFiles('GdMechanism', 'gdxxme' + res.result.id) //上传附件
              //获取返回储存的股东信息id 放入传递数组中，待列表信息补录完成后更新股东信息
              this.gdjginfoItem.id=res.result.id
              //回显已经保存的列表补录信息
              this.gdjginfoItem.kgfs = this.form.kgfs
              this.gdjginfoItem.czjr = this.form.czjr
              this.gdjginfoItem.bzlb = this.form.bzlb
              this.gdjginfoItem.cgbl = this.form.cgbl
              this.gdjginfoItem.cgsl = this.form.cgsl

              this.$emit('getReply', this.gdjginfoItem,this.groupindex)
            }

          }

        })

      },
      async proEastProjectsJydsjggdqueryById() {
        const res = await proEastProjectsJydsjggdqueryById({ id: this.id })
        if (res.success) {
          this.form=res.result
          this.getFiles('GdMechanism','gdxxme'+this.id)//附件回显
        }
      }
    },
    created() {
      if(this.partyCode){
        this.getInfoDis()
      }
      this.getDict('IDNTYPES,GQ_GDLX,ORGIDNTYPES')
    },
    mounted() {
      //if(this.type=='edite'){
        if (this.id&&this.tabcar==this.form.dsmc) {//在交易机构新增或者修改进股东弹窗时，只有前选项卡的数据才回显到表单
          this.proEastProjectsJydsjggdqueryById()
        }
     // }
    },
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