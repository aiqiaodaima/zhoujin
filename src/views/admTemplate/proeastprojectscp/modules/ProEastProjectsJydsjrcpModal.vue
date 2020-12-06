<template>
  <a-form-model ref="assetForm" :model="form" :rules="rules">
    <a-card class="card" title="基本信息" :bordered="false">
      <a-row>
        <BiCol>
          <BiFormItemInput label="名称" :disabled="disabled" name="jydsbh" placeholder="请输入名称" v-model="form.jydsbh"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="统一社会信用代码" :disabled="disabled" name="tyshxydm" placeholder="请输入统一社会信用代码" v-model="form.tyshxydm"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.CUS_CATEGORY_ORGAN" label="机构类型":disabled="disabled"  name="jydsqc" v-model="form.jydsqc"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiFormItemSelect :options="dicts.COOPERATE_TYPE" label="合作方式" :disabled="disabled"  name="hezfs" v-model="form.hezfs"/>
        </BiCol>
        <BiCol>
          <BiInputCapitalAmount name="zczb" :isForm='true' label="注册资本":disabled="disabled"  v-model="form.zczb" :min="0" :precision="2"/>
        </BiCol>
        <BiCol>
          <BiFormItemDatePicker label="工商注册日期" :disabled="disabled"  name="gszcrq" dateFormat='YYYY-MM-DD' v-model="form.gszcrq"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiFormItemSelect :options="dicts.AREA_CODE" label="所属国别/地区" :disabled="disabled"  name="ssgb" v-model="form.ssgb" />
        </BiCol>
        <BiCol>
          <BiFormItemCascader label="所属区域" :disabled="disabled"  v-model="ssareas" name="ssareas" :needCountry='false'/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="注册地址" :disabled="disabled"  placeholder="请输入注册地址" name="ssdq" v-model="form.ssdq"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiFormItemTextarea label="经营范围":disabled="disabled"  name="jyfw" v-model="form.jyfw" placeholder="请输入经营范围"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="资管产品产品代码" :disabled="disabled" name="zgcpcpdm" placeholder="请输入资管产品产品代码" v-model="form.zgcpcpdm"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="管理人":disabled="disabled"  name="glrmc" placeholder="请输入管理人" v-model="form.glrmc"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiFormItemSelect label="是否本公司发行产品" :disabled="disabled" :options="dicts.y_n" name="sfbgsfxcp" v-model="form.sfbgsfxcp"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect label="是否关联方发行产品":disabled="disabled"  :options="dicts.y_n" name="sfglffxcp" v-model="form.sfglffxcp"/>
        </BiCol>
      </a-row>

    </a-card>



    <a-card class="card" title="法定代表人或负责人" :bordered="false">
      <a-form-item label="类型"  slot="extra" style="width: 200px;margin: 0;padding: 0;" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
        <j-d-select-tag  v-if="type !== 'view'" dict-code="NATURAL_YN" v-model="form.frdblx"></j-d-select-tag>
        <span v-else v-text="this.getDictNameByCode(this.dicts.NATURAL_YN,form.frdblx)"></span>
      </a-form-item>
      <a-row>
        <BiCol>
          <BiFormItemInput label="姓名/名称" :disabled="disabled" name="fddbr" placeholder="请输入姓名/名称" v-model="form.fddbr"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="form.frdblx === 'Y'?dicts.IDNTYPES:dicts.ORGIDNTYPES" label="证件类型" :disabled="disabled" name="zjlx" v-model="form.zjlx"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="证件号码" :disabled="disabled" name="zjhm" placeholder="请输入证件号码" v-model="form.zjhm"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiRangeDatePicker label="有效期" :disabled="disabled" name="zjjssj" prop="zjjssj" :dateEnd="form.zjjssj" :dateStart="form.zjkssj" @change="changeDate($event,'zjkssj','zjjssj')"  />
        </BiCol>
      </a-row>
    </a-card>

    <a-card class="card" title="账户信息" :bordered="false">
      <a-row>
        <BiCol>
          <BiFormItemInput label="户名":disabled="disabled"  name="zhmc" placeholder="请输入户名" v-model="form.zhmc"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="账户" :disabled="disabled" name="zhhm" placeholder="请输入账户" v-model="form.zhhm"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.BANK_CODE" label="开户行":disabled="disabled"  name="khhmc" v-model="form.khhmc"/>
        </BiCol>
      </a-row>
    </a-card>

    <a-card class="card" title="联系人" :bordered="false">
      <Contactor ref="contactor" :contactors="contactors" :disabled="type=='view'"/>
    </a-card>

    <a-card class="card" title="附件上传" :bordered="false">
      <a-row title="附件上传" :bordered="false">
        <BiCol>
          <BiUpload v-model="files" :disabled="disabled" ></BiUpload>
        </BiCol>
        <br/>
      </a-row>
    </a-card>
  </a-form-model>

</template>

<script>
  import { proEastProjectsJydsjrcpAdd,proEastProjectsJydsjrcpEdit,proEastProjectsJydsjrcpqueryById } from '@/api/BiApi'
  import JDSelectTag from '@comp/dict/JDSelectTag'
  import dictMixin from '@mixins/dictMixin'
  import Contactor from './Contactor'
  import biUploadMixin from '@mixins/biUploadMixin'



  export default {
    name: 'ProEastProjectsJydsjrcpModal',
    components: {
      JDSelectTag,Contactor
    },
    inject: ['closeCurrent'],
    mixins: [dictMixin,biUploadMixin],
    data() {
      return {
        // 省市区
        //areas: [],
        // address: '',//详细地址
        contactorAreas: [],
        files: [],
        contactors:[],
        contactorAddress: '',
        ssareas: [],
        disabled:false,
        form: {
          ssdqP:null,
          ssdqC:null,
          ssdqD:null,
          //areas: [],
          frdblx: 'Y'
        },
        rules: {
          jydsbh: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          tyshxydm: [
            { required: true, message: '请输入统一社会信用代码', trigger: 'blur' }
          ],
          jydsqc: [
            { required: true, message: '请选择机构类型', trigger: 'blur' }
          ],
          zczb: [
            { required: true, message: '请输入注册资本', trigger: 'blur' }
          ],
          gszcrq: [
            { required: true, message: '请选择工商注册日期', trigger: 'change' }
          ],
          fddbr: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          zjlx: [
            { required: true, message: '请选择证件类型', trigger: 'blur' }
          ],
          zjhm: [
            { required: true, message: '请输入证件号码', trigger: 'blur' }
          ],
          zjjssj: [
            { required: true, message: '请选择证件有效期', trigger: 'change' }
          ],
          zhmc: [
            { required: true, message: '请输入户名', trigger: 'blur' }
          ],
          zhhm: [
            { required: true, message: '请输入账户', trigger: 'blur' }
          ],
          khhmc: [
            { required: true, message: '请选择开户行', trigger: 'change' }
          ],



        },

        // 复制新增
        copyNew: false
      }
    },
    props: {
      id: {
        default: ''
      },

      orgType: {
        default: 'jydsfile'
      },
      // 新增，编辑，查看 edite,view
      type: {
        default: 'add'
      }
    },
    methods: {
      cphoneRule(value) {
        return new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)
      },
      fphoneRule(value) {
        return new RegExp(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/).test(value)
      },
      emailRule(value) {
        return new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value)
      },
      back() {
        this.$router.push({ name: 'assetTacticList' })
        this.closeCurrent()
      },
      onSubmit() {
        if (this.type == 'view') {
          this.$emit('update')
          return
        }
        if (this.ssareas.length) {
          this.form.ssdqP=this.ssareas[0],
            this.form.ssdqC=this.ssareas[1],
            this.form.ssdqD=this.ssareas[2]

        }

        let res = ''
        let param = {
          ppj:{...this.form},
          contactors:this.$refs.contactor.contactors,
          files:[],
        }


        if(!param.contactors||!param.contactors.length>0){
          this.$message.error('至少填写一个联系人信息');
          return
        }
        for(var i=0;i<param.contactors.length;i++){
          if(!param.contactors[i].ctelNo&&!param.contactors[i].ftelNo){
            this.$message.error(`联系人${param.contactors[i].contName}手机号和固定电话至少填写其中一个`);
            return
          }
        }
        for(var i=0;i<param.contactors.length;i++) {
          if (param.contactors[i].ctelNo) {
            if (!this.cphoneRule(param.contactors[i].ctelNo)) {
              this.$message.error(`联系人${param.contactors[i].contName}手机号格式不正常`);
              return
            }
          }
          if (param.contactors[i].ftelNo) {
            if (!this.fphoneRule(param.contactors[i].ftelNo)) {
              this.$message.error(`联系人${param.contactors[i].contName}固定电话格式不正常`);
              return
            }
          }
          if (param.contactors[i].email) {
            if (!this.emailRule(param.contactors[i].email)) {
              this.$message.error(`联系人${param.contactors[i].contName}邮箱格式不正常`);
              return
            }
          }
        }
        this.$refs.assetForm.validate(async (valid) => {

          if (valid&&this.type=='add') {
            res = await proEastProjectsJydsjrcpAdd(param)
            if (res.success) {

              this.$message.success('保存成功')
              this.$emit('update')
              this.uploadFiles('ProEastProjectsJydscp','Jydscp'+res.result.id) //上传附件
            }
          }

          if(valid&&this.type=='edite'){

            res = await proEastProjectsJydsjrcpEdit(param)
            if (res.success) {
              this.$message.success('修改成功')
              this.$emit('update')
              this.uploadFiles('ProEastProjectsJydscp','Jydscp'+res.result.id) //上传附件
            }
          }
        })
      },




      changeDate(val, startKey, endKey, childKey) {
        this.$set(childKey ? this.form[childKey] : this.form, startKey, val[0] || '')
        this.$set(childKey ? this.form[childKey] : this.form, endKey, val[1] || '')
      },
      async proEastProjectsJydsjrcpqueryById() {
        const res = await proEastProjectsJydsjrcpqueryById({ id: this.id })
        if (res.success) {
          const {ppj,contactors} = res.result
          this.form = {
            ...ppj
          }
          if(!ppj.frdblx){
            this.form.frdblx = 'Y'
          }

          // 地址处理
          this.ssareas = [ this.form.ssdqP,  this.form.ssdqC,  this.form.ssdqD]
          //联系人处理
          if(contactors&&contactors.length){
            contactors.forEach(item=>{
              item.key = item.id
            })
            this.contactors = contactors
          }
          //附件处理
          this.getFiles('ProEastProjectsJydscp','Jydscp'+this.id)
        }
      }
    },
    mounted() {
      if (this.id) {
        this.proEastProjectsJydsjrcpqueryById()
      }
      if(this.type == 'view'){
        this.disabled=true
      }


    },
    created() {
      this.getDict('ORG_TYPE,CUS_CATEGORY_ORGAN,CUS_CATEGORY_ORGAN,IDNTYPES,ORGIDNTYPES,COOPERATE_TYPE,AREA_CODE,y_n,EAST_DJLX,BANK_CODE,NATURAL_YN')
    }
  }
</script>
<style lang="stylus" scoped>
  .card {
    margin-bottom: 24px;
  }

  .desc {
    line-height: 1
  }
</style>