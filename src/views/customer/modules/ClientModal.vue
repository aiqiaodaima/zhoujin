<template>
  <a-form-model ref="form" :model="form" :rules="rules" v-cloak>
    <a-spin :spinning="loading">
      <a-layout :style="{margin:'0px'}">
          <a-layout-content :style="{margin:'8px'}">
            <a-card size="small" title="委托人基本信息">
               <a-row :gutter="24">
                <a-col :span="8">
                    <BiFormItemSelect :disabled="optType == 'view'"  :options="dicts.PRJ_TYPE" label="业务类型" name="cusDdConsignerInfo.businessType" v-model="form.cusDdConsignerInfo.businessType" />
                  </a-col>
                <a-col :span="8">
                  <BiFormItemSelect :disabled="optType == 'view'" label="标准化/定制化" :options="dicts.PACT_TYPE"  name="cusDdConsignerInfo.loaType" v-model="form.cusDdConsignerInfo.loaType"/>
                </a-col>
                <a-col :span="8">
                  <BiFormItemSelect :disabled="optType == 'view'" label="合同系列"  :options="dicts.CONTRACT_SERIE" name="cusDdConsignerInfo.contractSeries" v-model="form.cusDdConsignerInfo.contractSeries"/>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="姓名" name="cusDdConsignerInfo.partyName" placeholder="请输入" v-model="form.cusDdConsignerInfo.partyName" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemSelect :disabled="optType == 'view'" label="性别"  :options="dicts.GENDER" name="cusDdConsignerInfo.gender" v-model="form.cusDdConsignerInfo.gender"/>
                </a-col>
                <a-col :span="8">
                    <BiFormItemSelect :disabled="optType == 'view'" label="婚姻状况"  :options="dicts.MARITAL_CODE" name="cusDdConsignerInfo.maritalCode" v-model="form.cusDdConsignerInfo.maritalCode" />
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                    <BiFormItemSelect :disabled="optType == 'view'" label="证件类型"  :options="dicts.IDNTYPES" name="cusDdConsignerInfo.idnType" v-model="form.cusDdConsignerInfo.idnType" />
                  </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="证件号码" name="cusDdConsignerInfo.idn" v-model="form.cusDdConsignerInfo.idn"/>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item v-if="optType !== 'view'" label="证件有效期" prop="cusDdConsignerInfo.yxDate">
                    <j-date-range  @calendarChange="calendarChange" :currentDate="currentDate" v-model="form.cusDdConsignerInfo.yxDate" ></j-date-range>
                  </a-form-model-item>
                  <BiFormItemInput v-else disabled label="有效期" :value="form.cusDdConsignerInfo.yxDate&&(form.cusDdConsignerInfo.yxDate[0]+'~'+form.cusDdConsignerInfo.yxDate[1])"/>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="24">
                  <BiFormItemTextarea :readonly="optType == 'view'"  label="备注" v-model="form.cusDdConsignerInfo.remarks" name="remarks" placeholder="备注"/>
                </a-col>
              </a-row>
            </a-card>
            <a-card size="small" title="委托人家庭情况" style="margin-top:10px">
              <a-row :gutter="24">
                <a-col :span="24">
                  <BiFormItemInput :disabled="optType == 'view'" label="子女情况(有几个子女、性别、出生日期）" name="cusDdConsignerInfo.childInfo" placeholder="请输入" v-model="form.cusDdConsignerInfo.childInfo" />
                </a-col>
                <a-col :span="24">
                  <BiFormItemInput :disabled="optType == 'view'" label="父母情况（父母是否健在）" name="cusDdConsignerInfo.parentsInfo" placeholder="请输入" v-model="form.cusDdConsignerInfo.parentsInfo" />
                </a-col>
                <a-col :span="24">
                  <BiFormItemInput :disabled="optType == 'view'" label="兄弟姐妹（是否有兄弟姐妹）" name="cusDdConsignerInfo.brotherSisterInfo" placeholder="请输入" v-model="form.cusDdConsignerInfo.brotherSisterInfo" />
                </a-col>
              </a-row>
            </a-card>

            <a-card size="small" title="委托人工作及收入情况" style="margin-top:10px">
              <a-row :gutter="24">
                <a-col :span="8">
                  <BiFormItemSelect :disabled="optType == 'view'" label="职业"  :options="dicts.OCU_CODE" name="cusDdConsignerInfo.ocuCode" v-model="form.cusDdConsignerInfo.ocuCode" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="企业名称" name="cusDdConsignerInfo.enterprisr" v-model="form.cusDdConsignerInfo.enterprisr" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="其他职业描述" name="cusDdConsignerInfo.ocuOth" v-model="form.cusDdConsignerInfo.ocuOth" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemSelect :disabled="optType == 'view'" label="年收入"  :options="dicts.ANNUAL_INCOME" name="cusDdConsignerInfo.nsrCode" v-model="form.cusDdConsignerInfo.nsrCode" />
                </a-col>
              </a-row>
              <div class="table-operator">
                <span class="desc">已投产品</span>
                <a-button type="primary" icon="plus" :disabled="canEdit||optType == 'view'" @click="addProdInfos" style="float: right;margin-bottom:10px">新增</a-button>
            </div>
            <a-table  :columns="conColumns" :dataSource="form.cusDdConsignerProdInfos" rowKey="id" row bordered>
                <template  slot="prodName" slot-scope="text, record">
                    <div class="editable-row-operations">
                      <BiFormItemInput v-if="record.canEdit"  label=''  :value="text" @change="e => soltChange(e, record.id,'prodName')">
                      </BiFormItemInput>
                      <template v-else>{{text||''}}</template>
                    </div>
                  </template>
                  <template  slot="prodAtm" slot-scope="text, record">
                    <div class="editable-row-operations">
                      <BiFormItemNumPercent v-if="record.canEdit" :min="0"  :precision="2" label=''  :value="text" @change="e => soltChange(e, record.id,'prodAtm')">
                      </BiFormItemNumPercent>
                      <template v-else>{{text||0}}</template>
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
            

            <a-card size="small" title="联系信息" style="margin-top:10px">
              <a-row :gutter="24">
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="手机号码" name="cusDdConsignerInfo.cphone" placeholder="请输入" v-model="form.cusDdConsignerInfo.cphone" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="固定电话" name="cusDdConsignerInfo.fphone" placeholder="请输入" v-model="form.cusDdConsignerInfo.fphone" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="电子邮箱" name="cusDdConsignerInfo.email" placeholder="请输入" v-model="form.cusDdConsignerInfo.email" />
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item label="联系地址"  prop="cusDdConsignerInfo.addrProvCode" :key="'Y'">
                    <bi-area :showType="optType !== 'view'?'select':'text'" :models="[form.cusDdConsignerInfo.addrProvCode, form.cusDdConsignerInfo.addrCityCode, form.cusDdConsignerInfo.addrCountyCode,form.cusDdConsignerInfo.address]" @change="addrProvCodeChange" :show-lv="4"></bi-area>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-card>
            <a-card size="small" title="紧急联系人信息" style="margin-top:10px">
              <a-row :gutter="24">
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="姓名/名称" name="cusDdConsignerInfo.emergencyContactName" placeholder="请输入" v-model="form.cusDdConsignerInfo.emergencyContactName" />
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="手机号码" name="cusDdConsignerInfo.emergencyContactCphone" placeholder="请输入" v-model="form.cusDdConsignerInfo.emergencyContactCphone" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="固定电话" name="cusDdConsignerInfo.emergencyContactFphone" placeholder="请输入" v-model="form.cusDdConsignerInfo.emergencyContactFphone" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="电子邮箱" name="cusDdConsignerInfo.emergencyContactMail" placeholder="请输入" v-model="form.cusDdConsignerInfo.emergencyContactMail" />
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item label="联系地址"  prop="cusDdConsignerInfo.emergencyContactProvCode" :key="'Y'">
                    <bi-area  :showType="optType !== 'view'?'select':'text'" :models="[form.cusDdConsignerInfo.emergencyContactProvCode, form.cusDdConsignerInfo.emergencyContactCityCode, form.cusDdConsignerInfo.emergencyContactCountyCode,form.cusDdConsignerInfo.emergencyContactAddress]" @change="belongEmergencyContactProvCodeChange" :show-lv="4"></bi-area>
                  </a-form-model-item>
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
import moment from 'moment'
import JDateRange from '@/components/jeecg/JDateRange'
export default {
  name: 'ClientModal',
  components: {
    JDateRange,
    JDSelectTag
  },
  mixins: [dictMixin],
  props: {
    ddCode:{
      default: ''
    },
    partyCode:{
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
    },
    clientType:{
      default: ''
    }
  },
  data() {
    return {
      moment,
      currentDate:moment(),
      isFirst: 0,
      loading: false,
      canEdit:false,
      conColumns: [
         {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 65,
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
        },
        {
          title:'产品名称',
          dataIndex: 'prodName',
          width: '200px',
          align:'center',
          scopedSlots: { customRender: 'prodName' }
        },
        {
          title:'投资金额',
          dataIndex: 'prodAtm',
          width: '200px',
          align:'center',
          scopedSlots: { customRender: 'prodAtm' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: '110px',
          align:'center',
          scopedSlots: { customRender: 'operation' },
        }
      ],
      rules:{
          'cusDdConsignerInfo.businessType':[
            {required: true, message: '请选择业务类型', trigger: 'change'},
          ],
          'cusDdConsignerInfo.loaType':[
            {required: true, message: '请选择标准化/定制化', trigger: 'change'},
          ],
          'cusDdConsignerInfo.contractSeries':[
            {required: true, message: '请选择合同系列', trigger: 'change'},
          ],
          'cusDdConsignerInfo.gender':[
            {required: true, message: '请选择性别', trigger: 'change'},
          ],
           'cusDdConsignerInfo.maritalCode':[
            {required: true, message: '请选择婚姻状况', trigger: 'change'},
          ],
          'cusDdConsignerInfo.ocuCode':[
            {required: true, message: '请选择职业', trigger: 'change'},
          ],
           'cusDdConsignerInfo.nsrCode':[
            {required: true, message: '请选择年收入', trigger: 'change'},
          ],
          'cusDdConsignerInfo.enterprisr':[
            {required: true, message: '请输入企业名称', trigger: 'change'},
          ],
          'cusDdConsignerInfo.ocuOth':[
            {required: false, message: '请输入其他职业描述', trigger: 'change'},
          ],
          'cusDdConsignerInfo.emergencyContactName':[
            {required: true, message: '请输入姓名/名称', trigger: 'change'},
          ],
           'cusDdConsignerInfo.emergencyContactCphone':[
            {required: true,validator: this.cphoneRule,trigger: ['change','blur']},
          ],
          'cusDdConsignerInfo.emergencyContactFphone':[
            {validator: this.fphoneRule,trigger: ['change','blur']},
          ],
          'cusDdConsignerInfo.emergencyContactMail':[
            {required: true,validator: this.emailRule,trigger: ['change','blur']},
          ],
          'cusDdConsignerInfo.cphone':[
            {required: true,validator: this.cphoneRule,trigger: ['change','blur']},
          ],
          'cusDdConsignerInfo.fphone':[
            {validator: this.fphoneRule,trigger: ['change','blur']},
          ],
          'cusDdConsignerInfo.email':[
            {required: true,validator: this.emailRule,trigger: ['change','blur']},
          ],
          'cusDdConsignerInfo.principalIdnType':[
            {required: true, message: '请输入证件类型', trigger: 'change'},
          ],
          'cusDdConsignerInfo.principalIdnNo':[
            {required: true, message: '请输入证件号码', trigger: 'change'},
          ],
          'cusDdConsignerInfo.principalName':[
            {required: true, message: '请输入姓名/名称', trigger: 'change'},
          ],
          'cusDdConsignerInfo.registerAddress':[
            {required: true, message: '请输入注册地址', trigger: 'change'},
          ],
          'cusDdConsignerInfo.addrProvCode':[
            {required: true,validator: this.addrProvCodeRule,trigger: ['change','blur']},
          ],
          'cusDdConsignerInfo.emergencyContactProvCode':[
            {required: true,validator: this.emergencyContactProvCodeRule,trigger: ['change','blur']},
          ],
         'cusDdConsignerInfo.belongAddrProvCode':[
            {required: true,validator: this.belongAddrProvCodeRule,trigger: ['change','blur']},
          ],
         'cusDdConsignerInfo.natCode':[
            {required: true, message: '请选择所属国别', trigger: 'change'},
          ],
         'cusDdConsignerInfo.idnType':[
            {required: true, message: '请选择证件类型', trigger: 'change'},
          ],
         'cusDdConsignerInfo.partyName':[
            {required: true, message: '请输入名称', trigger: 'change'},
          ],
         'cusDdConsignerInfo.idn':[
            {required: true, message: '请输入证件号码', trigger: 'change'},
          ],
          'cusDdConsignerInfo.yxDate':[
            {required: true, message: '有效期不能为空', trigger: 'change'},
          ],
        },
      form: {
        cusDdConsignerInfo:{},
        cusDdConsignerProdInfos:[]
      },
      url: {
        addInfo:'/prj/cusInfo/query',
        find: '/prj/cusDDInfo/consigner/info',
        save: '/prj/cusDDInfo/consigner/save',
        edite: '/prj/cusDDInfo/consigner/save'
      },
      dictOptionsData: []
    }
  },
  watch: {
    "form.cusDdConsignerInfo.yxDate"(val){
      if(val[0]==''){
          this.currentDate=moment()
          this.form.cusDdConsignerInfo.yxDate=[]
          this.form.cusDdConsignerInfo.idnStdDt=this.form.cusDdConsignerInfo.idnEndDt=''
        }else{
           this.form.cusDdConsignerInfo.idnStdDt=val[0]
           this.form.cusDdConsignerInfo.idnEndDt=val[1]
        }
    },
    "form.cusDdConsignerInfo.ocuCode"(val){
      if(val=='OTH'){
        this.rules['cusDdConsignerInfo.ocuOth'][0].required=true
      }else{
        this.rules['cusDdConsignerInfo.ocuOth'][0].required=false
      }
    }
  },
  created() {
    this.initDictConfig()
    if(this.id){
      this.getInfoDis()
    }else{
      if(this.clientType=='1')
      this.getAddInfo()
    }
  },
  mounted() {
    //mounted here
  },
  methods: {
    calendarChange(val) {
      this.currentDate = val
    },
    addProdInfos(){
      this.form.cusDdConsignerProdInfos.forEach((item)=>{
        item.canEdit=false
      })
      this.canEdit=true
      if(this.form.cusDdConsignerProdInfos.length>0){
        var EmergencyPersonId=this.form.cusDdConsignerProdInfos[this.form.cusDdConsignerProdInfos.length-1].id+1
        this.form.cusDdConsignerProdInfos.push({
          prodAtm:'',id:EmergencyPersonId,prodName:'',canEdit:true
        })
        this.record={
          prodAtm:'',id:EmergencyPersonId,prodName:'',canEdit:false
        }
      }else{
        this.form.cusDdConsignerProdInfos.push({
            prodAtm:'',id:1,prodName:'',canEdit:true
        })
        this.record={
          prodAtm:'',id:1,prodName:'',canEdit:false
        }
      }
    },
    contactorDel(id){
        this.form.cusDdConsignerProdInfos.forEach((item,idx)=>{
          if(item.id==id){
            this.form.cusDdConsignerProdInfos.splice(idx,1)
          }
        })
    },
    guardianEdit(r,operate) {
        this.canEdit=false
        this.form.cusDdConsignerProdInfos.forEach((item)=>{
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
    soltChange(value, id,soltName){
      const newData = [...this.form.cusDdConsignerProdInfos];
      const target = newData.filter(item => id === item.id)[0];
      if (target) {
        target[soltName] = value;
        this.form.cusDdConsignerProdInfos = newData;
      }
    },
    toBack(){
     window.postMessage('message', '*')
     this.$router.push({name:"customer-customerInfo",query: {optType:this.optType,editType:'view',partyCode:this.partyCode}});
    },
    getAddInfo() {
      this.loading = true
      getAction(this.url.addInfo, { partyCode : this.partyCode })
        .then(res => {
          if (res.success) {
            this.form.cusDdConsignerInfo = res.result.cusBasicInfo
            
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.loading=false;
        })
    },
    
    getInfoDis() {
      this.loading = true
      getAction(this.url.find, { ddCode: this.ddCode})
        .then(res => {
          if (res.success) {
            this.form = res.result
            if(!this.form.cusDdConsignerInfo)
            this.form.cusDdConsignerInfo={}
           
            var PersonList=JSON.parse(JSON.stringify(res.result.cusDdConsignerProdInfos))
            this.form.cusDdConsignerProdInfos=[]
            PersonList.forEach((item,idx)=>{
              this.form.cusDdConsignerProdInfos.push({
                 id:(item.id||idx),prodName:(item.prodName||''),canEdit:false,prodAtm:(item.prodAtm||''),
              })
            })
            if(this.form.cusDdConsignerInfo.idnStdDt&&this.form.cusDdConsignerInfo.idnEndDt){
              this.$set(this.form.cusDdConsignerInfo,'yxDate',[this.form.cusDdConsignerInfo.idnStdDt,this.form.cusDdConsignerInfo.idnEndDt])
              this.currentDate=moment(this.form.cusDdConsignerInfo.idnStdDt, "YYYYMMDD")
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
          this.form.cusDdConsignerInfo.contactPersonAddrProvCode = a[0];
          this.form.cusDdConsignerInfo.contactPersonAddrCityCode = a[1];
          this.form.cusDdConsignerInfo.contactPersonAddrCountyCode = a[2];
          this.form.cusDdConsignerInfo.contactPersonAddress = a[3];
        }
    },
    liveAddrProvCodeChange(areaStr){
        if(areaStr){
          let a = areaStr.split(",");
          this.form.cusDdConsignerInfo.liveAddrProvCode = a[0];
          this.form.cusDdConsignerInfo.liveAddrCityCode = a[1];
          this.form.cusDdConsignerInfo.liveAddrCountyCode = a[2];
          this.form.cusDdConsignerInfo.liveAddress = a[3];
        }
    },
    addrProvCodeRule(rule, value, callback){
      if(!this.form.cusDdConsignerInfo.addrProvCode){
        callback("联系地址不能为空")
      }else{
        callback()
      }
    },
    emergencyContactProvCodeRule(rule, value, callback){
      if(!this.form.cusDdConsignerInfo.emergencyContactProvCode){
        callback("联系地址不能为空")
      }else{
        callback()
      }
    },
    addrProvCodeChange(areaStr){
        if(areaStr){
          let a = areaStr.split(",");
          this.form.cusDdConsignerInfo.addrProvCode = a[0];
          this.form.cusDdConsignerInfo.addrCityCode = a[1];
          this.form.cusDdConsignerInfo.addrCountyCode = a[2];
          this.form.cusDdConsignerInfo.address = a[3];
        }
    },
    belongEmergencyContactProvCodeChange(areaStr){
        if(areaStr){
          let a = areaStr.split(",");
          this.form.cusDdConsignerInfo.emergencyContactProvCode = a[0];
          this.form.cusDdConsignerInfo.emergencyContactCityCode = a[1];
          this.form.cusDdConsignerInfo.emergencyContactCountyCode = a[2];
          this.form.cusDdConsignerInfo.emergencyContactAddress = a[3];
        }
    },
    belongAddrProvCodeRule(rule, value, callback){
      if(!this.form.cusDdConsignerInfo.belongAddrProvCode){
        callback("所属地区不能为空")
      }else{
        callback()
      }
    },
    initDictConfig() {
         this.loading = true
        let promises = [this.getDict('ZJLX_JRCP,PACT_TYPE,ANNUAL_INCOME,OCU_CODE,PRJ_TYPE,NAT_CODE,MARITAL_CODE,CONTRACT_SERIE,IDNTYPES,FEE_NAMES_MSG,FEE_CAL_MODE,COM_MODE,FEE_PAY_OBJECT,FREQUENCY2,NATUREDAY_YN,TFIX_TYPE,INT_DAY_BASE,FREQUENCY,TFIX_TYPE,FEE_BASE,ACHIEVEMENT_TYPE,RATE_BASE,GENDER')]
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
            if(this.form.cusDdConsignerInfo.yxDate&&this.form.cusDdConsignerInfo.yxDate.length>0){
              var val=this.form.cusDdConsignerInfo.yxDate
              this.form.cusDdConsignerInfo.idnStdDt=val[0]
              this.form.cusDdConsignerInfo.idnEndDt=val[1]
            }
            const param = this.form
            param.cusDdConsignerInfo.ddCode=this.ddCode
            param.cusDdConsignerInfo.partyCode=this.partyCode
            if(this.id && this.optType== 'edite'){
              param.cusDdConsignerInfo.id = this.id
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
              param.cusDdConsignerInfo.id=''
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