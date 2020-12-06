<template>
  <a-form-model ref="form" :model="form" :rules="rules" v-cloak>
    <a-spin :spinning="loading">
      <a-layout :style="{margin:'0px'}">
          <a-layout-content :style="{margin:'8px'}">
            <a-card size="small" title="信托财产相关信息">
              <a-row :gutter="24">
                <a-col :span="8">
                    <BiFormItemSelect :disabled="optType == 'view'"  :options="dicts.TRUST_TERM_TYPE" label="信托期限" name="cusDdTrustAssetsInfo.trustTermType" v-model="form.cusDdTrustAssetsInfo.trustTermType" />
                </a-col>
                <a-col :span="8" v-if="form.cusDdTrustAssetsInfo.trustTermType=='1'">
                    <BiFormItemNumPercent :disabled="optType == 'view'" label="" style="padding-top:39px;width:80px;display:inline-block;" name="cusDdTrustAssetsInfo.trustTermPeriod" v-model="form.cusDdTrustAssetsInfo.trustTermPeriod" :min="0" :precision="0"/>&nbsp;&nbsp;年
                </a-col>
                <a-col :span="8" v-if="form.cusDdTrustAssetsInfo.trustTermType=='O'">
                    <BiFormItemInput :disabled="optType == 'view'" label="" style="padding-top:39px;width:120px;display:inline-block;" name="cusDdTrustAssetsInfo.trustTermPeriod" v-model="form.cusDdTrustAssetsInfo.trustTermPeriod"/>
                </a-col>
                <a-col :md="24" :sm="24">
                <a-form-model-item label="拟设立家族信托资产来源" prop="cusDdTrustAssetsInfo.assetSource">
                    <j-multi-select-tag :disabled="optType == 'view'" v-model="form.cusDdTrustAssetsInfo.assetSource"  dict-code="DD_PROPERTY_SOUREC"></j-multi-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                    <BiFormItemSelect :disabled="optType == 'view'"  :options="dicts.DD_PROPERTY_TYPE" label="初始信托财产类型" name="cusDdTrustAssetsInfo.assetType" v-model="form.cusDdTrustAssetsInfo.assetType" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemNumPercent :disabled="optType == 'view'" label="现金规模" name="cusDdTrustAssetsInfo.cashScale" v-model="form.cusDdTrustAssetsInfo.cashScale" :min="0" :precision="2"/>
                </a-col>
                <a-col :span="8">
                  <BiFormItemNumPercent :disabled="optType == 'view'" label="财产权规模" name="cusDdTrustAssetsInfo.assetsScale" v-model="form.cusDdTrustAssetsInfo.assetsScale" :min="0" :precision="2"/>
                </a-col>
                <a-col :span="8">
                  <BiFormItemNumPercent :disabled="optType == 'view'" label="财产总规模" name="cusDdTrustAssetsInfo.assetsTotalScale" v-model="form.cusDdTrustAssetsInfo.assetsTotalScale" :min="0" :precision="2"/>
                </a-col>
              </a-row>
              <div class="table-operator">
                <span class="desc">委托财产权</span>
                <a-button type="primary" icon="plus" :disabled="canEdit||optType == 'view'" @click="addRightInfos" style="float: right;margin-bottom:10px" >新增</a-button>
              </div>
              <a-table  :columns="conColumns" :dataSource="form.cusDdTrustAssetsRightInfos" rowKey="id" row bordered>
                <template  slot="trustRight" slot-scope="text, record">
                    <div class="editable-row-operations">
                      <BiFormItemInput v-if="record.canEdit"  label=''  :value="text" @change="e => soltChange(e, record.id,'trustRight')">
                      </BiFormItemInput>
                      <template v-else>{{text||''}}</template>
                    </div>
                  </template>
                  <template  slot="trustRightDescribe" slot-scope="text, record">
                    <div class="editable-row-operations">
                      <BiFormItemInput v-if="record.canEdit"  label=''  :value="text" @change="e => soltChange(e, record.id,'trustRightDescribe')">
                      </BiFormItemInput>
                      <template v-else>{{text||''}}</template>
                    </div>
                  </template>
                  <template  slot="operation" slot-scope="text, record" v-if="optType != 'view'">
                  <div class="editable-row-operations inputStyle" v-if="record.canEdit">
                      <a  @click="() => guardianEdit(record,'save')">保存 </a>
                      <a  @click="() => guardianEdit(record,'cancel')"> 取消</a>
                  </div>
                  <div class="editable-row-operations inputStyle" v-else>
                      <a  @click="() => guardianEdit(record,'edit')">编辑 </a>
                      <a-popconfirm title="确定删除吗?" @confirm="() => contactorDel(record.id)">
                        <a> 删除</a>
                      </a-popconfirm>
                  </div>
                </template>
              </a-table>
            </a-card>
            <a-card size="small" title="交付信托财产账户信息" style="margin-top:10px">
              <a-row :gutter="24">
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="户名" name="cusDdTrustAssetsInfo.assetAccName" placeholder="请输入" v-model="form.cusDdTrustAssetsInfo.assetAccName" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="账号" name="cusDdTrustAssetsInfo.assetAccNo" placeholder="请输入" v-model="form.cusDdTrustAssetsInfo.assetAccNo" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemSelect :disabled="optType == 'view'" label="开户行"  :options="dicts.BANK_CODE" name="cusDdTrustAssetsInfo.assetAccOpenBank" v-model="form.cusDdTrustAssetsInfo.assetAccOpenBank" />
                </a-col>
              </a-row>
            </a-card>
          </a-layout-content>
          <a-layout-footer :style="{ position: 'fixed', zIndex: 1, right:'12px', textAlign: 'center',left:'12px' , bottom:0 , background:'#fff'}">
            <a-button @click="toBack">返回</a-button>
            <a-button type="primary" @click="doSave" style="margin-left: 70px;" v-if="optType!='view'">提交</a-button>
          </a-layout-footer>
      </a-layout>
    </a-spin>
  </a-form-model>
</template>

<script>
import { saveAssignee, showAssignee } from '@/api/BiApi'
import JDSelectTag from '@comp/dict/JDSelectTag'
import { postAction, getAction, putAction } from '@api/manage'
import dictMixin from '@mixins/dictMixin'
import JDateRange from '@/components/jeecg/JDateRange'
import JMultiSelectTag from '@/components/dict/JMultiSelectTag'
export default {
  name: 'TrustEstate',
  components: {
    JMultiSelectTag,
    JDateRange,
    JDSelectTag
  },
  mixins: [dictMixin],
  props: {
    partyCode:{
      default: ''
    },
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
      canEdit:false,
      conColumns: [
         {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 65,
            // align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
        },
        {
          title:'财产权名称',
          dataIndex: 'trustRight',
          width: '200px',
          align:'center',
          scopedSlots: { customRender: 'trustRight' }
        },
        {
          title:'财产权描述',
          dataIndex: 'trustRightDescribe',
          width: '200px',
          align:'center',
          scopedSlots: { customRender: 'trustRightDescribe' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: '110px',
          align:'center',
          scopedSlots: { customRender: 'operation' },
        }
      ],
      isFirst: 0,
      record:{},
      loading: false,
      rules:{
          'cusDdTrustAssetsInfo.assetAccName':[
            {required: true, message: '请输入户名', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.assetAccNo':[
            {required: true, message: '请输入账号', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.assetAccOpenBank':[
            {required: true, message: '请输入开户行', trigger: 'change'},
          ],

          'cusDdTrustAssetsInfo.assetsTotalScale':[
            {required: true, message: '请输入财产总规模', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.assetsScale':[
            {required: true, message: '请输入财产权规模', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.cashScale':[
            {required: true, message: '请输入现金规模', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.assetType':[
            {required: true, message: '请选择财产类型', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.assetSource':[
            {required: true, message: '请选择资产来源', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.trustTermType':[
            {required: true, message: '请选择信托期限', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.businessType':[
            {required: true, message: '请选择业务类型', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.loaType':[
            {required: true, message: '请选择标准化/定制化', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.contractSeries':[
            {required: true, message: '请选择合同系列', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.gender':[
            {required: true, message: '请选择性别', trigger: 'change'},
          ],
           'cusDdTrustAssetsInfo.maritalCode':[
            {required: true, message: '请选择婚姻状况', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.ocuCode':[
            {required: true, message: '请选择职业', trigger: 'change'},
          ],
           'cusDdTrustAssetsInfo.nsrCode':[
            {required: true, message: '请选择年收入', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.enterprisr':[
            {required: true, message: '请输入企业名称', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.ocuOth':[
            {required: true, message: '请输入其他职业描述', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.emergencyContactName':[
            {required: true, message: '请输入姓名/名称', trigger: 'change'},
          ],
           'cusDdTrustAssetsInfo.emergencyContactCphone':[
            {required: true,validator: this.cphoneRule,trigger: ['change','blur']},
          ],
          'cusDdTrustAssetsInfo.emergencyContactFphone':[
            {validator: this.fphoneRule,trigger: ['change','blur']},
          ],
          'cusDdTrustAssetsInfo.emergencyContactMail':[
            {required: true,validator: this.emailRule,trigger: ['change','blur']},
          ],
          'cusDdTrustAssetsInfo.cphone':[
            {required: true,validator: this.cphoneRule,trigger: ['change','blur']},
          ],
          'cusDdTrustAssetsInfo.fphone':[
            {validator: this.fphoneRule,trigger: ['change','blur']},
          ],
          'cusDdTrustAssetsInfo.email':[
            {required: true,validator: this.emailRule,trigger: ['change','blur']},
          ],
          'cusDdTrustAssetsInfo.principalIdnType':[
            {required: true, message: '请输入证件类型', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.principalIdnNo':[
            {required: true, message: '请输入证件号码', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.principalName':[
            {required: true, message: '请输入姓名/名称', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.registerAddress':[
            {required: true, message: '请输入注册地址', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.addrProvCode':[
            {required: true,validator: this.addrProvCodeRule,trigger: ['change','blur']},
          ],
          'cusDdTrustAssetsInfo.emergencyContactProvCode':[
            {required: true,validator: this.emergencyContactProvCodeRule,trigger: ['change','blur']},
          ],
         'cusDdTrustAssetsInfo.belongAddrProvCode':[
            {required: true,validator: this.belongAddrProvCodeRule,trigger: ['change','blur']},
          ],
         'cusDdTrustAssetsInfo.natCode':[
            {required: true, message: '请选择所属国别', trigger: 'change'},
          ],
         'cusDdTrustAssetsInfo.idnType':[
            {required: true, message: '请选择客户类型', trigger: 'change'},
          ],
         'cusDdTrustAssetsInfo.partyName':[
            {required: true, message: '请输入名称', trigger: 'change'},
          ],
         'cusDdTrustAssetsInfo.idn':[
            {required: true, message: '请输入统一社会信用代码', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.contactPersonIdn':[
            {required: true, message: '有效期不能为空', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.contactPersonIdn2':[
            {required: true, message: '有效期不能为空', trigger: 'change'},
          ],
          'cusDdTrustAssetsInfo.contactPersonIdn3':[
            {required: true, message: '有效期不能为空', trigger: 'change'},
          ],
        },
      form: {
        cusDdTrustAssetsInfo:{},
        cusDdTrustAssetsRightInfos:[]
      },
      url: {
        find:'prj/cusDDInfo/trustAssets/info',
        save: '/prj/cusDDInfo/trustAssets/save',
        edite: '/prj/cusDDInfo/trustAssets/save'
      },
      dictOptionsData: []
    }
  },
  watch: {
    "form.cusDdTrustAssetsInfo.assetType"(val){
      if(val=='2'){
        this.rules['cusDdTrustAssetsInfo.cashScale'][0].required=false
        this.rules['cusDdTrustAssetsInfo.assetsScale'][0].required=true
      }else if(val=='1'){
        this.rules['cusDdTrustAssetsInfo.cashScale'][0].required=true
        this.rules['cusDdTrustAssetsInfo.assetsScale'][0].required=false
      }else{
        this.rules['cusDdTrustAssetsInfo.cashScale'][0].required=true
        this.rules['cusDdTrustAssetsInfo.assetsScale'][0].required=true
      }
      if(val=='1'||val=='3'){
        this.rules['cusDdTrustAssetsInfo.assetAccName'][0].required=true
        this.rules['cusDdTrustAssetsInfo.assetAccNo'][0].required=true
        this.rules['cusDdTrustAssetsInfo.assetAccOpenBank'][0].required=true
      }else{
        this.rules['cusDdTrustAssetsInfo.assetAccName'][0].required=false
        this.rules['cusDdTrustAssetsInfo.assetAccNo'][0].required=false
        this.rules['cusDdTrustAssetsInfo.assetAccOpenBank'][0].required=false
      }
    },
    "form.cusDdTrustAssetsInfo.cashScale"(val){
      this.form.cusDdTrustAssetsInfo.assetsTotalScale=parseFloat((val||0))+parseFloat((this.form.cusDdTrustAssetsInfo.assetsScale||0))
    },
    "form.cusDdTrustAssetsInfo.assetsScale"(val){
      this.form.cusDdTrustAssetsInfo.assetsTotalScale=parseFloat((val||0))+parseFloat((this.form.cusDdTrustAssetsInfo.cashScale||0))
    },
    "form.cusDdTrustAssetsInfo.contactPersonIdn"(val){
      if(val[0]==''){
          this.form.cusDdTrustAssetsInfo.contactPersonIdn=[]
          this.form.cusDdTrustAssetsInfo.idnStdDt=this.form.cusDdTrustAssetsInfo.idnEndDt=''
        }else{
           this.form.cusDdTrustAssetsInfo.idnStdDt=val[0]
           this.form.cusDdTrustAssetsInfo.idnEndDt=val[1]
        }
    },
    "form.cusDdTrustAssetsInfo.contactPersonIdn2"(val){
      if(val[0]==''){
          this.form.cusDdTrustAssetsInfo.contactPersonIdn2=[]
        }
    },
    "form.cusDdTrustAssetsInfo.contactPersonIdn3"(val){
      if(val[0]==''){
          this.form.cusDdTrustAssetsInfo.contactPersonIdn3=[]
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
    toBack(){
     window.postMessage('message', '*')
     this.$router.push({name:"customer-customerInfo",query: {optType:this.optType,editType:'view',partyCode:this.partyCode}});
    },
    contactorDel(id){
        this.form.cusDdTrustAssetsRightInfos.forEach((item,idx)=>{
          if(item.id==id){
            this.form.cusDdTrustAssetsRightInfos.splice(idx,1)
          }
        })
    },
    guardianEdit(r,operate) {
        this.canEdit=false
        this.form.cusDdTrustAssetsRightInfos.forEach((item)=>{
          item.canEdit=false
        })
        
        if(operate=='edit'){
           this.record=JSON.parse(JSON.stringify(r))
           r.canEdit=true
           this.canEdit=true
        }else if(operate=='cancel'){
           for(var key in this.record){
             r[key]=this.record[key]
           }
        }
    },
    addRightInfos(){
      this.form.cusDdTrustAssetsRightInfos.forEach((item)=>{
        item.canEdit=false
      })
      this.canEdit=true
      if(this.form.cusDdTrustAssetsRightInfos.length>0){
        var EmergencyPersonId=this.form.cusDdTrustAssetsRightInfos[this.form.cusDdTrustAssetsRightInfos.length-1].id+1
        this.form.cusDdTrustAssetsRightInfos.push({
          trustRight:'',id:EmergencyPersonId,trustRightDescribe:'',canEdit:true
        })
        this.record={
          trustRight:'',id:EmergencyPersonId,trustRightDescribe:'',canEdit:false
        }
      }else{
        this.form.cusDdTrustAssetsRightInfos.push({
            trustRight:'',id:1,trustRightDescribe:'',canEdit:true
        })
        this.record={
          trustRight:'',id:1,trustRightDescribe:'',canEdit:false
        }
      }
    },
    soltChange(value, id,soltName){
      const newData = [...this.form.cusDdTrustAssetsRightInfos];
      const target = newData.filter(item => id === item.id)[0];
      if (target) {
        target[soltName] = value;
        this.form.cusDdTrustAssetsRightInfos = newData;
      }
    },
    getInfoDis() {
      this.loading = true
      getAction(this.url.find, { ddCode: this.ddCode})
        .then(res => {
          if (res.success) {
            this.form = res.result
            if(!this.form.cusDdTrustAssetsInfo)
            this.form.cusDdTrustAssetsInfo={}
            var list=JSON.parse(JSON.stringify(res.result.cusDdTrustAssetsRightInfos))
            this.form.cusDdTrustAssetsRightInfos=[]
            list.forEach((item,idx)=>{
              this.form.cusDdTrustAssetsRightInfos.push({
                  trustRight:(item.trustRight||''),id:(item.id||idx),trustRightDescribe:(item.trustRightDescribe||''),canEdit:false
              })
            })
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
        callback("电子邮箱不能为空")
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
          this.form.cusDdTrustAssetsInfo.contactPersonAddrProvCode = a[0];
          this.form.cusDdTrustAssetsInfo.contactPersonAddrCityCode = a[1];
          this.form.cusDdTrustAssetsInfo.contactPersonAddrCountyCode = a[2];
          this.form.cusDdTrustAssetsInfo.contactPersonAddress = a[3];
        }
    },
    liveAddrProvCodeChange(areaStr){
        if(areaStr){
          let a = areaStr.split(",");
          this.form.cusDdTrustAssetsInfo.liveAddrProvCode = a[0];
          this.form.cusDdTrustAssetsInfo.liveAddrCityCode = a[1];
          this.form.cusDdTrustAssetsInfo.liveAddrCountyCode = a[2];
          this.form.cusDdTrustAssetsInfo.liveAddress = a[3];
        }
    },
    addrProvCodeRule(rule, value, callback){
      if(!this.form.cusDdTrustAssetsInfo.addrProvCode){
        callback("联系地址不能为空")
      }else{
        callback()
      }
    },
    emergencyContactProvCodeRule(rule, value, callback){
      if(!this.form.cusDdTrustAssetsInfo.emergencyContactProvCode){
        callback("联系地址不能为空")
      }else{
        callback()
      }
    },
    addrProvCodeChange(areaStr){
        if(areaStr){
          let a = areaStr.split(",");
          this.form.cusDdTrustAssetsInfo.addrProvCode = a[0];
          this.form.cusDdTrustAssetsInfo.addrCityCode = a[1];
          this.form.cusDdTrustAssetsInfo.addrCountyCode = a[2];
          this.form.cusDdTrustAssetsInfo.address = a[3];
        }
    },
    belongEmergencyContactProvCodeChange(areaStr){
        if(areaStr){
          let a = areaStr.split(",");
          this.form.cusDdTrustAssetsInfo.emergencyContactProvCode = a[0];
          this.form.cusDdTrustAssetsInfo.emergencyContactCityCode = a[1];
          this.form.cusDdTrustAssetsInfo.emergencyContactCountyCode = a[2];
          this.form.cusDdTrustAssetsInfo.emergencyContactAddress = a[3];
        }
    },
    belongAddrProvCodeRule(rule, value, callback){
      if(!this.form.cusDdTrustAssetsInfo.belongAddrProvCode){
        callback("所属地区不能为空")
      }else{
        callback()
      }
    },
    initDictConfig() {
         this.loading = true
        let promises = [this.getDict('BANK_CODE,DD_PROPERTY_TYPE,DD_ASSET_TYPE,TRUST_TERM_TYPE,CRM_IDE_TYPE,PACT_TYPE,ANNUAL_INCOME,OCU_CODE,PRJ_TYPE,NAT_CODE,MARITAL_CODE,CONTRACT_SERIE,IDNTYPES,FEE_NAMES_MSG,FEE_CAL_MODE,COM_MODE,FEE_PAY_OBJECT,FREQUENCY2,NATUREDAY_YN,TFIX_TYPE,INT_DAY_BASE,FREQUENCY,TFIX_TYPE,FEE_BASE,ACHIEVEMENT_TYPE,RATE_BASE,GENDER')]
        Promise.all(promises)
          .then(res => {

          })
          .finally(() => {
            this.loading = false
          })
    },
     doSave(){
      this.$refs.form.validate(valid => {
          if (valid) {
            this.loading = true;
            const param = this.form
            param.cusDdTrustAssetsInfo.ddCode=this.ddCode
            if(this.id && this.optType== 'edite'){
              param.cusDdTrustAssetsInfo.id = this.id
              return postAction(this.url.edite, param).then((res)=>{
                if(res.success){
                  //this.$emit('update')
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
                  //this.$emit('update')
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
.desc{
  line-height:40px;
  color:rgba(0, 0, 0, 0.85);
  font-size:14px
}
</style>