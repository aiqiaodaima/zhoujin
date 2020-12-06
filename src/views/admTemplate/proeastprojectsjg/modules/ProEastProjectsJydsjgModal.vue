<template>
  <a-form-model ref="assetForm" :model="form" :rules="rules">
    <a-card class="card" title="基本信息" :bordered="false">
      <a-row>
        <BiCol>
          <BiFormItemInput label="名称" name="jydsqc"  :disabled="disabled"  placeholder="请输入交易对手名称" v-model="form.jydsqc"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="统一社会信用代码" :disabled="disabled"  name="tyshxydm" placeholder="请输入统一社会信用代码" v-model="form.tyshxydm"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.CUS_CATEGORY_ORGAN" label="交易对手类型"  :disabled="disabled" name="jydslx" v-model="form.jydslx"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiFormItemSelect :options="dicts.EAST_JGXZ" label="机构性质" :disabled="disabled"  name="jgxz" v-model="form.jgxz"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.EAST_QYZCLB" label="注册类别" :disabled="disabled"  name="qyzclb"  v-model="form.qyzclb"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.EAST_HYFL" label="行业类别"  :disabled="disabled" name="hyfl"  v-model="form.hyfl"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiFormItemSelect :options="dicts.IDS_TYPE" label="行业明细" :disabled="disabled"  name="hymx" v-model="form.hymx"/>
        </BiCol>
        <BiCol>
          <BiInputCapitalAmount name="zcc" :isForm='true' label="总资产"  :disabled="disabled" v-model="form.zcc" :min="0" :precision="2"/>
        </BiCol>
        <BiCol>
          <BiInputCapitalAmount name="zfz" :isForm='true' label="总负债"  :disabled="disabled" v-model="form.zfz" :min="0" :precision="2"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiFormItemSelect :options="dicts.EAST_QYGM" label="企业规模" :disabled="disabled"   name="qygm" v-model="form.qygm"/>
        </BiCol>
        <BiCol>
          <BiInputCapitalAmount name="zczb" :isForm='true' label="注册资本"  :disabled="disabled" v-model="form.zczb" :min="0" :precision="2"/>
        </BiCol>
        <BiCol>
          <BiFormItemDatePicker label="工商注册日期" name="gszcrq" :disabled="disabled"  dateFormat='YYYY-MM-DD' v-model="form.gszcrq"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiFormItemSelect :options="dicts.AREA_CODE" label="所属国别/地区"  :disabled="disabled" name="ssgb" v-model="form.ssgb" @change="changeNation"/>
        </BiCol>
        <BiCol>
          <BiFormItemCascader label="所属区域"  :disabled="disabled" v-model="ssareas" name="ssareas" :needCountry='false'/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="通讯地址"  :disabled="disabled"  placeholder="请输入通讯地址" name="address" v-model="form.address"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiFormItemSelect :options="dicts.EAST_SSBZ" label="上市标识"   :disabled="disabled"  name="ssbz" v-model="form.ssbz"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.EAST_SHD" label="上市地"  :disabled="disabled"  name="ssd" v-model="form.ssd"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.y_n" label="是否归属集团标识"  :disabled="disabled"   name="sfgsjtbs" v-model="form.sfgsjtbs"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiFormItemInput label="集团机构名称"  :disabled="disabled"  placeholder="请输入集团机构名称" name="jtjgmc" v-model="form.jtjgmc"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.EAST_JJCF" label="经济成份"  :disabled="disabled"  name="jjcf" v-model="form.jjcf"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.y_n" label="三农标识" :disabled="disabled"  name="snbz" v-model="form.snbz"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiFormItemSelect :options="dicts.EAST_PTBZ" label="政府融资平台标识"  :disabled="disabled"  name="zfrzpbs" v-model="form.zfrzpbs"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.y_n" label="实际控制人标识" :disabled="disabled"  name="sjkzrbs" v-model="form.sjkzrbs" @change="changeSjkzbs"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect label="关联方标识"  :disabled="disabled" :options="dicts.y_n" name="glfbs" v-model="form.glfbs"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiFormItemInput label="关联方编号" :disabled="disabled"  name="glfbh" placeholder="请输入" v-model="form.glfbh"/>
        </BiCol>
      </a-row>
    </a-card>

    <a-card class="card" title="法定代表人或负责人" :bordered="false">
      <a-form-item label="类型" slot="extra" style="width: 200px;margin: 0;padding: 0;" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
        <j-d-select-tag v-if="type !== 'view'" dict-code="NATURAL_YN"  name="frdblx" v-model="form.frdblx"></j-d-select-tag>
        <span v-else v-text="this.getDictNameByCode(this.dicts.NATURAL_YN,form.frdblx)"></span>
      </a-form-item>
      <a-row>
        <BiCol>
          <BiFormItemInput label="姓名/名称"  :disabled="disabled" name="fddbr" placeholder="请输入姓名/名称" v-model="form.fddbr"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="form.frdblx === 'Y'?dicts.IDNTYPES:dicts.ORGIDNTYPES" label="证件类型" :disabled="disabled"  name="zjlx" v-model="form.zjlx"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="证件号码" :disabled="disabled"  name="zjhm" placeholder="请输入证件号码" v-model="form.zjhm"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiRangeDatePicker label="有效期"  :disabled="disabled"  prop="zjjssj" name="zjjssj" :dateEnd="form.zjjssj" :dateStart="form.zjkssj" @change="changeDate($event,'zjkssj','zjjssj')"  />
        </BiCol>
      </a-row>
    </a-card>



    <a-card class="card" title="实际控制人" :bordered="false">
      <a-form-item label="类型" slot="extra" style="width: 200px;margin: 0;padding: 0;" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
        <j-d-select-tag v-if="type !== 'view'" dict-code="NATURAL_YN"  name="sjkzrlx" v-model="form.sjkzrlx"></j-d-select-tag>
        <span v-else v-text="this.getDictNameByCode(this.dicts.NATURAL_YN,form.sjkzrlx)"></span>
      </a-form-item>
      <a-row>
        <BiCol>
          <BiFormItemInput label="姓名/名称" :disabled="disabled"  name="sjkzrmc" placeholder="请输入姓名/名称" v-model="form.sjkzrmc"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="form.sjkzrlx === 'Y'?dicts.IDNTYPES:dicts.ORGIDNTYPES"  label="证件类型" :disabled="disabled"  name="sjkzrzjlx" v-model="form.sjkzrzjlx"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="证件号码" :disabled="disabled"  name="sjkzrzjhm" placeholder="请输入证件号码" v-model="form.sjkzrzjhm"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiRangeDatePicker label="有效期"  :disabled="disabled"  name="sjkzrzjjssj" :dateEnd="form.sjkzrzjjssj" :dateStart="form.sjkzrzjsxsj" @change="changeDate($event,'sjkzrzjsxsj','sjkzrzjjssj')"  />
        </BiCol>
      </a-row>
    </a-card>


    <BiComments :comments="[ '实际控制人标识 选择【是】时，实际控制人必填。']"/>

    <a-card class="card" title="股东信息" :bordered="false">
      <Gdxx ref="gdxx"   :gdgroup="gdgroup" :disabled="type=='view'"/>
    </a-card>

    <a-card class="card" title="账户信息" :bordered="false">
      <a-row>
        <BiCol>
          <BiFormItemInput label="户名" :disabled="disabled"  name="zhmc" placeholder="请输入户名" v-model="form.zhmc"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="账号" :disabled="disabled"  name="zhhm" placeholder="请输入账号" v-model="form.zhhm"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.BANK_CODE" label="开户行" :disabled="disabled"  name="khh" v-model="form.khh"/>
        </BiCol>
      </a-row>
    </a-card>

    <a-card class="card" title="联系人" :bordered="false">
      <Contactor ref="contactor" :contactors="contactors" :disabled="type=='view'"/>
    </a-card>

    <a-card class="card" title="附件上传" :bordered="false">
      <a-row title="附件上传" :bordered="false">
        <BiCol>
          <BiUpload v-model="files":disabled="disabled"></BiUpload>
        </BiCol>
        <br/>
      </a-row>
    </a-card>
  </a-form-model>

</template>

<script>
  import {proEastProjectsJydsjgAdd,proEastProjectsJydsjgEdit,proEastProjectsJydsjgqueryById} from '@/api/BiApi'
  import biUploadMixin from '@mixins/biUploadMixin'
  import JDSelectTag from '@comp/dict/JDSelectTag'
  import dictMixin from '@mixins/dictMixin'
  import Contactor from './Contactor'
  import Gdxx from './Gdxx'

  export default {
    name: 'ProEastProjectsJydsjgModal',
    components: {
      JDSelectTag,Contactor,Gdxx
    },
    inject: ['closeCurrent'],
    mixins: [dictMixin,biUploadMixin],
    data() {
      return {
        // 省市区
        //areas: [],
        // address: '',//详细地址
        ssareas: [],
        files: [],
        npfiles:[],
        mefiles:[],
        fpfiles:[],
        contactors:[],
        gdgroup:[],
        disabled:false,

      contactorAddress: '',
        form: {
          areas: [],
          ssdqP:null,
          ssdqC:null,
          ssdqD:null,
          sjkzrlx:'Y',
          frdblx:'Y'

        },
        rules: {
          jydsqc: [
            { required: true, message: '请输入交易对手名称', trigger: 'blur' }
          ],
          tyshxydm: [
            { required: true, message: '请输入统一社会信用代码', trigger: 'blur' }
          ],
          jydslx: [
            { required: true, message: '请选择机构类型', trigger: 'change' }
          ],


          jgxz: [
            { required: true, message: '请选择机构性质', trigger: 'change' }
          ],
          qyzclb: [
            { required: true, message: '请选择注册类别', trigger: 'change' }
          ],
          hyfl: [
            { required: true, message: '请选择行业类别', trigger: 'change' }
          ],


          hymx: [
            { required: true, message: '请选择行业明细', trigger: 'change' }
          ],
          zcc: [
            { required: true, message: '请输入总资产', trigger: 'blur' }
          ],
          zfz: [
            { required: true, message: '请输入总负债', trigger: 'blur' }
          ],


          qygm: [
            { required: true, message: '请选择企业规模', trigger: 'change' }
          ],
          zczb: [
            { required: true, message: '请输入注册资本', trigger: 'blur' }
          ],
          gszcrq: [
            { required: true, message: '请选择工商注册日期', trigger: 'change' }
          ],



          ssgb: [
            { required: true, message: '请选择所属国别/地区', trigger: 'change' }
          ],
          /*ssareas:[
            { required: true, message: '请选择所属国别/地区', trigger: 'change' }
          ],*/
          address: [
            { required: true, message: '请输入通讯地址', trigger: 'blur' }
          ],



          ssbz: [
            { required: true, message: '请选择上市标识', trigger: 'change' }
          ],
        /*  ssd: [
            { required: true, message: '请选择上市地', trigger: 'change' }
          ],*/
          sfgsjtbs: [
            { required: true, message: '请选择是否归属集团标识', trigger: 'change' }
          ],



          jjcf: [
            { required: true, message: '请选择经济成份', trigger: 'change' }
          ],
          snbz: [
            { required: true, message: '请选择三农标识', trigger: 'change' }
          ],


          zfrzpbs: [
            { required: true, message: '请选择政府融资平台标识', trigger: 'change' }
          ],
          sjkzrbs: [
            { required: true, message: '请选择实际控制人标识', trigger: 'change' }
          ],
          glfbs: [
            { required: true, message: '请选择关联方标识', trigger: 'change' }
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
        default: ''
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
      changeNation(val) {
        if (val == '001') {
          if (!this.rules.hasOwnProperty('ssareas')) {
            this.rules = {
              ...this.rules, ssareas: [
                {
                  required: true,
                  message: '请选择所属区域',
                  validator: this.belongAddrProvCodeRule,
                  trigger: ['change', 'blur']
                }
              ],

            }
          }
        } else {
          delete this.rules.ssareas
          this.rules = { ...this.rules }
          if(this.type=='edite'){
            this.ssareas= []
          }
        }
      },
      changeSjkzbs(val) {
        if (val == 'Y') {
          if (!this.rules.hasOwnProperty('sjkzrmc')||!this.rules.hasOwnProperty('sjkzrzjlx')
            ||!this.rules.hasOwnProperty('sjkzrzjhm')||!this.rules.hasOwnProperty('sjkzrzjhm')) {
            this.rules = {
              ...this.rules, sjkzrmc: [
                {
                  required: true,
                  message: '请输入姓名/名称',
                  trigger: ['change', 'blur']
                }
              ],
              ...this.rules, sjkzrzjlx: [
                {
                  required: true,
                  message: '请选择证件类型',
                  trigger: ['change', 'blur']
                }
              ],
              ...this.rules, sjkzrzjhm: [
                {
                  required: true,
                  message: '请选择证件号码',
                  trigger: ['change', 'blur']
                }
              ],
              ...this.rules, sjkzrzjjssj: [
                {
                  required: true,
                  message: '请选择有效期',
                  trigger: ['change', 'blur']
                }
              ],

            }
          }
        }
        else {
          delete this.rules.sjkzrmc
          delete this.rules.sjkzrzjlx
          delete this.rules.sjkzrzjhm
          delete this.rules.sjkzrzjjssj
          this.rules = { ...this.rules }

        }
      },
      delTip(rule, value, callback){
        if(!this.form.ssgb!='001'){
          callback()
        }
      },




      belongAddrProvCodeRule(rule, value, callback){

        if(!this.ssareas.length>0){
          callback("请选择所属地区")
        }else{
          callback()
        }
      },

      onSubmit() {
        if (this.type == 'view') {
          this.$emit('update')
          return
        }
        if (this.ssareas.length) {
            this.form.ssdqP=this.ssareas[0],
            this.form.ssdqC=this.ssareas[1],
            this.form.ssdqD=this.ssareas[2],
            this.ssareas = [ this.form.ssdqP,  this.form.ssdqC,  this.form.ssdqD]
           // this.form.address =this.ssareas+ ppjg.address
        }



        let res = ''
        let param = {
          ppjg:{...this.form},
          contactors:this.$refs.contactor.contactors,
          gdgroup:this.$refs.gdxx.gdgroup,
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
            res = await proEastProjectsJydsjgAdd(param)
            console.log("ceshifanhuizhi"+res)
            if (res.success) {
              this.$message.success('操作成功')
              this.$emit('update')
              this.uploadFiles('ProEastProjectsJyjg','Jydsjg'+res.result.id) //上传附件
            }
          }
          if(valid&&this.type=='edite'){

            res = await proEastProjectsJydsjgEdit(param)
            if (res.success) {
              this.$message.success('修改成功')
              this.$emit('update')
              this.uploadFiles('ProEastProjectsJyjg','Jydsjg'+res.result.id) //上传附件
            }
          }
        })
      },

      changeDate(val, startKey, endKey, childKey) {
        this.$set(childKey ? this.form[childKey] : this.form, startKey, val[0] || '')
        this.$set(childKey ? this.form[childKey] : this.form, endKey, val[1] || '')
      },
      async proEastProjectsJydsjgqueryById() {
        const res = await proEastProjectsJydsjgqueryById({ id: this.id })
        if (res.success) {
          this.changeNation(this.form.ssgb)//调用国别为中国大陆时 地区项必填验证
          const { contactors, ppjg,gdgroup } = res.result
          this.form = {
            ...ppjg
          }

          this.ssareas = [ this.form.ssdqP,  this.form.ssdqC,  this.form.ssdqD]
          if (contactors && contactors.length) {
            contactors.forEach(item => {
              item.key = item.id
            })
            this.contactors = contactors
          }
          if (gdgroup && gdgroup.length) {
            gdgroup.forEach(item => {
              item.key = item.id
            })
            this.gdgroup = gdgroup

          }
          //附件处理
          this.getFiles('ProEastProjectsJyjg','Jydsjg'+this.id)


        }
      }
    },
    mounted() {
      if (this.id) {
        this.proEastProjectsJydsjgqueryById()
      }
      if(this.type == 'view'){
        this.disabled=true
      }

    },
    created() {
      this.getDict('ORG_TYPE,CUS_CATEGORY_ORGAN,IDNTYPES,ORGIDNTYPES,COOPERATE_TYPE,AREA_CODE,y_n,EAST_JGXZ,EAST_QYZCLB,BANK_CODE,EAST_HYFL,IDS_TYPE,EAST_QYGM,EAST_PTBZ,EAST_SSBZ,EAST_SHD,EAST_JJCF,NATURAL_YN')
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