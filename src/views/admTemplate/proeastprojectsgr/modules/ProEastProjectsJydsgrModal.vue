<template> 
  <a-form-model ref="assetForm" :model="form" :rules="rules">
    <a-card class="card" title="基本信息" :bordered="false">
      <a-row>
        <BiCol>
          <BiFormItemInput label="姓名" :disabled="disabled" name="jydsqc" placeholder="请输入姓名" v-model="form.jydsqc"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.IDNTYPES" label="证件类型" :disabled="disabled" name="zjlx" v-model="form.zjlx"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="证件号码" name="zjhm" :disabled="disabled" placeholder="请输入证件号码" v-model="form.zjhm"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiRangeDatePicker  name="statime" prop="statime" label="有效期" :disabled="disabled" :dateEnd="form.endtime" :dateStart="form.statime" @change="changeDate($event,'statime','endtime')"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.AREA_CODE" label="所属国别/地区" name="ssgb"
                            v-model="form.ssgb" :disabled="disabled" @change="changeNation" />
        </BiCol>
        <BiCol>
          <BiFormItemCascader label="所属区域" :disabled="disabled" v-model="ssareas" name="ssareas" :needCountry='false'

          />
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiFormItemCascader label="居住区域" :disabled="disabled"  v-model="jzareas" name="jzareas" :needCountry='false'

          />
        </BiCol>
        <BiCol>
          <BiFormItemInput label="手机号码" :disabled="disabled" name="lxdh" placeholder="请输入" v-model="form.lxdh"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="固定电话" :disabled="disabled" name="gddh" placeholder="请输入" v-model="form.gddh"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiFormItemSelect label="关联方标识" :disabled="disabled" :options="dicts.y_n" name="glfbs" v-model="form.glfbs"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="关联方编号" :disabled="disabled" name="glfbh" placeholder="请输入" v-model="form.glfbh"/>
        </BiCol>
      </a-row>
    </a-card>

    <a-card class="card" title="附件上传" :bordered="false">
      <a-row title="附件上传" :bordered="false">
        <BiCol>
          <BiUpload v-model="files" :disabled="disabled"></BiUpload>
        </BiCol>
        <br/>
      </a-row>
    </a-card>
  </a-form-model>

</template>

<script>
  import { proEastProjectsJydszhAdd, proEastProjectsJydszhEdit,proEastProjectsJydszhqueryById } from '@/api/BiApi'
  import JDSelectTag from '@comp/dict/JDSelectTag'
  import dictMixin from '@mixins/dictMixin'
  import biUploadMixin from '@mixins/biUploadMixin'

  export default {
    name: 'ProEastProjectsJydsgrModal',
    components: {
      JDSelectTag
    },
    inject: ['closeCurrent'],
    mixins: [dictMixin,biUploadMixin],
    data() {
      return {
        // 省市区
        //areas: [],
        // address: '',//详细地址
        contactorAreas: [],
        ssareas: [],
        jzareas: [],
        disabled:false,

        files: [],
        contactorAddress: '',
        form: {
          ssdqP:null,
          ssdqC:null,
          ssdqD:null,
          jzdqP:null,
          jzdqC:null,
          jzdqD:null

        },
        rules: {
          jydsqc: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          zjlx: [
            { required: true, message: '请选择证件类型', trigger: 'blur' }
          ],
          zjhm: [
            { required: true, message: '请输入证件号码', trigger: 'blur' }
          ],
          statime: [
            { required: true, message: '请输入证件有效期', trigger: 'change' }
          ],
          ssgb: [
            { required: true, message: '请选择所属国别/地区', trigger: 'change' }
          ],
          glfbs: [
            { required: true, message: '请选择是否是关联方标识', trigger: 'change' }
          ]

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
        if (val == '001') {
          if (!this.rules.hasOwnProperty('ssareas')||!this.rules.hasOwnProperty('jzareas')) {
            this.rules = {
              ...this.rules, ssareas: [
                {
                  required: true,
                  message: '请选择所属区域',
                  validator: this.belongAddrProvCodeRule,
                  trigger: ['change', 'blur']
                }
              ],
              ...this.rules, jzareas: [
                {
                  required: true,
                  message: '请选择居住区域',
                  validator: this.liveAddrProvCodeRule,
                  trigger: ['change', 'blur']
                }
              ]
            }
          }
        } else {

          delete this.rules.ssareas
          delete this.rules.jzareas
          this.rules = { ...this.rules }
          if(this.type=='edite'){
            this.ssareas= []
            this.jzareas= []
          }
        }
      },


      belongAddrProvCodeRule(rule, value, callback){

        if(!this.ssareas.length>0){
          callback("请选择所属地区")
        }
        else{
          callback()
        }
      },
      liveAddrProvCodeRule(rule, value, callback){
        if(!this.jzareas.length>0){
          callback("请选择居住区域")
        }else{
          callback()
      }
      },



      onSubmit() {
        //非必填项数据标准化验证
        if(this.form.lxdh!=null&&this.form.lxdh!=""){
          if(!this.cphoneRule(this.form.lxdh)){
            this.$message.warning(`手机号码格式不正常`);
            return
          }
        }
        if(this.form.gddh!=null&&this.form.gddh!=""){
          if(!this.fphoneRule(this.form.gddh)){
            this.$message.warning(`固定电话格式不正常`);
            return
          }
        }
        if (this.type == 'view') {
          this.$emit('update')
          return
        }
        let res = ''

        if (this.ssareas.length) {
          this.form.ssdqP=this.ssareas[0],
          this.form.ssdqC=this.ssareas[1],
          this.form.ssdqD=this.ssareas[2]
        }
        if (this.jzareas.length) {
          this.form.jzdqP=this.jzareas[0],
          this.form.jzdqC=this.jzareas[1],
          this.form.jzdqD=this.jzareas[2]
        }
        let param = {
          ppz:{...this.form},
          files:[]
        }
        this.$refs.assetForm.validate(async (valid) => {
          if (valid&&this.type=='add') {
            res = await proEastProjectsJydszhAdd(param)
            if (res.success) {
              this.$message.success('操作成功')
              this.$emit('update')
             // console.log("ceshifanhuizhi"+JSON.stringify(res))
              this.uploadFiles('ProEastProjectsJydsgr','Jydsgr'+res.result.id) //上传附件
            }
          }
          if(valid&&this.type=='edite'){

            res = await proEastProjectsJydszhEdit(param)
            if (res.success) {
              this.$message.success('操作成功')
              console.log("ceshifanhuizhi"+JSON.stringify(res))
              this.$emit('update')
              this.uploadFiles('ProEastProjectsJydsgr','Jydsgr'+res.result.id) //上传附件
            }
          }
        })
      },

      changeDate(val, startKey, endKey, childKey) {
        this.$set(childKey ? this.form[childKey] : this.form, startKey, val[0] || '')
        this.$set(childKey ? this.form[childKey] : this.form, endKey, val[1] || '')
      },
      async proEastProjectsJydszhqueryById() {

        const res = await proEastProjectsJydszhqueryById({ id: this.id })
        if (res.success) {
          this.form=res.result
          this.changeNation(this.form.ssgb)//调用国别为中国大陆时 地区项必填验证

          this.ssareas = [ this.form.ssdqP,  this.form.ssdqC,  this.form.ssdqD]
          this.jzareas = [ this.form.jzdqP,  this.form.jzdqC,  this.form.jzdqD]


          this.getFiles('ProEastProjectsJydsgr','Jydsgr'+this.id)
        }
      }

    },
    mounted() {
      if (this.id) {
        this.proEastProjectsJydszhqueryById()
      }
      if(this.type == 'view'){
        this.disabled=true
      }
    },
    created() {
      this.getDict('ORG_TYPE,IDNTYPES,ORGIDNTYPES,COOPERATE_TYPE,AREA_CODE,y_n')
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