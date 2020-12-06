<template>
  <a-form-model ref="form" :model="form" :rules="rules" v-cloak>
    <a-spin :spinning="loading">
      <a-card size="small" title="受益人基本信息">
        <a-row :gutter="24">
          <a-col :span="8">
            <BiFormItemInput :disabled="optType == 'view'" label="姓名" name="cusDdBnfBasicInfo.partyName" placeholder="请输入" v-model="form.cusDdBnfBasicInfo.partyName" />
          </a-col>
          <a-col :span="8">
            <BiFormItemSelect :disabled="optType == 'view'" label="性别"  :options="dicts.GENDER" name="cusDdBnfBasicInfo.gender" v-model="form.cusDdBnfBasicInfo.gender"/>
          </a-col>
          <a-col :span="8">
              <BiFormItemSelect :disabled="optType == 'view'" label="受益顺位"  :options="dicts.BNF_RANK" name="cusDdBnfBasicInfo.bnfRank" v-model="form.cusDdBnfBasicInfo.bnfRank" />
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="出生日期" prop="cusDdBnfBasicInfo.birthDt">
              <j-date :disabled="optType == 'view'" :showLongTerm='false' placeholder="请选择出生日期" v-model="form.cusDdBnfBasicInfo.birthDt" style="width:100%"></j-date>
              </a-form-model-item>
          </a-col>
          <a-col :span="8">
              <BiFormItemSelect :disabled="optType == 'view'" label="证件类型"  :options="dicts.IDNTYPES" name="cusDdBnfBasicInfo.idnType" v-model="form.cusDdBnfBasicInfo.idnType" />
          </a-col>
          <a-col :span="8">
            <BiFormItemInput :disabled="optType == 'view'" label="证件号码" name="cusDdBnfBasicInfo.idn" v-model="form.cusDdBnfBasicInfo.idn" />
          </a-col>
         
          <a-col :span="8">
            <a-form-model-item v-if="optType != 'view'" label="有效期" prop="cusDdBnfBasicInfo.yxDate">
              <j-date-range  @calendarChange="calendarChange" :currentDate="currentDate" v-model="form.cusDdBnfBasicInfo.yxDate" ></j-date-range>
            </a-form-model-item>
            <BiFormItemInput v-else disabled label="有效期" :value="form.cusDdBnfBasicInfo.yxDate&&(form.cusDdBnfBasicInfo.yxDate[0]+'~'+form.cusDdBnfBasicInfo.yxDate[1])"/>
          </a-col>
          <a-col :span="8">
              <BiFormItemSelect :disabled="optType == 'view'"  :options="dicts.NAT_CODE" label="国籍" name="cusDdBnfBasicInfo.natCode" v-model="form.cusDdBnfBasicInfo.natCode" />
          </a-col>
          <a-col :span="8">
              <BiFormItemSelect :disabled="optType == 'view'" label="与委托人关系"  :options="dicts.PTY_RELATIVE_TYPE" name="cusDdBnfBasicInfo.consignerRelation" v-model="form.cusDdBnfBasicInfo.consignerRelation" />
          </a-col>
          <a-col :span="8">
              <BiFormItemSelect :disabled="optType == 'view'" label="婚姻状况"  :options="dicts.MARITAL_CODE" name="cusDdBnfBasicInfo.maritalCode" v-model="form.cusDdBnfBasicInfo.maritalCode" />
          </a-col>
          <a-col :span="8">
            <BiFormItemNumPercent :disabled="optType == 'view'" label="受益比例（%）" name="cusDdBnfBasicInfo.bnfScale" placeholder="请输入" v-model="form.cusDdBnfBasicInfo.bnfScale" :min="0" :max="100" :precision="2"/>
          </a-col>
          <a-col :span="8">
            <BiFormItemNumPercent :disabled="optType == 'view'" label="终止分配比例（%）" name="cusDdBnfBasicInfo.endScale" placeholder="请输入" v-model="form.cusDdBnfBasicInfo.endScale" :min="0" :max="100" :precision="2"/>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <BiFormItemTextarea :readonly="optType == 'view'"  label="备注" v-model="form.cusDdBnfBasicInfo.remarks" name="remarks" placeholder="备注"/>
          </a-col>
        </a-row>
      </a-card>
      <a-card size="small" title="信托利益分配账户" style="margin-top:10px">
          <a-row :gutter="24">
          <a-col :span="8">
            <BiFormItemInput :disabled="optType == 'view'" label="户名" name="cusDdBnfBasicInfo.trustAccName" placeholder="请输入" v-model="form.cusDdBnfBasicInfo.trustAccName" />
          </a-col>
          <a-col :span="8">
            <BiFormItemInput :disabled="optType == 'view'" label="账号" name="cusDdBnfBasicInfo.trustAccNo" placeholder="请输入" v-model="form.cusDdBnfBasicInfo.trustAccNo" />
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <BiFormItemSelect :disabled="optType == 'view'" label="开户行"  :options="dicts.BANK_CODE" name="cusDdBnfBasicInfo.trustAccOpenBank" v-model="form.cusDdBnfBasicInfo.trustAccOpenBank" />
          </a-col>
        </a-row>
      </a-card>

      <a-card size="small" title="联系信息" style="margin-top:10px">
        <a-row :gutter="24">
          <a-col :span="8">
            <BiFormItemInput :disabled="optType == 'view'" label="手机号码" name="cusDdBnfBasicInfo.cphone" placeholder="请输入" v-model="form.cusDdBnfBasicInfo.cphone" />
          </a-col>
          <a-col :span="8">
            <BiFormItemInput :disabled="optType == 'view'" label="固定电话" name="cusDdBnfBasicInfo.fphone" placeholder="请输入" v-model="form.cusDdBnfBasicInfo.fphone" />
          </a-col>
          <a-col :span="8">
            <BiFormItemInput :disabled="optType == 'view'" label="电子邮箱" name="cusDdBnfBasicInfo.email" placeholder="请输入" v-model="form.cusDdBnfBasicInfo.email" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="联系地址"  prop="cusDdBnfBasicInfo.addrProvCode" :key="'Y'">
              <bi-area :showType="optType !== 'view'?'select':'text'" :models="[form.cusDdBnfBasicInfo.addrProvCode, form.cusDdBnfBasicInfo.addrCityCode, form.cusDdBnfBasicInfo.addrCountyCode,form.cusDdBnfBasicInfo.address]" @change="addrProvCodeChange" :show-lv="4"></bi-area>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card size="small" title="紧急联系人信息" style="margin-top:10px">
        <a-row :gutter="24">
          <a-col :span="8">
            <BiFormItemInput :disabled="optType == 'view'" label="姓名/名称" name="cusDdBnfBasicInfo.emergencyContactName" placeholder="请输入" v-model="form.cusDdBnfBasicInfo.emergencyContactName" />
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <BiFormItemInput :disabled="optType == 'view'" label="手机号码" name="cusDdBnfBasicInfo.emergencyContactCphone" placeholder="请输入" v-model="form.cusDdBnfBasicInfo.emergencyContactCphone" />
          </a-col>
          <a-col :span="8">
            <BiFormItemInput :disabled="optType == 'view'" label="固定电话" name="cusDdBnfBasicInfo.emergencyContactFphone" placeholder="请输入" v-model="form.cusDdBnfBasicInfo.emergencyContactFphone" />
          </a-col>
          <a-col :span="8">
            <BiFormItemInput :disabled="optType == 'view'" label="电子邮箱" name="cusDdBnfBasicInfo.emergencyContactMail" placeholder="请输入" v-model="form.cusDdBnfBasicInfo.emergencyContactMail" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="联系地址"  prop="cusDdBnfBasicInfo.emergencyContactProvCode" :key="'Y'">
              <bi-area :showType="optType !== 'view'?'select':'text'" :models="[form.cusDdBnfBasicInfo.emergencyContactProvCode, form.cusDdBnfBasicInfo.emergencyContactCityCode, form.cusDdBnfBasicInfo.emergencyContactCountyCode,form.cusDdBnfBasicInfo.emergencyContactAddress]" @change="belongEmergencyContactProvCodeChange" :show-lv="4"></bi-area>
            </a-form-model-item>
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
import moment from 'moment'
import JDateRange from '@/components/jeecg/JDateRange'
import JDate from '@/components/jeecg/JDate'
export default {
  name: 'BeneficiaryMoadl',
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
          'cusDdBnfBasicInfo.bnfRank':[
            {required: true, message: '请选择受益顺位', trigger: 'change'},
          ],
           'cusDdBnfBasicInfo.consignerRelation':[
            {required: true, message: '请选择与委托人关系', trigger: 'change'},
          ],
           'cusDdBnfBasicInfo.emergencyContactCphone':[
            {required: true,validator: this.cphoneRule,trigger: ['change','blur']},
          ],
          'cusDdBnfBasicInfo.emergencyContactFphone':[
            {validator: this.fphoneRule,trigger: ['change','blur']},
          ],
          'cusDdBnfBasicInfo.emergencyContactMail':[
            {validator: this.emailRule,trigger: ['change','blur']},
          ],
          'cusDdBnfBasicInfo.cphone':[
            {required: true,validator: this.cphoneRule,trigger: ['change','blur']},
          ],
          'cusDdBnfBasicInfo.fphone':[
            {validator: this.fphoneRule,trigger: ['change','blur']},
          ],
          'cusDdBnfBasicInfo.email':[
            {validator: this.emailRule,trigger: ['change','blur']},
          ],
          'cusDdBnfBasicInfo.principalIdnType':[
            {required: true, message: '请输入证件类型', trigger: 'change'},
          ],
          'cusDdBnfBasicInfo.principalIdnNo':[
            {required: true, message: '请输入证件号码', trigger: 'change'},
          ],
          'cusDdBnfBasicInfo.emergencyContactName':[
            {required: true, message: '请输入姓名/名称', trigger: 'change'},
          ],
          'cusDdBnfBasicInfo.registerAddress':[
            {required: true, message: '请输入注册地址', trigger: 'change'},
          ],

          'cusDdBnfBasicInfo.bnfScale':[
            {required: true, message: '请输入受益比例', trigger: 'change'},
          ],
          // 'cusDdBnfBasicInfo.endScale':[
          //   {required: true, message: '请输入终止分配比例', trigger: 'change'},
          // ],
          'cusDdBnfBasicInfo.addrProvCode':[
            {required: true,validator: this.addrProvCodeRule,trigger: ['change','blur']},
          ],
          'cusDdBnfBasicInfo.emergencyContactProvCode':[
            {required: true,validator: this.emergencyContactProvCodeRule,trigger: ['change','blur']},
          ],
         'cusDdBnfBasicInfo.belongAddrProvCode':[
            {required: true,validator: this.belongAddrProvCodeRule,trigger: ['change','blur']},
          ],
         'cusDdBnfBasicInfo.natCode':[
            {required: true, message: '请选择所属国别', trigger: 'change'},
          ],
         'cusDdBnfBasicInfo.idnType':[
            {required: true, message: '请选择证件类型', trigger: 'change'},
          ],
         'cusDdBnfBasicInfo.partyName':[
            {required: true, message: '请输入名称', trigger: 'change'},
          ],
         'cusDdBnfBasicInfo.idn':[
            {required: true, message: '请输入证件号码', trigger: 'change'},
          ],
        },
      form: {
        cusDdBnfBasicInfo:{}
      },
      url: {
        find: '/prj/cusDDInfo/bnf/info',
        save: '/prj/cusDDInfo/bnf/save',
        edite: '/prj/cusDDInfo/bnf/save'
      },
      dictOptionsData: []
    }
  },
  watch: {
    "form.cusDdBnfBasicInfo.yxDate"(val){
      if(val[0]==''){
          this.currentDate=moment()
          this.form.cusDdBnfBasicInfo.yxDate=[]
          this.form.cusDdBnfBasicInfo.idnStdDt=this.form.cusDdBnfBasicInfo.idnEndDt=''
        }else{
           this.form.cusDdBnfBasicInfo.idnStdDt=val[0]
           this.form.cusDdBnfBasicInfo.idnEndDt=val[1]
        }
    },
    "form.cusDdBnfBasicInfo.yxDate2"(val){
      if(val[0]==''){
          this.form.cusDdBnfBasicInfo.yxDate2=[]
        }
    },
    "form.cusDdBnfBasicInfo.yxDate3"(val){
      if(val[0]==''){
          this.form.cusDdBnfBasicInfo.yxDate3=[]
        }
    },
  },
  created() {
    this.initDictConfig()
    if(this.id){
      this.getInfoDis()
    }
  },
  mounted() {
    //mounted here
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
            if(this.form.cusDdBnfBasicInfo.idnStdDt&&this.form.cusDdBnfBasicInfo.idnEndDt){
               this.$set(this.form.cusDdBnfBasicInfo,'yxDate',[this.form.cusDdBnfBasicInfo.idnStdDt,this.form.cusDdBnfBasicInfo.idnEndDt])
              this.currentDate=moment(this.form.cusDdBnfBasicInfo.idnStdDt, "YYYYMMDD")
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
          this.form.cusDdBnfBasicInfo.contactPersonAddrProvCode = a[0];
          this.form.cusDdBnfBasicInfo.contactPersonAddrCityCode = a[1];
          this.form.cusDdBnfBasicInfo.contactPersonAddrCountyCode = a[2];
          this.form.cusDdBnfBasicInfo.contactPersonAddress = a[3];
        }
    },
    liveAddrProvCodeChange(areaStr){
        if(areaStr){
          let a = areaStr.split(",");
          this.form.cusDdBnfBasicInfo.liveAddrProvCode = a[0];
          this.form.cusDdBnfBasicInfo.liveAddrCityCode = a[1];
          this.form.cusDdBnfBasicInfo.liveAddrCountyCode = a[2];
          this.form.cusDdBnfBasicInfo.liveAddress = a[3];
        }
    },
    addrProvCodeRule(rule, value, callback){
      if(!this.form.cusDdBnfBasicInfo.addrProvCode){
        callback("联系地址不能为空")
      }else{
        callback()
      }
    },
    emergencyContactProvCodeRule(rule, value, callback){
      if(!this.form.cusDdBnfBasicInfo.emergencyContactProvCode){
        callback("联系地址不能为空")
      }else{
        callback()
      }
    },
    addrProvCodeChange(areaStr){
        if(areaStr){
          let a = areaStr.split(",");
          this.form.cusDdBnfBasicInfo.addrProvCode = a[0];
          this.form.cusDdBnfBasicInfo.addrCityCode = a[1];
          this.form.cusDdBnfBasicInfo.addrCountyCode = a[2];
          this.form.cusDdBnfBasicInfo.address = a[3];
        }
    },
    belongEmergencyContactProvCodeChange(areaStr){
        if(areaStr){
          let a = areaStr.split(",");
          this.form.cusDdBnfBasicInfo.emergencyContactProvCode = a[0];
          this.form.cusDdBnfBasicInfo.emergencyContactCityCode = a[1];
          this.form.cusDdBnfBasicInfo.emergencyContactCountyCode = a[2];
          this.form.cusDdBnfBasicInfo.emergencyContactAddress = a[3];
        }
    },
    belongAddrProvCodeRule(rule, value, callback){
      if(!this.form.cusDdBnfBasicInfo.belongAddrProvCode){
        callback("所属地区不能为空")
      }else{
        callback()
      }
    },
    initDictConfig() {
         this.loading = true
        let promises = [this.getDict('BANK_CODE,BNF_RANK,PTY_RELATIVE_TYPE,ZJLX_JRCP,PACT_TYPE,ANNUAL_INCOME,OCU_CODE,PRJ_TYPE,NAT_CODE,MARITAL_CODE,CONTRACT_SERIE,IDNTYPES,FEE_NAMES_MSG,FEE_CAL_MODE,COM_MODE,FEE_PAY_OBJECT,FREQUENCY2,NATUREDAY_YN,TFIX_TYPE,INT_DAY_BASE,FREQUENCY,TFIX_TYPE,FEE_BASE,ACHIEVEMENT_TYPE,RATE_BASE,GENDER')]
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
            this.loading = true;
            if(this.form.cusDdBnfBasicInfo.yxDate){
              var val=this.form.cusDdBnfBasicInfo.yxDate
              this.form.cusDdBnfBasicInfo.idnStdDt=val[0]
              this.form.cusDdBnfBasicInfo.idnEndDt=val[1]
            }else{
              this.form.cusDdBnfBasicInfo.idnStdDt=''
              this.form.cusDdBnfBasicInfo.idnEndDt=''
            }
            const param = this.form
            param.cusDdBnfBasicInfo.ddCode=this.ddCode
            
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