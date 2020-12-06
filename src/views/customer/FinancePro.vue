<template>
  <a-form-model ref="form" :model="form" :rules="rules" v-cloak>
    <a-spin :spinning="loading">
      <a-layout :style="{margin:'0px'}">
          <a-layout-content :style="{margin:'8px'}">

            <a-card size="small" title="基本信息">
              <a-row :gutter="24">
                <a-col :span="24">
                  <BiFormItemInput :disabled="optType == 'view'||optType == 'edite'" label="名称" name="cusBasicInfo.partyName" placeholder="请输入" v-model="form.cusBasicInfo.partyName" />
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="24">
                    <BiFormItemSelect :disabled="optType == 'view'||optType == 'edite'"  :options="dicts.CUS_CATEGORY" label="客户类型" name="cusBasicInfo.partyType" v-model="form.cusBasicInfo.partyType" />
                  </a-col>
              </a-row>
               <a-row :gutter="24">
                <a-col :span="8">
                    <BiFormItemSelect :disabled="optType == 'view'||optType == 'edite'"  :options="dicts.ZJLX_JRCP" label="证件类型" name="cusBasicInfo.idnType" v-model="form.cusBasicInfo.idnType" />
                  </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'||optType == 'edite'" label="证件号码" placeholder="请输入证件号码"  name="cusBasicInfo.idn" v-model="form.cusBasicInfo.idn" />
                </a-col>
                <a-col :span="8">
                  <a-form-model-item v-if="optType != 'view'" label="有效期" prop="cusBasicInfo.yxDate">
                    <j-date-range :disabled="optType == 'view'" @calendarChange="calendarChange" :currentDate="currentDate" v-model="form.cusBasicInfo.yxDate" ></j-date-range>
                  </a-form-model-item>
                  <BiFormItemInput v-else disabled label="有效期" :value="form.cusBasicInfo.yxDate&&(form.cusBasicInfo.yxDate[0]+'~'+form.cusBasicInfo.yxDate[1])"/>
                </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="资管产品代码（SPV编码）" name="cusBasicInfo.spvCode" placeholder="请输入" v-model="form.cusBasicInfo.spvCode" />
                </a-col>
                 <a-col :span="8">
                  <BiFormItemSelect :disabled="optType == 'view'"  :options="dicts.CUS_MANAGE_INC" label="管理人名称" name="cusBasicInfo.spvManager" v-model="form.cusBasicInfo.spvManager" />
                </a-col>
              </a-row>
            </a-card>
            
            <a-card size="small" title="银行账户信息" style="margin-top:10px">
              <a-row :gutter="24">
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="户名" name="cusBasicInfo.accName" placeholder="请输入" v-model="form.cusBasicInfo.accName" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="账号" name="cusBasicInfo.accNo" placeholder="请输入" v-model="form.cusBasicInfo.accNo" />
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="24">
                  <BiFormItemSelect :disabled="optType == 'view'" label="开户行"  :options="dicts.BANK_CODE" name="cusBasicInfo.accOpenBank" v-model="form.cusBasicInfo.accOpenBank" />
                </a-col>
              </a-row>
            </a-card>

            <a-card size="small" title="联系人（授权经办人）" style="margin-top:10px">
              <a-row :gutter="24">
                <a-col :span="24">
                  <BiFormItemInput :disabled="optType == 'view'" label="姓名/名称" name="cusBasicInfo.contactPersonName" placeholder="请输入" v-model="form.cusBasicInfo.contactPersonName" />
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                    <BiFormItemSelect :disabled="optType == 'view'"  :options="dicts.IDNTYPES" label="证件类型" name="cusBasicInfo.contactPersonIdnType" v-model="form.cusBasicInfo.contactPersonIdnType" />
                  </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="证件号码" placeholder="请输入证件号码"  name="cusBasicInfo.contactPersonIdn" v-model="form.cusBasicInfo.contactPersonIdn" />
                </a-col>
                <a-col :span="8">
                  <a-form-model-item v-if="optType != 'view'" label="有效期" prop="cusBasicInfo.yxDate3">
                    <j-date-range :disabled="optType == 'view'" @calendarChange="calendarChange3" :currentDate="currentDate3" v-model="form.cusBasicInfo.yxDate3" ></j-date-range>
                  </a-form-model-item>
                  <BiFormItemInput v-else disabled label="有效期" :value="form.cusBasicInfo.yxDate3&&(form.cusBasicInfo.yxDate3[0]+'~'+form.cusBasicInfo.yxDate3[1])"/>
                </a-col>
              </a-row>
               <a-row :gutter="24">
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="手机号码" name="cusBasicInfo.contactPersoncphone" placeholder="请输入" v-model="form.cusBasicInfo.contactPersoncphone" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="固定电话" name="cusBasicInfo.contactPersonfphone" placeholder="请输入" v-model="form.cusBasicInfo.contactPersonfphone" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="电子邮箱" name="cusBasicInfo.contactPersonemail" placeholder="请输入" v-model="form.cusBasicInfo.contactPersonemail" />
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-model-item label="联系地址"  prop="cusBasicInfo.contactPersonAddrProvCode" :key="'Y'">
                    <bi-area :showType="optType !== 'view'?'select':'text'" :models="[form.cusBasicInfo.contactPersonAddrProvCode, form.cusBasicInfo.contactPersonAddrCityCode, form.cusBasicInfo.contactPersonAddrCountyCode,form.cusBasicInfo.contactPersonAddress]" @change="contactPersonAddrProvCodeChange" :show-lv="4"></bi-area>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-card>
            <a-card size="small" title="附件" style="margin-top: 15px">
              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-item label="文件上传">
                    <a-upload
                      :fileList="form.files"
                      :multiple="true"
                      :remove="handleRemove"
                      :beforeUpload="beforeUpload" style="width:50%">
                      <a-button v-if="optType !== 'view'">
                        <a-icon type="upload"></a-icon>选择
                      </a-button>
                    </a-upload>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>
          </a-layout-content>
          <a-layout-footer :style="{ position: 'fixed', zIndex: 1, right:'12px', textAlign: 'center',left:'12px' , bottom:0 , background:'#fff'}">
            <a-button @click="toBack" v-if="optType=='view'">返回</a-button>
            <a-button @click="doSave" v-if="optType!='view'">暂存</a-button>
            <a-button type="primary" @click="doSave" style="margin-left: 70px;" v-if="optType!='view'">提交</a-button>
          </a-layout-footer>
      </a-layout>
    </a-spin>
  </a-form-model>
</template>

<script>
import { saveAssignee, showAssignee } from '@/api/BiApi'
import JDSelectTag from '@comp/dict/JDSelectTag'
import { postAction, getAction, putAction,httpActionWF } from '@api/manage'
import dictMixin from '@mixins/dictMixin'
import moment from 'moment'
import JDateRange from '@/components/jeecg/JDateRange'
export default {
  name: 'FinancePro',
  components: {
    JDateRange,
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
    partyCode:{
      default: ''
    }
  },
  data() {
    return {
      moment,
      currentDate:moment(),
      currentDate3:moment(),
      isFirst: 0,
      loading: false,
      rules:{
          'cusBasicInfo.partyType':[
            {required: true, message: '请选择客户类型', trigger: 'change'},
          ],
          'cusBasicInfo.spvCode':[
            {required: true, message: '请输入资管产品代码', trigger: 'change'},
          ],
          'cusBasicInfo.spvManager':[
            {required: true, message: '请输入管理人名称', trigger: 'change'},
          ],
          'cusBasicInfo.contactPersonIdnType':[
            {required: true, message: '请选择证件类型', trigger: 'change'},
          ],
          'cusBasicInfo.contactPersonName':[
            {required: true, message: '请输入姓名/名称', trigger: 'change'},
          ],
          'cusBasicInfo.contactPersonIdn':[
            {required: true, message: '请输入证件号码', trigger: 'change'},
          ],
          'cusBasicInfo.contactPersoncphone':[
            {required: true,validator: this.cphoneRule,trigger: ['change','blur']},
          ],
          'cusBasicInfo.contactPersonfphone':[
            {validator: this.fphoneRule,trigger: ['change','blur']},
          ],
          'cusBasicInfo.contactPersonemail':[
            {validator: this.emailRule,trigger: ['change','blur']},
          ],
          'cusBasicInfo.principalIdnType':[
            {required: true, message: '请输入证件类型', trigger: 'change'},
          ],
          'cusBasicInfo.principalIdnNo':[
            {required: true, message: '请输入证件号码', trigger: 'change'},
          ],
          'cusBasicInfo.principalName':[
            {required: true, message: '请输入姓名/名称', trigger: 'change'},
          ],
          'cusBasicInfo.registerAddress':[
            {required: true, message: '请输入注册地址', trigger: 'change'},
          ],
          'cusBasicInfo.liveAddrProvCode':[
            {required: true,validator: this.liveAddrProvCodeRule,trigger: ['change','blur']},
          ],
         'cusBasicInfo.belongAddrProvCode':[
            {required: true,validator: this.belongAddrProvCodeRule,trigger: ['change','blur']},
          ],
         'cusBasicInfo.natCode':[
            {required: true, message: '请选择所属国别', trigger: 'change'},
          ],
         'cusBasicInfo.idnType':[
            {required: true, message: '请选择证件类型', trigger: 'change'},
          ],
         'cusBasicInfo.partyName':[
            {required: true, message: '请输入名称', trigger: 'change'},
          ],
         'cusBasicInfo.idn':[
            {required: true, message: '请输入统一社会信用代码', trigger: 'change'},
          ],
          'cusBasicInfo.yxDate':[
            {required: true, message: '有效期不能为空', trigger: 'change'},
          ],
          'cusBasicInfo.yxDate2':[
            {required: true, message: '有效期不能为空', trigger: 'change'},
          ],
          'cusBasicInfo.yxDate3':[
            {required: true, message: '有效期不能为空', trigger: 'change'},
          ],
        },
      form: {
        files:[],
        cusBasicInfo:{}
      },
      url: {
        find: '/prj/cusInfo/query',
        save: '/prj/cusInfo/add',
        upload: '/sys/common/biUpload',
        edite: '/prj/cusInfo/edit'
      },
      dictOptionsData: []
    }
  },
  watch: {
    "form.cusBasicInfo.yxDate"(val){
      if(!val)
      return
      if(val[0]==''){
        this.currentDate=moment()
        this.form.cusBasicInfo.yxDate=[]
      }
      this.form.cusBasicInfo.idnStdDt=val[0]
      this.form.cusBasicInfo.idnEndDt=val[1]
    },
    "form.cusBasicInfo.yxDate2"(val){
      if(!val)
      return
      if(val[0]==''){
          this.form.cusBasicInfo.yxDate2=[]
      }
      this.form.cusBasicInfo.idnStdDt=val[0]
      this.form.cusBasicInfo.idnEndDt=val[1]
    },
    "form.cusBasicInfo.yxDate3"(val){
      if(!val)
      return
      if(val[0]==''){
        this.currentDate3=moment()
        this.form.cusBasicInfo.yxDate3=[]
      }
      this.form.cusBasicInfo.contactPersonIdnStdDt=val[0]
      this.form.cusBasicInfo.contactPersonIdnEndDt=val[1]
    },
  },
  created() {
    this.initDictConfig()
    if(this.partyCode){
      this.getInfoDis()
    }
  },
  mounted() {
    //mounted here
  },
  methods: {
    beforeUpload(file) {
      this.form.files = [...this.form.files, file]
      return false
    },
    handleRemove(file) {
      if (this.optType !== 'view') {
        const index = this.form.files.indexOf(file)
        const newFileList = this.form.files.slice()
        newFileList.splice(index, 1)
        this.form.files = newFileList
        handleRemove(this, file)
      } else {
        return false
      }
    },
    calendarChange(val) {
      this.currentDate = val
    },
    calendarChange3(val) {
      this.currentDate3 = val
    },
    toBack(){
       this.$router.push({name:"customer-customer"});
    },
    getInfoDis() {
      this.loading = true
      getAction(this.url.find, { partyCode: this.partyCode })
        .then(res => {
          if (res.success) {
            this.form = res.result
            if(res.result.files&&res.result.files.length>0){
              res.result.files.forEach((file)=>{
                file.uid = file.id;
                file.name = file.fileName;
                file.status = 'done';
                file.response = '{"status": "success"}';
                file.url = window._CONFIG['domianURL']+"/sys/common/downloadStatic/" + file.filePath;
              });
              this.form.files=res.result.files
            }
            if(this.form.cusBasicInfo.idnStdDt&&this.form.cusBasicInfo.idnEndDt){
              //this.form.cusBasicInfo.yxDate=[this.form.cusBasicInfo.idnStdDt,this.form.cusBasicInfo.idnEndDt]
              this.$set(this.form.cusBasicInfo,'yxDate',[this.form.cusBasicInfo.idnStdDt,this.form.cusBasicInfo.idnEndDt])
              this.currentDate=moment(this.form.cusBasicInfo.idnStdDt, "YYYYMMDD")
            }
            
            if(this.form.cusBasicInfo.contactPersonIdnStdDt&&this.form.cusBasicInfo.contactPersonIdnEndDt){
              //this.form.cusBasicInfo.yxDate3=[this.form.cusBasicInfo.contactPersonIdnStdDt,this.form.cusBasicInfo.contactPersonIdnEndDt]
              this.$set(this.form.cusBasicInfo,'yxDate3',[this.form.cusBasicInfo.contactPersonIdnStdDt,this.form.cusBasicInfo.contactPersonIdnEndDt])
              this.currentDate3=moment(this.form.cusBasicInfo.contactPersonIdnStdDt, "YYYYMMDD")
            }
            
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.loading=false;
        })
    },
    cphoneRule(rule, value, callback){
        if(!value){
          callback("手机号码不能为空")
        }else{
          if(new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)){
             callback()
          }else{
            callback("请输入正确格式手机号码");
          }
        }
    },
    fphoneRule(rule, value, callback){
      if(!value){
        callback()
      }else{
        if(new RegExp(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/).test(value)){
            callback()
        }else{
          callback("请输入正确格式固定电话");
        }
      }
    },
    emailRule(rule, value, callback){
      if(!value){
        callback()
      }else{
        if(new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value)){
          callback()
        }else{
          callback("请输入正确格式的邮箱")
        }
      }
    },
    contactPersonAddrProvCodeChange(areaStr){
        if(areaStr){
          let a = areaStr.split(",");
          this.form.cusBasicInfo.contactPersonAddrProvCode = a[0];
          this.form.cusBasicInfo.contactPersonAddrCityCode = a[1];
          this.form.cusBasicInfo.contactPersonAddrCountyCode = a[2];
          this.form.cusBasicInfo.contactPersonAddress = a[3];
        }
    },
    liveAddrProvCodeChange(areaStr){
        if(areaStr){
          let a = areaStr.split(",");
          this.form.cusBasicInfo.liveAddrProvCode = a[0];
          this.form.cusBasicInfo.liveAddrCityCode = a[1];
          this.form.cusBasicInfo.liveAddrCountyCode = a[2];
          this.form.cusBasicInfo.liveAddress = a[3];
        }
    },
    liveAddrProvCodeRule(rule, value, callback){
      if(!this.form.cusBasicInfo.liveAddrProvCode){
        callback("通讯地址不能为空")
      }else{
        callback()
      }
    },
    belongAddrProvCodeChange(areaStr){
        if(areaStr){
          let a = areaStr.split(",");
          this.form.cusBasicInfo.belongAddrProvCode = a[0];
          this.form.cusBasicInfo.belongAddrCityCode = a[1];
          this.form.cusBasicInfo.belongAddrCountyCode = a[2];
          this.form.cusBasicInfo.belongAddress = a[3];
        }
    },
    belongAddrProvCodeRule(rule, value, callback){
      if(!this.form.cusBasicInfo.belongAddrProvCode){
        callback("所属地区不能为空")
      }else{
        callback()
      }
    },
    initDictConfig() {
         this.loading = true
        let promises = [this.getDict('BANK_CODE,IDNTYPES,ZJLX_JRCP,CUS_MANAGE_INC,CUS_CATEGORY,CRM_IDE_TYPE,NAT_CODE,MARITAL_CODE,CONTRACT_SERIE,IDNTYPES,FEE_NAMES_MSG,FEE_CAL_MODE,COM_MODE,FEE_PAY_OBJECT,FREQUENCY2,NATUREDAY_YN,TFIX_TYPE,INT_DAY_BASE,FREQUENCY,TFIX_TYPE,FEE_BASE,ACHIEVEMENT_TYPE,RATE_BASE,GENDER')]
        Promise.all(promises)
          .then(res => {

          })
          .finally(() => {
            this.loading = false
          })
    },
    doSave(){
      this.$refs.form.validate(valid => {
          const that = this
          if (valid) {
            this.loading = true;
            if(this.form.cusBasicInfo.yxDate&&this.form.cusBasicInfo.yxDate.length>0){
              var val=this.form.cusBasicInfo.yxDate
              this.form.cusBasicInfo.idnStdDt=val[0]
              this.form.cusBasicInfo.idnEndDt=val[1]
            }
            if(this.form.cusBasicInfo.yxDate3&&this.form.cusBasicInfo.yxDate3.length>0){
              var val=this.form.cusBasicInfo.yxDate3
              this.form.cusBasicInfo.contactPersonIdnStdDt=val[0]
              this.form.cusBasicInfo.contactPersonIdnEndDt=val[1]
            }
            const param = this.form
            param.cusBasicInfo.clientType='3'
            if(this.partyCode && this.optType== 'edite'){
              
              param.partyCode = this.partyCode
              return postAction(this.url.edite, param).then((res)=>{
                if(res.success){
                   const filesNeed2Upload = that.form.files.filter((file) => file.id === undefined)
                  if (filesNeed2Upload.length > 0) {
                    const formData = new FormData()
                    formData.append('module', 'customer_info')
                    formData.append('dataId', this.partyCode)
                    filesNeed2Upload.forEach((file) => {
                      formData.append('files', file)
                    })
                    httpActionWF(that.url.upload, formData)
                      .then((res) => {
                        if (res.success) {
                          that.$message.success('保存成功！')
                          // that.$emit('ok')
                          // this.close()
                        } else {
                          that.$message.error(res.message)
                        }
                      })
                      .finally(() => {
                        that.loading = false
                      })
                  }
                  //this.$emit('update')
                  this.$message.success('保存成功！');
                  this.$router.push({name:"customer-customer"});
                }else{
                  this.$message.error(res.message);
                }
              }).finally(()=>{
                this.loading = false;
              });
            }else{
              
              return postAction(this.url.save, param).then((res)=>{
                if(res.success){
                   const filesNeed2Upload = that.form.files.filter((file) => file.id === undefined)
                  if (filesNeed2Upload.length > 0) {
                    const formData = new FormData()
                    formData.append('module', 'customer_info')
                    formData.append('dataId', res.result.cusBasicInfo.partyCode)
                    filesNeed2Upload.forEach((file) => {
                      formData.append('files', file)
                    })
                    httpActionWF(that.url.upload, formData)
                      .then((res) => {
                        if (res.success) {
                          that.$message.success('保存成功！')
                          // that.$emit('ok')
                          // this.close()
                        } else {
                          that.$message.error(res.message)
                        }
                      })
                      .finally(() => {
                        that.loading = false
                      })
                  }
                  //this.$emit('update')
                  this.$message.success('保存成功！');
                  this.$router.push({name:"customer-customer"});
                  this.form={
                    files:[],
                    cusBasicInfo:{}
                  }
                }else{
                  this.$message.error(res.message);
                }
              }).finally(()=>{
                this.loading = false;
              });
            }
          } else {
            this.$message.error('校验未通过');
            return false;
          }
        });
    },
    tmpSave(){},
  }
}
</script>

<style lang="stylus" scoped>
@import '~@assets/less/common.less';
</style>