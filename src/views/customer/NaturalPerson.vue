<template>
  <a-form-model ref="form" :model="form" :rules="rules" v-cloak>
    <a-spin :spinning="loading">
       <a-layout :style="{margin:'0px'}">
          <a-layout-content :style="{margin:'8px'}">
            <a-card size="small" title="基本信息">
              <a-row :gutter="24">
                <a-col :span="24">
                  <BiFormItemInput :disabled="optType == 'view'||optType == 'edite'" label="姓名" name="cusBasicInfo.partyName" placeholder="请输入" v-model="form.cusBasicInfo.partyName" />
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                    <BiFormItemSelect :disabled="optType == 'view'||optType == 'edite'"  :options="dicts.IDNTYPES" label="证件类型" name="cusBasicInfo.idnType" v-model="form.cusBasicInfo.idnType" />
                  </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'||optType == 'edite'" label="证件号码" placeholder="请输入证件号码" @initbirthDt ="initbirthDt($event,'as')"  name="cusBasicInfo.idn" v-model="form.cusBasicInfo.idn" />
                </a-col>
                <a-col :span="8">
                  <a-form-model-item v-if="optType != 'view'" label="有效期" prop="cusBasicInfo.yxDate">
                    <j-date-range :disabled="optType == 'view'"  @calendarChange="calendarChange" :currentDate="currentDate" v-model="form.cusBasicInfo.yxDate" ></j-date-range>
                  </a-form-model-item>
                  <BiFormItemInput v-else disabled label="有效期" :value="form.cusBasicInfo.yxDate&&(form.cusBasicInfo.yxDate[0]+'~'+form.cusBasicInfo.yxDate[1])"/>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <BiFormItemSelect :disabled="optType == 'view'"  :options="dicts.GENDER" label="性别" name="cusBasicInfo.gender" v-model="form.cusBasicInfo.gender" />
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="出生日期" prop="cusBasicInfo.birthDt">
                    <j-date :disabled="optType == 'view'" :showLongTerm='false' placeholder="请选择出生日期" v-model="form.cusBasicInfo.birthDt" style="width:100%"></j-date>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <BiFormItemSelect :disabled="optType == 'view'" label="婚姻状况"  :options="dicts.MARITAL_CODE" name="cusBasicInfo.maritalCode" v-model="form.cusBasicInfo.maritalCode" />
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="24">
                  <BiFormItemSelect :disabled="optType == 'view'"  :options="dicts.NAT_CODE" label="国籍" name="cusBasicInfo.natCode" v-model="form.cusBasicInfo.natCode" />
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24" v-if="form.cusBasicInfo.natCode=='001'||!form.cusBasicInfo.natCode">
                  <a-form-model-item label="所属地区"  prop="cusBasicInfo.belongAddrProvCode" :key="'Y'">
                    <bi-area :showType="optType !== 'view'?'select':'text'" :models="[form.cusBasicInfo.belongAddrProvCode, form.cusBasicInfo.belongAddrCityCode, form.cusBasicInfo.belongAddrCountyCode,form.cusBasicInfo.belongAddress]" @change="belongAddrProvCodeChange" :show-lv="4"></bi-area>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24" v-else>
                  <BiFormItemInput :disabled="optType == 'view'" label="所属地区" placeholder="请输入所属地区详情地址"  name="cusBasicInfo.belongAddress" v-model="form.cusBasicInfo.belongAddress" />
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item label="居住地区"  prop="cusBasicInfo.liveAddrProvCode" :key="'Y'">
                    <bi-area :showType="optType !== 'view'?'select':'text'" :models="[form.cusBasicInfo.liveAddrProvCode, form.cusBasicInfo.liveAddrCityCode, form.cusBasicInfo.liveAddrCountyCode,form.cusBasicInfo.liveAddress]" @change="liveAddrProvCodeChange" :show-lv="4"></bi-area>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="手机号码" name="cusBasicInfo.cphone" placeholder="请输入" v-model="form.cusBasicInfo.cphone" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="固定电话" name="cusBasicInfo.fphone" placeholder="请输入" v-model="form.cusBasicInfo.fphone" />
                </a-col>
                <a-col :span="8">
                  <BiFormItemInput :disabled="optType == 'view'" label="电子邮箱" name="cusBasicInfo.email" placeholder="请输入" v-model="form.cusBasicInfo.email" />
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="24">
                  <BiFormItemTextarea :readonly="optType == 'view'"  label="备注" v-model="form.cusBasicInfo.remarks" name="remarks" placeholder="备注"/>
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
          <a-card size="small" title="紧急联系人" style="margin-top:10px">
            <div class="table-operator">
              <a-button type="primary" icon="plus" v-if="optType != 'view'" :disabled="canEdit" @click="addEmergencyPerson" style="float: right;margin-bottom:10px">新增</a-button>
            </div>
            <a-table  :columns="conColumns" :dataSource="form.cusBasicInfoEmergencyPersonList" rowKey="id" row bordered>

              <template  slot="name" slot-scope="text, record">
                <div class="editable-row-operations">
                  <BiFormItemInput v-if="record.canEdit"  label=''  :value="text" @change="e => soltChange(e, record.id,'name')">
                  </BiFormItemInput>
                  <template v-else>{{text||''}}</template>
                </div>
              </template>
              <template  slot="cusRelativeType" slot-scope="text, record">
                <div class="editable-row-operations">
                  <!-- <BiFormItemInput v-if="record.canEdit"  label=''  :value="text" @change="e => soltChange(e, record.id,'cusRelativeType')">
                  </BiFormItemInput> -->
                  <BiFormItemSelect v-if="record.canEdit" label=''  :options="dicts.PTY_RELATIVE_TYPE"  :value="text" @change="e => soltChange(e, record.id,'cusRelativeType')" />
                  <template v-else>{{text?getDictNameByCode(dicts.PTY_RELATIVE_TYPE,text):''}}</template>
                </div>
              </template>
              <template  slot="address" slot-scope="text, record">
                <div class="editable-row-operations">
                  <BiFormItemInput v-if="record.canEdit"  label=''  :value="text" @change="e => soltChange(e, record.id,'address')">
                  </BiFormItemInput>
                  <template v-else>{{text||''}}</template>
                </div>
              </template>
              <template  slot="cphone" slot-scope="text, record">
                <div class="editable-row-operations">
                  <BiFormItemInput v-if="record.canEdit"  label=''  :value="text" @change="e => soltChange(e, record.id,'cphone')">
                  </BiFormItemInput>
                  <template v-else>{{text||''}}</template>
                </div>
              </template>
              <template  slot="fphone" slot-scope="text, record">
                <div class="editable-row-operations">
                  <BiFormItemInput v-if="record.canEdit"  label=''  :value="text" @change="e => soltChange(e, record.id,'fphone')">
                  </BiFormItemInput>
                  <template v-else>{{text||''}}</template>
                </div>
              </template>
              <template  slot="email" slot-scope="text, record">
                <div class="editable-row-operations">
                  <BiFormItemInput v-if="record.canEdit"  label=''  :value="text" @change="e => soltChange(e, record.id,'email')">
                  </BiFormItemInput>
                  <template v-else>{{text||''}}</template>
                </div>
              </template>
              <template  slot="remark" slot-scope="text, record">
                <div class="editable-row-operations">
                  <BiFormItemInput v-if="record.canEdit"  label=''  :value="text" @change="e => soltChange(e, record.id,'remark')">
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
import JDate from '@/components/jeecg/JDate'
import { postAction, getAction, putAction ,httpActionWF} from '@api/manage'
import dictMixin from '@mixins/dictMixin'
import moment from 'moment'
import { handleRemove } from '@/utils/fileRemove'
import JDateRange from '@/components/jeecg/JDateRange'
export default {
  name: 'NaturalPerson',
  components: {
    JDateRange,
    JDSelectTag,
    JDate
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
      idnRule1:[{required: true, message: '请输入证件号码', trigger: 'change'}],
      idnRule2:[{required: true,validator: this.idnRule,trigger: ['change','blur']}],
      currentDate:moment(),
      canEdit:false,
      conColumns: [
        {
          title:'姓名',
          dataIndex: 'name',
          width: '100px',
          align:'center',
          scopedSlots: { customRender: 'name' }
        },
        {
          title:'与委托人关系',
          dataIndex: 'cusRelativeType',
          width: '120px',
          align:'center',
          scopedSlots: { customRender: 'cusRelativeType' }
        },
        {
          title:'联系地址',
          dataIndex: 'address',
          width: '220px',
          align:'center',
          scopedSlots: { customRender: 'address' }
        },
        {
          title:'手机号码',
          dataIndex: 'cphone',
          width: '110px',
          align:'center',
          scopedSlots: { customRender: 'cphone' }
        },
        {
          title:'固定电话',
          dataIndex: 'fphone',
          width: '110px',
          align:'center',
          scopedSlots: { customRender: 'fphone' }
        },
        {
          title:'邮箱',
          dataIndex: 'email',
          width: '110px',
          align:'center',
          scopedSlots: { customRender: 'email' }
        },
        {
          title:'备注',
          dataIndex: 'remark',
          width: '110px',
          align:'center',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: '110px',
          align:'center',
          //fixed: 'right',
          scopedSlots: { customRender: 'operation' },
        }
      ],
      record:{},
      isFirst: 0,
            loading: false,
      rules:{
          'cusBasicInfo.cphone':[
            {required: true,validator: this.cphoneRule,trigger: ['change','blur']},
          ],
          'cusBasicInfo.fphone':[
            {validator: this.fphoneRule,trigger: ['change','blur']},
          ],
          'cusBasicInfo.email':[
            {validator: this.emailRule,trigger: ['change','blur']},
          ],
          'cusBasicInfo.liveAddrProvCode':[
            {required: true,validator: this.liveAddrProvCodeRule,trigger: ['change','blur']},
          ],
          'cusBasicInfo.belongAddrProvCode':[
            {required: true,validator: this.belongAddrProvCodeRule,trigger: ['change','blur']},
          ],
          'cusBasicInfo.natCode':[
            {required: true, message: '请选择国籍', trigger: 'change'},
          ],
         
          'cusBasicInfo.birthDt':[
            {required: true, message: '请选择出生日期', trigger: 'change'},
          ],
          'cusBasicInfo.partyName':[
            {required: true, message: '请输入姓名', trigger: 'change'},
          ],
          'cusBasicInfo.gender':[
            {required: true, message: '请选择性别', trigger: 'change'},
          ],
          'cusBasicInfo.idnType':[
            {required: true, message: '请选择证件类型', trigger: 'change'},
          ],
          'cusBasicInfo.idn':[{required: true, message: '请输入证件号码', trigger: 'change'}],
          'cusBasicInfo.yxDate':[
            {required: true, message: '有效期不能为空', trigger: 'change'},
          ]
        },
      form: {
        files:[],
        cusBasicInfo:{
          yxDate:[],
          birthDt: '',
          idnType: ''
        },
        cusBasicInfoEmergencyPersonList:[]
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
    "form.cusBasicInfo.idnType"(val){
      if(val=='N'){
        this.rules['cusBasicInfo.idn']=this.idnRule2
      }else{
        this.rules['cusBasicInfo.idn']=this.idnRule1
      }
    },
    "form.cusBasicInfo.yxDate"(val){
      if(!val)
      return
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
    toBack(){
       this.$router.push({name:"customer-customer"});
    },
    contactorDel(id){
        this.form.cusBasicInfoEmergencyPersonList.forEach((item,idx)=>{
          if(item.id==id){
            this.form.cusBasicInfoEmergencyPersonList.splice(idx,1)
          }
        })
    },
    guardianEdit(r,operate) {
        this.canEdit=false
        this.form.cusBasicInfoEmergencyPersonList.forEach((item)=>{
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
    addEmergencyPerson(){
      this.form.cusBasicInfoEmergencyPersonList.forEach((item)=>{
        item.canEdit=false
      })
      this.canEdit=true
      if(this.form.cusBasicInfoEmergencyPersonList.length>0){
        var EmergencyPersonId=this.form.cusBasicInfoEmergencyPersonList[this.form.cusBasicInfoEmergencyPersonList.length-1].id+1
        this.form.cusBasicInfoEmergencyPersonList.push({
          name:'',cusRelativeType:'',id:EmergencyPersonId,address:'',cphone:'',fphone:'',email:'',remark:'',canEdit:true
        })
        this.record={
          name:'',cusRelativeType:'',id:EmergencyPersonId,address:'',cphone:'',fphone:'',email:'',remark:'',canEdit:false
        }
      }else{
        this.form.cusBasicInfoEmergencyPersonList.push({
            name:'',cusRelativeType:'',id:1,address:'',cphone:'',fphone:'',email:'',remark:'',canEdit:true
        })
        this.record={
          name:'',cusRelativeType:'',id:1,address:'',cphone:'',fphone:'',email:'',remark:'',canEdit:false
        }
      }
    },
    soltChange(value, id,soltName){
      const newData = [...this.form.cusBasicInfoEmergencyPersonList];
      const target = newData.filter(item => id === item.id)[0];
      if (target) {
        target[soltName] = value;
        this.form.cusBasicInfoEmergencyPersonList = newData;
      }
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
              this.$set(this.form.cusBasicInfo,'yxDate',[this.form.cusBasicInfo.idnStdDt,this.form.cusBasicInfo.idnEndDt])
              this.currentDate=moment(this.form.cusBasicInfo.idnStdDt, "YYYYMMDD")
            }
            var PersonList=JSON.parse(JSON.stringify(res.result.cusBasicInfoEmergencyPersonList))
            this.form.cusBasicInfoEmergencyPersonList=[]
            PersonList.forEach((item,idx)=>{
              this.form.cusBasicInfoEmergencyPersonList.push({
                name:(item.name||''),cusRelativeType:(item.cusRelativeType||''),id:idx,address:(item.address||''),cphone:(item.cphone||''),fphone:(item.fphone||''),email:(item.email||''),remark:(item.remark||''),canEdit:false
              })
            })
            
            
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.loading=false;
        })
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
    liveAddrProvCodeChange(areaStr){
        if(areaStr){
          let a = areaStr.split(",");
          this.form.cusBasicInfo.liveAddrProvCode = a[0];
          this.form.cusBasicInfo.liveAddrCityCode = a[1];
          this.form.cusBasicInfo.liveAddrCountyCode = a[2];
          this.form.cusBasicInfo.liveAddress = a[3];
        }
    },
    belongAddrProvCodeRule(rule, value, callback){
      if(!this.form.cusBasicInfo.belongAddrProvCode||
         !this.form.cusBasicInfo.belongAddrCityCode||
         !this.form.cusBasicInfo.belongAddrCountyCode||
         !this.form.cusBasicInfo.belongAddress
      ){
        callback("所属地区不能为空")
      }
      else{
        callback()
      }
    },
    liveAddrProvCodeRule(rule, value, callback){
      if(!this.form.cusBasicInfo.liveAddrProvCode||
        !this.form.cusBasicInfo.liveAddrCityCode||
        !this.form.cusBasicInfo.liveAddrCountyCode||
        !this.form.cusBasicInfo.liveAddress
      ){
        callback("居住地区不能为空")
      }else{
        callback()
      }
    },
    cphoneRule(rule, value, callback){
        if(!value){
          callback("手机号码不能为空!")
        }else{
          if(new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)){
             callback()
          }else{
            callback("请输入正确格式手机号码!");
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
          callback("请输入正确格式固定电话!");
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
          callback("请输入正确格式的邮箱!")
        }
      }
    },
    idnRule(rule, value, callback){
        if(!value){
          callback("请输入证件号码")
        }else{
          if(new RegExp(/^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/).test(value)){
             callback()
          }else{
            callback("请输入正确格式身份证号码");
          }
        }
    },
    initDictConfig() {
         this.loading = true
        let promises = [this.getDict('PTY_RELATIVE_TYPE,BANK_CODE,ZJLX_JRCP,CRM_IDE_TYPE,NAT_CODE,MARITAL_CODE,CONTRACT_SERIE,IDNTYPES,FEE_NAMES_MSG,FEE_CAL_MODE,COM_MODE,FEE_PAY_OBJECT,FREQUENCY2,NATUREDAY_YN,TFIX_TYPE,INT_DAY_BASE,FREQUENCY,TFIX_TYPE,FEE_BASE,ACHIEVEMENT_TYPE,RATE_BASE,GENDER')]
        Promise.all(promises)
          .then(res => {

          })
          .finally(() => {
            this.loading = false
          })
    },
    cphoneRule1(value, ){
        return new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)
    },
    fphoneRule1(value){
      return new RegExp(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/).test(value)
    },
    emailRule1(value){
      return new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value)
    },
    doSave(){
      this.$refs.form.validate(valid => {
          const that = this
          if (valid) {
            var personList=this.form.cusBasicInfoEmergencyPersonList
            if(personList.length>0){
              for(var i=0;i<personList.length;i++){
                if(personList[i].cphone){
                  if(!this.cphoneRule1(personList[i].cphone)){
                    this.$message.error(`紧急联系人${personList[i].name}手机号格式不正常`);
                    return
                  }
                }
                if(personList[i].fphone){
                  if(!this.fphoneRule1(personList[i].fphone)){
                    this.$message.error(`紧急联系人${personList[i].name}固定电话格式不正常`);
                    return
                  }
                }
                if(personList[i].email){
                  if(!this.emailRule1(personList[i].email)){
                    this.$message.error(`紧急联系人${personList[i].name}邮箱格式不正常`);
                    return
                  }
                }
              }
            }
            this.loading = true;
            if(this.form.cusBasicInfo.yxDate&&this.form.cusBasicInfo.yxDate.length>0){
              var val=this.form.cusBasicInfo.yxDate
              this.form.cusBasicInfo.idnStdDt=val[0]
              this.form.cusBasicInfo.idnEndDt=val[1]
            }
            const param = this.form
            param.cusBasicInfo.clientType='1'
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
                    cusBasicInfo:{
                      yxDate:[],
                      birthDt: '',
                      idnType: ''
                    },
                    cusBasicInfoEmergencyPersonList:[]
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

<style lang="scss" scoped>
@import '~@assets/less/common.less';
.ant-tabs-nav .ant-tabs-tab{
  margin: 0;
}
 /deep/ .ant-table-wrapper{
  clear: both;
}
/deep/ .ant-upload-list-item{
  width: 50%;
}
</style>