<template>
  <a-form-model ref="assetForm" :model="form" :rules="rules">
    <a-card class="card" title="基本信息" :bordered="false">
      <a-row>
        <BiCol>
          <BiFormItemInput label="名称" name="jydsqc" placeholder="请输入交易对手名称" v-model="form.jydsqc"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="统一社会信用代码" name="tyshxydm" placeholder="请输入统一社会信用代码" v-model="form.tyshxydm"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.ORG_TYPE" label="机构类型" name="jydslx" v-model="form.jydslx"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.EAST_JGXZ" label="机构性质" name="jgxz" v-model="form.jgxz"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.EAST_QYZCLB" label="注册类别" name="qyzclb"  v-model="form.qyzclb"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.EAST_HYFL" label="行业类别" name="hyfl"  v-model="form.hyfl"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.IDS_TYPE" label="行业明细" name="hymx" v-model="form.hymx"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="总资产" name="zcc" placeholder="请输入总资产" v-model="form.zcc"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="总负债" name="zfz" placeholder="请输入总负债" v-model="form.zfz"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.EAST_QYGM" label="企业规模"  name="qygm" v-model="form.qygm"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="注册资本" name="zfz" placeholder="请输入注册资本" v-model="form.zczb"/>
        </BiCol>
        <BiCol>
          <BiFormItemDatePicker label="工商注册日期" name="gszcrq" dateFormat='YYYY-MM-DD' v-model="form.gszcrq"/>
        </BiCol>

        <BiCol>
          <BiFormItemSelect :options="dicts.AREA_CODE" label="所属国别/地区" name="ssgb" v-model="form.ssgb" @change="changeNation"/>
        </BiCol>
        <BiCol>
          <BiFormItemCascader label="所属区域" v-model="ssareas" name="ssareas" :needCountry='false'/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="通讯地址"  placeholder="请输入通讯地址" name="address" v-model="form.address"/>
        </BiCol>

        <BiCol>
          <BiFormItemSelect :options="dicts.EAST_SSBZ" label="上市标识"  v-model="form.ssbz"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.EAST_SHD" label="上市地"  v-model="form.ssd"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.y_n" label="是否归属集团标识"   name="sfgsjtbs" v-model="form.sfgsjtbs"/>
        </BiCol>

        <BiCol>
          <BiFormItemInput label="集团机构名称"  placeholder="请输入集团机构名称" name="jtjgmc" v-model="form.jtjgmc"/>
        </BiCol>

        <BiCol>
          <BiFormItemSelect :options="dicts.EAST_JJCF" label="经济成份"  name="jjcf" v-model="form.jjcf"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.y_n" label="三农标识" name="snbz" v-model="form.snbz"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.EAST_PTBZ" label="政府融资平台标识"  name="zfrzpbs" v-model="form.zfrzpbs"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.y_n" label="实际控制人标识" name="sjkzrbs" v-model="form.sjkzrbs"/>
        </BiCol>

        <BiCol>
          <BiFormItemSelect label="关联方标识" :options="dicts.y_n" name="glfbs" v-model="form.glfbs"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="关联方编号" name="glfbh" placeholder="请输入" v-model="form.glfbh"/>
        </BiCol>

      </a-row>
    </a-card>

    <a-card class="card" title="法定代表人或负责人" :bordered="false">
      <a-form-item label="类型" slot="extra" style="width: 200px;margin: 0;padding: 0;" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
        <j-d-select-tag dict-code="NATURAL_YN"  name="frdblx" v-model="form.frdblx"></j-d-select-tag>
      </a-form-item>
      <BiCol>
        <BiFormItemInput label="姓名/名称" name="fddbr" placeholder="请输入姓名/名称" v-model="form.fddbr"/>
      </BiCol>
      <BiCol>
        <BiFormItemSelect :options="form.frdblx === 'Y'?dicts.IDNTYPES:dicts.ORGIDNTYPES" label="证件类型" name="zjlx" v-model="form.zjlx"/>
      </BiCol>
      <BiCol>
        <BiFormItemInput label="证件号码" name="zjhm" placeholder="请输入证件号码" v-model="form.zjhm"/>
      </BiCol>
      <BiCol>
        <BiRangeDatePicker label="有效期" :dateEnd="form.zjjssj" :dateStart="form.zjkssj" @change="changeDate($event,'zjkssj','zjjssj')"  />
      </BiCol>
    </a-card>



    <a-card class="card" title="实际控制人" :bordered="false">
      <a-form-item label="类型" slot="extra" style="width: 200px;margin: 0;padding: 0;" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
        <j-d-select-tag dict-code="NATURAL_YN"  name="sjkzrlx" v-model="form.sjkzrlx"></j-d-select-tag>
      </a-form-item>
      <BiCol>
        <BiFormItemInput label="姓名/名称" name="sjkzrmc" placeholder="请输入姓名/名称" v-model="form.sjkzrmc"/>
      </BiCol>
      <BiCol>
        <BiFormItemSelect :options="form.sjkzrlx === 'Y'?dicts.IDNTYPES:dicts.ORGIDNTYPES"  label="证件类型" name="sjkzrzjlx" v-model="form.sjkzrzjlx"/>
      </BiCol>
      <BiCol>
        <BiFormItemInput label="证件号码" name="sjkzrzjhm" placeholder="请输入证件号码" v-model="form.sjkzrzjhm"/>
      </BiCol>
      <BiCol>
        <BiRangeDatePicker label="有效期" :dateEnd="form.sjkzrzjjssj" :dateStart="form.sjkzrzjsxsj" @change="changeDate($event,'sjkzrzjsxsj','sjkzrzjjssj')"  />
      </BiCol>
    </a-card>


    <BiComments :comments="[ '实际控制人标识 选择【是】时，实际控制人必填。']"/>

    <a-card class="card" title="股东信息" :bordered="false">
      <Gdxx ref="gdxx" :gdcontactors="gdcontactors" :disabled="type=='view'"/>
    </a-card>

    <a-card class="card" title="账户信息" :bordered="false">
      <BiCol>
        <BiFormItemInput label="户名" name="zhmc" placeholder="请输入户名" v-model="form.zhmc"/>
      </BiCol>
      <BiCol>
        <BiFormItemInput label="账号" name="zhhm" placeholder="请输入账号" v-model="form.zhhm"/>
      </BiCol>
      <BiCol>
        <BiFormItemSelect :options="dicts.BANK_CODE" label="开户行" name="khh" v-model="form.khh"/>
      </BiCol>
    </a-card>

    <a-card class="card" title="联系人" :bordered="false">
      <Contactor ref="contactor" :contactors="contactors" :disabled="type=='view'"/>
    </a-card>

    <a-card class="card" title="附件上传" :bordered="false">
      <a-row title="附件上传" :bordered="false">
        <BiCol>
          <BiUpload v-model="files"></BiUpload>
        </BiCol>
        <br/>
      </a-row>
    </a-card>
  </a-form-model>

</template>

<script>
  import {proEastProjectsJydsjgAdd,proEastProjectsJydsjgEdit,proEastProjectsJydsjgqueryById} from '@/api/BiApi'
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
    mixins: [dictMixin],
    data() {
      return {
        // 省市区
        //areas: [],
        // address: '',//详细地址
        ssareas: [],
        files: [],
        contactors:[],
        gdcontactors:[],

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
      changeNation(val) {
     /*   if (val == '001') {
          if (!this.rules.hasOwnProperty('areas')) {
            this.rules = {
              ...this.rules, areas: [
                { required: true, message: '请输入所属区域', trigger: 'blur' }
              ]
            }
          }
        } else {
          delete this.rules.areas
          this.rules = { ...this.rules }
        }*/
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
          files:[],
        }
        console.log(this.param)
        this.$refs.assetForm.validate(async (valid) => {

          if (valid&&this.type=='add') {
            res = await proEastProjectsJydsjgAdd(param)
            if (res.success) {
              this.$message.success('操作成功')
              this.$emit('update')
            }
          }
          if(valid&&this.type=='edite'){

            res = await proEastProjectsJydsjgEdit(param)
            if (res.success) {
              this.$message.success('修改成功')
              this.$emit('update')
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
          const { contactors, ppjg } = res.result
          console.log(res.result)
          console.log(1111)
          this.form = {
            ...ppjg
          }
          // if (!ppjg.frdblx) {
          //   this.form.frdblx = 'Y'
          // }
          // if (!ppjg.sjkzrlx) {
          //   this.form.sjkzrlx = 'Y'
          // }
          // 地址处理

          this.ssareas = [ this.form.ssdqP,  this.form.ssdqC,  this.form.ssdqD]
         // this.form.address =this.ssareas+ this.form.address
          if (contactors && contactors.length) {
            contactors.forEach(item => {
              item.key = item.id
            })
            this.contactors = contactors
          }
        }
      }
    },
    mounted() {
      if (this.id) {
        this.proEastProjectsJydsjgqueryById()
      }


    },
    created() {
      this.getDict('ORG_TYPE,IDNTYPES,ORGIDNTYPES,COOPERATE_TYPE,AREA_CODE,y_n,EAST_JGXZ,EAST_QYZCLB,BANK_CODE,EAST_HYFL,IDS_TYPE,EAST_QYGM,EAST_PTBZ,EAST_SSBZ,EAST_SHD,EAST_JJCF')
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