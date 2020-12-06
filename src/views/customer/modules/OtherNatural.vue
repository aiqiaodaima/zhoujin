<template>
  <a-form-model ref="form" :model="form" :rules="rules" v-cloak>
    <a-spin :spinning="loading">
      <a-layout :style="{margin:'0px'}">
          <a-layout-content :style="{margin:'8px'}">
            <a-card size="small" title="基本信息">
              <a-row :gutter="24">
                <a-col :span="8">
                    <BiFormItemSelect :disabled="optType == 'view'" label="关系人类型"  :options="dicts.CUS_REL_TYPR" name="cusDdOtherPartyInfo.partyType" v-model="form.cusDdOtherPartyInfo.partyType" />
                </a-col>
                <a-col :span="8">
                    <BiFormItemSelect :disabled="optType == 'view'" label="顺位"  :options="dicts.BNF_RANK" name="cusDdOtherPartyInfo.partyRang" v-model="form.cusDdOtherPartyInfo.partyRang" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="姓名" name="cusDdOtherPartyInfo.partyName" placeholder="请输入" v-model="form.cusDdOtherPartyInfo.partyName" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemSelect :disabled="optType == 'view'" label="性别"  :options="dicts.GENDER" name="cusDdOtherPartyInfo.gender" v-model="form.cusDdOtherPartyInfo.gender"/>
                </a-col>
                 <a-col :span="8">
                    <BiFormItemSelect :disabled="optType == 'view'"  :options="dicts.NAT_CODE" label="国籍" name="cusDdOtherPartyInfo.natCode" v-model="form.cusDdOtherPartyInfo.natCode" />
                </a-col>
                <a-col :span="8">
                    <BiFormItemSelect :disabled="optType == 'view'" label="证件类型"  :options="dicts.IDNTYPES" name="cusDdOtherPartyInfo.idnType" v-model="form.cusDdOtherPartyInfo.idnType" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="证件号码" name="cusDdOtherPartyInfo.idn" v-model="form.cusDdOtherPartyInfo.idn" />
                </a-col>
                <a-col :span="8">
                  <a-form-model-item v-if="optType != 'view'" label="有效期" prop="cusDdOtherPartyInfo.yxDate">
                    <j-date-range :disabled="optType == 'view'" @calendarChange="calendarChange" :currentDate="currentDate" v-model="form.cusDdOtherPartyInfo.yxDate" ></j-date-range>
                  </a-form-model-item>
                  <BiFormItemInput v-else disabled label="有效期" :value="form.cusDdOtherPartyInfo.yxDate&&(form.cusDdOtherPartyInfo.yxDate[0]+'~'+form.cusDdOtherPartyInfo.yxDate[1])"/>
                </a-col>
              </a-row>
              
            </a-card>
            <a-card size="small" title="联系信息" style="margin-top:10px">
              <a-row :gutter="24">
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="手机号码" name="cusDdOtherPartyInfo.cphone" placeholder="请输入" v-model="form.cusDdOtherPartyInfo.cphone" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="固定电话" name="cusDdOtherPartyInfo.fphone" placeholder="请输入" v-model="form.cusDdOtherPartyInfo.fphone" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="电子邮箱" name="cusDdOtherPartyInfo.email" placeholder="请输入" v-model="form.cusDdOtherPartyInfo.email" />
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item label="联系地址"  prop="cusDdOtherPartyInfo.addrProvCode" :key="'Y'">
                    <bi-area :showType="optType !== 'view'?'select':'text'" :models="[form.cusDdOtherPartyInfo.addrProvCode, form.cusDdOtherPartyInfo.addrCityCode, form.cusDdOtherPartyInfo.addrCountyCode,form.cusDdOtherPartyInfo.address]" @change="addrProvCodeChange" :show-lv="4"></bi-area>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-card>
            <a-card size="small" title="紧急联系人信息" style="margin-top:10px">
              <a-row :gutter="24">
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="姓名/名称" name="cusDdOtherPartyInfo.emergencyContactName" placeholder="请输入" v-model="form.cusDdOtherPartyInfo.emergencyContactName" />
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="手机号码" name="cusDdOtherPartyInfo.emergencyContactCphone" placeholder="请输入" v-model="form.cusDdOtherPartyInfo.emergencyContactCphone" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="固定电话" name="cusDdOtherPartyInfo.emergencyContactFphone" placeholder="请输入" v-model="form.cusDdOtherPartyInfo.emergencyContactFphone" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="电子邮箱" name="cusDdOtherPartyInfo.emergencyContactMail" placeholder="请输入" v-model="form.cusDdOtherPartyInfo.emergencyContactMail" />
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item label="联系地址"  prop="cusDdOtherPartyInfo.emergencyContactProvCode" :key="'Y'">
                    <bi-area  :showType="optType !== 'view'?'select':'text'" :models="[form.cusDdOtherPartyInfo.emergencyContactProvCode, form.cusDdOtherPartyInfo.emergencyContactCityCode, form.cusDdOtherPartyInfo.emergencyContactCountyCode,form.cusDdOtherPartyInfo.emergencyContactAddress]" @change="belongEmergencyContactProvCodeChange" :show-lv="4"></bi-area>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-card>
          </a-layout-content>
      </a-layout>
    </a-spin>
  </a-form-model>
</template>

<script>
import { saveAssignee, showAssignee } from '@/api/BiApi'
import JDSelectTag from '@comp/dict/JDSelectTag'
import { postAction, getAction, putAction } from '@api/manage'
import dictMixin from '@mixins/dictMixin'
import moment from 'moment'
import JDateRange from '@/components/jeecg/JDateRange'
import JDate from '@/components/jeecg/JDate'
export default {
  name: 'OtherNatural',
  components: {
    JDateRange,
    JDate,
    JDSelectTag
  },
  mixins: [dictMixin],
  props: {
    ddCode:{
      default: ''
    },
    optType: {
      default: 'add'
    },
    prjCode:{
      default: ''
    },
    id: {
      default: ''
    }
  },
  data() {
    return {
      moment,
      currentDate:moment(),
      isFirst: 0,
      loading: false,
      rules:{
          'cusDdOtherPartyInfo.partyType':[
            {required: true, message: '请选择关系人类型', trigger: 'change'},
          ],
          'cusDdOtherPartyInfo.consignerRelation':[
            {required: true, message: '请选择与委托人关系', trigger: 'change'},
          ],
           'cusDdOtherPartyInfo.emergencyContactCphone':[
            {required: true,validator: this.cphoneRule,trigger: ['change','blur']},
          ],
          'cusDdOtherPartyInfo.emergencyContactFphone':[
            {validator: this.fphoneRule,trigger: ['change','blur']},
          ],
          'cusDdOtherPartyInfo.emergencyContactMail':[
            {validator: this.emailRule,trigger: ['change','blur']},
          ],
          'cusDdOtherPartyInfo.cphone':[
            {required: true,validator: this.cphoneRule,trigger: ['change','blur']},
          ],
          'cusDdOtherPartyInfo.fphone':[
            {validator: this.fphoneRule,trigger: ['change','blur']},
          ],
          'cusDdOtherPartyInfo.email':[
            {validator: this.emailRule,trigger: ['change','blur']},
          ],
          'cusDdOtherPartyInfo.principalIdnType':[
            {required: true, message: '请输入证件类型', trigger: 'change'},
          ],
          'cusDdOtherPartyInfo.principalIdnNo':[
            {required: true, message: '请输入证件号码', trigger: 'change'},
          ],
          'cusDdOtherPartyInfo.emergencyContactName':[
            {required: true, message: '请输入姓名/名称', trigger: 'change'},
          ],
          'cusDdOtherPartyInfo.registerAddress':[
            {required: true, message: '请输入注册地址', trigger: 'change'},
          ],

          'cusDdOtherPartyInfo.bnfScale':[
            {required: true, message: '请输入受益比例', trigger: 'change'},
          ],
          // 'cusDdOtherPartyInfo.endScale':[
          //   {required: true, message: '请输入终止分配比例', trigger: 'change'},
          // ],
          'cusDdOtherPartyInfo.addrProvCode':[
            {required: true,validator: this.addrProvCodeRule,trigger: ['change','blur']},
          ],
          'cusDdOtherPartyInfo.emergencyContactProvCode':[
            {required: true,validator: this.emergencyContactProvCodeRule,trigger: ['change','blur']},
          ],
         'cusDdOtherPartyInfo.belongAddrProvCode':[
            {required: true,validator: this.belongAddrProvCodeRule,trigger: ['change','blur']},
          ],
         'cusDdOtherPartyInfo.natCode':[
            {required: true, message: '请选择国籍', trigger: 'change'},
          ],
         'cusDdOtherPartyInfo.idnType':[
            {required: true, message: '请选择证件类型', trigger: 'change'},
          ],
         'cusDdOtherPartyInfo.partyName':[
            {required: true, message: '请输入名称', trigger: 'change'},
          ],
         'cusDdOtherPartyInfo.idn':[
            {required: true, message: '请输入证件号码', trigger: 'change'},
          ],
        },
      form: {
        cusDdOtherPartyInfo:{}
      },
      url: {
        find: '/prj/cusDDInfo/otherParty/info',
        save: '/prj/cusDDInfo/otherParty/save',
        edite: '/prj/cusDDInfo/otherParty/save'
      },
      dictOptionsData: []
    }
  },
  watch: {
    "form.cusDdOtherPartyInfo.yxDate"(val){
      if(val[0]==''){
        this.currentDate=moment()
        this.form.cusDdOtherPartyInfo.yxDate=[]
      }
      this.form.cusDdOtherPartyInfo.idnStdDt=val[0]
      this.form.cusDdOtherPartyInfo.idnEndDt=val[1]
    },
  },
  created() {
    this.initDictConfig()
    if(this.id){
      this.getInfoDis()
    }
  },
  mounted() {
  },
  methods: {
    calendarChange(val) {
      this.currentDate = val
    },
    getInfoDis() {
      this.loading = true
      getAction(this.url.find, { id: this.id })
        .then(res => {
          if (res.success) {
            this.form = res.result
            if(this.form.cusDdOtherPartyInfo.idnStdDt&&this.form.cusDdOtherPartyInfo.idnEndDt){
              this.$set(this.form.cusDdOtherPartyInfo,'yxDate',[this.form.cusDdOtherPartyInfo.idnStdDt,this.form.cusDdOtherPartyInfo.idnEndDt])
              this.currentDate=moment(this.form.cusDdOtherPartyInfo.idnStdDt, "YYYYMMDD")
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
          this.form.cusDdOtherPartyInfo.contactPersonAddrProvCode = a[0];
          this.form.cusDdOtherPartyInfo.contactPersonAddrCityCode = a[1];
          this.form.cusDdOtherPartyInfo.contactPersonAddrCountyCode = a[2];
          this.form.cusDdOtherPartyInfo.contactPersonAddress = a[3];
        }
    },
    liveAddrProvCodeChange(areaStr){
        if(areaStr){
          let a = areaStr.split(",");
          this.form.cusDdOtherPartyInfo.liveAddrProvCode = a[0];
          this.form.cusDdOtherPartyInfo.liveAddrCityCode = a[1];
          this.form.cusDdOtherPartyInfo.liveAddrCountyCode = a[2];
          this.form.cusDdOtherPartyInfo.liveAddress = a[3];
        }
    },
    addrProvCodeRule(rule, value, callback){
      if(!this.form.cusDdOtherPartyInfo.addrProvCode){
        callback("联系地址不能为空")
      }else{
        callback()
      }
    },
    emergencyContactProvCodeRule(rule, value, callback){
      if(!this.form.cusDdOtherPartyInfo.emergencyContactProvCode){
        callback("联系地址不能为空")
      }else{
        callback()
      }
    },
    addrProvCodeChange(areaStr){
        if(areaStr){
          let a = areaStr.split(",");
          this.form.cusDdOtherPartyInfo.addrProvCode = a[0];
          this.form.cusDdOtherPartyInfo.addrCityCode = a[1];
          this.form.cusDdOtherPartyInfo.addrCountyCode = a[2];
          this.form.cusDdOtherPartyInfo.address = a[3];
        }
    },
    belongEmergencyContactProvCodeChange(areaStr){
        if(areaStr){
          let a = areaStr.split(",");
          this.form.cusDdOtherPartyInfo.emergencyContactProvCode = a[0];
          this.form.cusDdOtherPartyInfo.emergencyContactCityCode = a[1];
          this.form.cusDdOtherPartyInfo.emergencyContactCountyCode = a[2];
          this.form.cusDdOtherPartyInfo.emergencyContactAddress = a[3];
        }
    },
    belongAddrProvCodeRule(rule, value, callback){
      if(!this.form.cusDdOtherPartyInfo.belongAddrProvCode){
        callback("所属地区不能为空")
      }else{
        callback()
      }
    },
    initDictConfig() {
         this.loading = true
        let promises = [this.getDict('BNF_RANK,REL_TYPE,CUS_REL_TYPR,PTY_RELATIVE_TYPE,ZJLX_JRCP,PACT_TYPE,ANNUAL_INCOME,OCU_CODE,PRJ_TYPE,NAT_CODE,MARITAL_CODE,CONTRACT_SERIE,IDNTYPES,FEE_NAMES_MSG,FEE_CAL_MODE,COM_MODE,FEE_PAY_OBJECT,FREQUENCY2,NATUREDAY_YN,TFIX_TYPE,INT_DAY_BASE,FREQUENCY,TFIX_TYPE,FEE_BASE,ACHIEVEMENT_TYPE,RATE_BASE,GENDER')]
        Promise.all(promises)
          .then(res => {

          })
          .finally(() => {
            this.loading = false
          })
    },
    handleSubmit(){
      this.$refs.form.validate(valid => {
          if (valid) {
            if(this.form.cusDdOtherPartyInfo.yxDate&&this.form.cusDdOtherPartyInfo.yxDate.length>0){
              var val=this.form.cusDdOtherPartyInfo.yxDate
              this.form.cusDdOtherPartyInfo.idnStdDt=val[0]
              this.form.cusDdOtherPartyInfo.idnEndDt=val[1]
            }else{
              this.form.cusDdOtherPartyInfo.idnStdDt=''
              this.form.cusDdOtherPartyInfo.idnEndDt=''
            }
            var param = this.form
            param.cusDdOtherPartyInfo.ddCode=this.ddCode
            param.cusDdOtherPartyInfo.naturalOrOrgType='1'
            if(this.id && this.optType== 'edite'){
              param.id = this.id
              return postAction(this.url.edite, param).then((res)=>{
                if(res.success){
                  this.$emit('update')
                  this.$message.success('保存成功！');
                }else{
                  this.$message.error(res.message);
                }
              }).finally(()=>{
                this.loading = false;
              });
            }else{
              return postAction(this.url.save, param).then((res)=>{
                if(res.success){
                  this.$emit('update')
                  this.$message.success('保存成功！');
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