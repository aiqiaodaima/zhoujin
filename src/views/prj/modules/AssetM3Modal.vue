<template>
  <j-modal
    title="保单"
    :width="800"
    :destroyOnClose="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :fullscreen="fullscreen"
    :bodyStyle="{padding:'5px',backgroundColor:'rgb(240,242,245)'}"
    @cancel="handleCancel">
    <template slot="footer">
      <a-row :gutter="24" style="margin:0;padding:0">
        <a-col :span="23" style="text-align: center;">
          <a-button v-if="optType !== 'view'" type="primary" @click="handleOk" :loading="confirmLoading">提交</a-button>
          <a-button @click="handleCancel">关闭</a-button>
        </a-col>
      </a-row>
    </template>
    <a-spin :spinning="confirmLoading" style="margin: 5px;">
      <a-form :form="form" ref="form" formLayout="horizontal">
        <a-form-item style="display: none;">
          <a-input v-decorator="['cta.id', {}]"/>
        </a-form-item>
        <a-form-item style="display: none;">
          <a-input v-decorator="['cat.id', {}]"/>
        </a-form-item>
        <a-card size="small" title="通用信息" :bordered="true">
          <a-row :gutter="24">
            <BiCol><BiFormItemSelect :disabled="disabled" label="子账户" :decorator="['cat.accNo', rules.globalReq]" :options="cusAccInfoList" custom-key="accNo" custom-val="accName"/></BiCol>
            <BiCol><BiFormItemSelect :disabled="disabled" label="委托人" :decorator="['cta.partyCode',rules.globalReq]" :options="relPartyList" custom-key="PARTY_CODE" custom-val="PARTY_NAME"/></BiCol>
            <BiCol><BiFormItemSelect :disabled="disabled" label="保险人" :decorator="['insCommon.insuer', rules.globalReq]" :options="orgList" custom-key="orgCode" custom-val="orgName"/></BiCol>
            <BiCol>
              <a-row :gutter="24">
                <a-col :span="model.policyholderType === 'OTH'?12:24">
                  <BiFormItemSelect :disabled="disabled" label="投保人类型" :options="dicts.POLICYHOLDER_TYPE" :decorator="['insCommon.policyholderType', rules.globalReq]" @change="(val)=>{this.model.policyholderType = val;}"/>
                </a-col>
                <a-col :span="12" v-if="model.policyholderType === 'OTH'">
                  <BiFormItemInput :disabled="disabled" :decorator="['insCommon.policyholderTypeOth', rules.globalReq]" style="padding-top: 40px;"/>
                </a-col>
              </a-row>
            </BiCol>
            <BiCol>
              <BiFormItemSelect  :disabled="disabled" label="投保委托人"  :decorator="['insCommon.partyCode', this.model.policyholderType==='1'? rules.globalReq:{}]" :options="relPartyList" custom-key="PARTY_CODE" custom-val="PARTY_NAME"/>
            </BiCol>
            <BiCol>
              <BiFormItemSelect :disabled="disabled" label="领取特定保险金的保险金受益人" :decorator="['insCommon.beneficiary', {}]" :options="teeList" custom-key="partyCode" custom-val="partyName"/>
            </BiCol>
            <BiCol><BiFormItemSelect :disabled="disabled" label="是否计信托份额" :options="dicts.y_n" :decorator="['cta.unitYn', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemSelect :disabled="disabled" label="是否收费" :options="dicts.y_n" :decorator="['cta.feesYn', rules.globalReq]"/></BiCol>
          </a-row>
        </a-card>
        <a-card size="small" title="被保人" style="margin-top: 15px">
          <BiCol>
            <!-- <a-form-item label="姓名/名称">
              <a-input-search v-decorator="['insCommon.partyName', rules.globalReq]" enter-button @search="onInsPartySearch"   />
            </a-form-item>
            <BiFormItemInput style="display: none;" :decorator="['insCommon.partyCode', {}]"/> -->
            <BiFormItemInput :disabled="disabled" label="姓名/名称" :decorator="['insCommon.partyName', rules.globalReq]"/>
          </BiCol>
          <BiCol>
            <a-row :gutter="24">
              <a-col :span="model.idnType === 'O'?12:24">
                <BiFormItemSelect :disabled="disabled" label="证件类型" :options="dicts.IDNTYPES" :decorator="['insCommon.idnType', rules.globalReq]" @change="(val)=>{this.model.idnType = val;}"/>
              </a-col>
              <a-col :span="12" v-if="model.idnType === 'O'">
                <BiFormItemInput :disabled="disabled" :decorator="['insCommon.idnTypeOth', rules.globalReq]" style="padding-top: 40px;"/>
              </a-col>
            </a-row>
          </BiCol>
          <BiCol><BiFormItemInput :disabled="disabled" label="证件号码" :decorator="['insCommon.idn', rules.globalReq]"/></BiCol>
          <BiCol>
            <!-- <a-form-item label="有效期">
               <j-date v-decorator="['insCommon.idnEndDt', {}]" style="width: 100%"></j-date> 
            </a-form-item> -->  
            
              <BiRangeDatePicker :disabled="disabled" label="有效期"  :decorator="['insCommon.idnDate', rules.globalReq]"  :dateEnd="queryParam.idnEndDt" :dateStart="queryParam.idnStartDt" @change="changeFlowDate"  />              
                                 
          </BiCol>
         
          <BiCol><BiFormItemInput :disabled="disabled" label="手机号码" :decorator="['insCommon.cphone', rules.phone]" placeholder="请输入11位手机号"  /></BiCol>
          <BiCol><BiFormItemInput :disabled="disabled" label="固定电话" :decorator="['insCommon.fphone', rules.fixedPhone]"/></BiCol>
          <BiCol><BiFormItemInput :disabled="disabled" label="电子邮箱" :decorator="['insCommon.email', rules.email]"/></BiCol>
         
          <BiCol :xl="{ span: 12, offset: 1}" :lg="{ span: 14, offset: 1}" :md="{ span: 20, offset: 1}">
            <table>
              <tr>
                <td style="width: 350px;"><BiFormItemCascader :disabled="disabled" label="联系地址" :decorator="['addrCascader', rules.globalReq]" @change="onAddrCascaderChange"/></td>
                <td style="width: 115px;vertical-align: middle;padding-left: 15px;padding-top: 17px;"> 详细地址:</td>
                <td style="padding-top: 40px;;width: 350px"><BiFormItemInput :disabled="disabled" :decorator="['insCommon.address', rules.globalReq]"/></td>
              </tr>
            </table>
            <div style="display: none;">
              <a-form-item >
                <a-input :disabled="disabled" v-decorator="['insCommon.addrCunCode',{}]"></a-input>
              </a-form-item>
              <a-form-item >
                <a-input :disabled="disabled" v-decorator="['insCommon.addrProvCode',{}]"></a-input>
              </a-form-item>
              <a-form-item >
                <a-input :disabled="disabled" v-decorator="['insCommon.addrCityCode',{}]"></a-input>
              </a-form-item>
            </div>
          </BiCol>
        </a-card>
        <a-card size="small" title="保单信息" style="margin-top: 15px">
          <a-row :gutter="24">
            <BiCol><BiFormItemInput :disabled="disabled" label="保险产品名称" :decorator="['insurance.insuranceName', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemInput :disabled="disabled" label="险种名称" :decorator="['insurance.insTypeName', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemInput :disabled="disabled" label="保险合同编号" :decorator="['insurance.insuranceCode', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemInput :disabled="disabled" label="保险合同名称" :decorator="['insurance.insContractName', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemInput :disabled="disabled" label="保险单号" :decorator="['insurance.insuranceNo', {}]"/></BiCol>
            <BiCol><BiFormItemInput :disabled="disabled" label="投保书流水号/电子投保标识号" :decorator="['insurance.insSerialNo', {}]"/></BiCol>
            <BiCol><BiFormItemInput :disabled="disabled" label="受理号" :decorator="['insurance.acceptId', {}]" /></BiCol>
            <BiCol><BiFormItemSelect :disabled="disabled" label="币种" :options="dicts.CUR_CODE" :decorator="['insurance.curCode', {...rules.globalReq, initialValue:'156'}]"/></BiCol>
            <BiCol><BiFormItemSelect :disabled="disabled" label="保险类型" :options="dicts.INSURANCE_TYPE" :decorator="['insurance.insType', rules.globalReq]" @change="(val)=>{this.model.insType = val;}"/></BiCol>
            <BiCol v-show="model.insType==='QU_LIFE'"><BiFormItemNumPercent :disabled="disabled" label="总保额金额" :decorator="model.insType!=='QU_LIFE'?['insurance.erAmount']:['insurance.erAmount', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemNumPercent :disabled="disabled" label="初始可确定的保额" :decorator="['insurance.initAmt',{}]"/></BiCol>
            <BiCol><BiFormItemNumPercent :disabled="disabled" label="总保费金额" :decorator="model.insType==='QU_LIFE'?['insurance.feiAmount']:['insurance.feiAmount', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemNumPercent :disabled="disabled" label="价值金额" :decorator="['insurance.insPrice', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemTextarea :disabled="disabled" label="后续资金划分规则" :decorator="['insurance.subfundsDivRul', {}]"/></BiCol>
          </a-row>
        </a-card>
        <a-card size="small" title="保单收款信息" style="margin-top: 15px">
          <a-row :gutter="24">
            <BiCol v-if="model.proxyFeeYn==='Y'">
              <BiFormItemInput :disabled="disabled" label="收款户名" :decorator="['insurance.accName',rules.globalReq]"/>
            </BiCol>
             <BiCol v-else>
              <BiFormItemInput :disabled="disabled" label="收款户名" :decorator="['insurance.accName',{} ]"/>
            </BiCol>
            <BiCol v-if="model.proxyFeeYn==='Y'">
              <BiFormItemInput :disabled="disabled" label="收款账号" :decorator="['insurance.accNo',rules.globalReq]"/>
            </BiCol>
             <BiCol v-else>
              <BiFormItemInput :disabled="disabled" label="收款账号" :decorator="['insurance.accNo',{} ]"/>
            </BiCol>
            <BiCol v-if="model.proxyFeeYn==='Y'">
              <BiFormItemInput :disabled="disabled" label="收款账户开户行" :decorator="['insurance.accOpenBank',rules.globalReq]" />
            </BiCol>
            <BiCol v-else>
              <BiFormItemInput :disabled="disabled" label="收款账户开户行" :decorator="['insurance.accOpenBank',{}]" showSearch @click="selectTranOpenBran"  />
            </BiCol>
            <BiCol >
              <BiFormItemInput :disabled="disabled" label="收款账户开户行编号" :decorator="['insurance.accOpenBankCode',{}]"  />
            </BiCol>
          </a-row>
        </a-card>
        <a-card size="small" title="保单缴费信息" style="margin-top: 15px">
          <a-row :gutter="24">
            <BiCol><BiFormItemSelect :disabled="disabled" label="是否代缴保费" :options="dicts.y_n" :decorator="['insRegulations.proxyFeeYn', {...rules.globalReq, initialValue:'N'}]" @change="(v)=>{this.model.proxyFeeYn=v;}"/></BiCol>
            <BiCol v-if="model.proxyFeeYn==='Y'"><BiFormItemNumPercent :disabled="disabled" label="每期保费金额" :decorator="['insRegulations.feeAmt', {...rules.globalReq}]"/></BiCol>
            <BiCol v-if="model.proxyFeeYn==='Y'"><BiFormItemSelect :disabled="disabled" label="缴费情况" :options="dicts.PROXY_INSFEE_TYPE" :decorator="['insRegulations.feeType', {...rules.globalReq}]" @change="(v)=>{if(v==='2'){this.form.setFieldsValue({'insRegulations.feePeriod':0}) }}"/></BiCol>
            <BiCol v-if="model.proxyFeeYn==='Y'"><BiFormItemNumPercent :disabled="disabled"  label="已缴期数" :decorator="['insRegulations.feePeriod', {...rules.globalReq}]"/></BiCol>
            <BiCol v-if="model.proxyFeeYn==='Y'"><BiFormItemSelect  :disabled="disabled" label="缴费频率" :options="dicts.PROXY_INSFEE_FRANQC" :decorator="['insRegulations.frequency', rules.globalReq]" @change="handleFrequencyChange"/></BiCol>
            <BiCol v-if="model.proxyFeeYn==='Y'"><BiFormItemNumPercent :disabled="disabled" label="未来需缴期数" :decorator="['insRegulations.unpaidPeriod', {...rules.globalReq}]"/></BiCol>
            <BiCol v-if="model.proxyFeeYn==='Y'">
              <a-form-item label="缴费起始日">
                <j-date :disabled="disabled" v-decorator="['insRegulations.startDt', {...rules.globalReq, initialValue:'2020-05-26'}]" style="width: 100%"></j-date>
              </a-form-item>
            </BiCol>
            <BiCol v-if="model.proxyFeeYn==='Y'">
              <a-form-item label="缴费结束日">
                <j-date :disabled="disabled" v-decorator="['insRegulations.endDt', {...rules.globalReq, initialValue:'2040-05-26'}]" style="width: 100%"></j-date>
              </a-form-item>
              <a-form-item style="display: none;">
                <j-date :disabled="disabled" v-decorator="['hideEndDt', {}]" style="width: 100%"></j-date>
              </a-form-item>
            </BiCol>
          </a-row>
          <div v-if="model.proxyFeeYn==='Y' && optType !== 'view'" style="text-align: right;"><a-button style="margin-bottom: 42px;" @click="handleShowPlan" type="primary" icon="ordered-list">生成缴费计划</a-button></div>
        </a-card>
        <a-card v-if="model.proxyFeeYn==='Y'" size="small" title="保单缴费计划" style="margin-top: 15px;padding-bottom: 20px">
          <a slot="extra" href="#" v-show="optType !== 'view'"><a-button @click="handlePlanAdd" type="primary" icon="plus">新增</a-button></a>
          <a-table
            ref="table"
            bordered
            size="small"
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :loading="loading"
            :pagination="false"
            @change="handleTableChange">
            <span slot="action" slot-scope="text, record" v-show="optType !== 'view'">
              <a @click="handlePlanEdit(record)">编辑</a>
              <a-divider type="vertical"></a-divider>
              <a-popconfirm title="确定删除吗?" @confirm="() => handlePlanDelete(record.id)"><a>删除</a></a-popconfirm>
            </span>
          </a-table>
        </a-card>
        <a-card size="small" title="附件" style="margin-top: 15px">
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item label="文件上传">
                <a-upload :fileList="files" :multiple="true" :remove="handleFileRemove" :beforeUpload="beforeUpload">
                  <a-button v-if="optType !== 'view'"> <a-icon type="upload"></a-icon> 选择 </a-button>
                </a-upload>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
      </a-form>
    </a-spin>
    <AssetM3PlanModal ref="m3PlanModal" @ok="m3PlanModalOk"></AssetM3PlanModal>
    <BiModal 
      :visible.sync="modal.visible"
      :width="800"
      :title="modal.title"
      :fullscreen.sync="modal.fullscreen"
      :switchFullscreen="modal.switchFullscreen"
      @handleOk='handleOkBank'
      :confirmLoading='modal.confirmLoading'
      >
      <BankInfoWithBankCode />
    </BiModal>
  </j-modal>
  
</template>

<script>
  import moment from 'moment'
  import JDSelectTag from '@/components/dict/JDSelectTag'
  import { postAction,httpActionWF,getAction } from '@/api/manage'
  import BiFormItemSelect from '@/components/BI/BiFormItemSelect'
  import { mapActions, mapState, mapMutations } from 'vuex'
  import dictMixin from '@/mixins/dictMixin'
  import BiFormItemNumPercent from '@/components/BI/BiFormItemNumPercent'
  import BiCol from '../../../components/BI/BiCol'
  import BiRow from '@/components/BI/BiRow'
  import JDate from '@/components/jeecg/JDate'
  import BiFormItemInput from '../../../components/BI/BiFormItemInput'
  import JDateRange from '../../../components/jeecg/JDateRange'
  import BiArea from '../../../components/BI/BiArea'
  import BiFormItemTextarea from '../../../components/BI/BiFormItemTextarea'
  import BiFormItemDatePiker from '../../../components/BI/BiFormItemDatePicker'
  import BiFormItemCascader from '../../../components/BI/BiFormItemCascader'
  import AssetM3PlanModal from './AssetM3PlanModal'
  import { convertToCamelCase, formatAmt } from '../../../utils/util'
  import BankInfoWithBankCode from '../../fundFlow/BankInfoWithBankCode'

  export default {
    name: 'AssetM3Modal',
    mixins:[dictMixin],
    provide (){ 
      return {
        getTranOpenBran:  this.getTranOpenBran
    }},
    components: {
      AssetM3PlanModal,
      BiFormItemCascader,
      BiFormItemDatePiker,
      BiFormItemTextarea,
      BiArea,
      JDateRange,
      BiFormItemInput,
      JDate,
      BiRow,
      BiCol,
      BiFormItemNumPercent,
      BiFormItemSelect,
      JDSelectTag,
      BankInfoWithBankCode
    },
    data() {
      
      let r = {rules: [{ required: true, message: '必输字段!'}]};           
      let that = this;
      return {
        teeList:'',
        queryParam:{},
        param: {},
        visible: false,
        fullscreen: true,
        confirmLoading: false,
        optType:'',
        files:[],
        form:this.$form.createForm(this),
        accOpenBank:'',
        accOpenBankCode:'',
        modal: {
          visible: false,
          title: '选择开户行',
          fullscreen: false,
          switchFullscreen: false,
          confirmLoading: false,
        },
        // rules: {
        //   globalReq: r
        //   },
        // 验证规则，常规验证 邮箱手机号码验证
        rules: {
          globalReq:{
            rules:[
              {
                required:true,
                validator:(rule,value,callback)=>{
                  if(!value&&value!=0){
                    callback('请输入')
                  }
                  callback();
                }
              }
            ]
          },
          phone: {
            rules:[
              {
              required:false,
              validator:(rule,value,callback)=>{
                let reg = new RegExp(/^[1][3,4,5,7,8][0-9]{9}$/); 
                    if(!value){
                      callback()
                    }else if(!reg.test(value)){
                      callback("请输入11位的号码"); 
                    }
                    callback();
                  }
              }
            ]
          },
          fixedPhone: {
            rules:[
              {
              required:false,
              validator:(rule,value,callback)=>{
                let reg = new RegExp(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/); 
                    if(!value){
                      callback()
                    }else if(!reg.test(value)){
                      callback("请输入正确的电话号码"); 
                    }
                    callback();
                  }
              }
            ]
          },
          email: {
            rules:[
              {
              required:false,
              validator:(rule,value,callback)=>{
                let reg = new RegExp(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/); 
                    if(!value){
                      callback()
                    }else if(!reg.test(value)){
                      callback("请输入正确邮箱号"); 
                    }
                    callback();
                  }
              }
            ]
          }, 
        },
        model: {proxyFeeYn: 'N'},
        product: {},
        labelCol: {xs: { span: 24 },sm: { span: 5 },},
        wrapperCol: {xs: { span: 24 },sm: { span: 16 }},
        url: {
          save: "/prj/asset/saveInsurance",
          upload: "/sys/common/biUpload",
          list:'/prj/asset/insPlanList',
          init:'/prj/asset/init',
          find: "/prj/asset/findInsurance"
        },
        dataSource:[],
        columns:[
          {
            title: '期次',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },{
            title: '保险应缴日',
            align:"center",
            dataIndex: 'tday'
          },{
            title: '币种',
            align:"center",
            dataIndex: 'curCode',
            customRender:function (t) {
              return that.getDictNameByCode(that.dicts.CUR_CODE,t);
            }
          },{
            title: '保费金额',
            align:"center",
            dataIndex: 'feeAmt',
            customRender:function (t) {
              return formatAmt(t,2);
            }
          },{
            title: '计划分类',
            align:"center",
            dataIndex: 'dataGenType',
            customRender:function (t) {
              return t==='SYSTEM'?'系统生成':'用户录入';
            }
          },{
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        loading:false
      }
    },
    computed:{
      ...mapState("project", [
        "cusAccInfoList","relPartyList","orgList","trusteeList"
      ]),
      disabled(){
        return  this.optType=='view';
      }
    },
    created() {
      let that = this;
      this.getDict('y_n,POLICYHOLDER_TYPE,CUR_CODE,IDNTYPES,PROXY_INSFEE_TYPE,PROXY_INSFEE_FRANQC,INSURANCE_TYPE');
      this.getTeeList()
    },
    mounted() {
      //mounted here     "prjCode='+this.$route.query.prjCode+'&relType=BENEFICIARY"
     
      
    },
    methods: {
      moment,
      ...mapMutations("project",["SET_batchId"]),
      ...mapActions("project",["getCusAccInfoList","getRelPartyList","getTrusteeList","getProNameList","getOrgList","addOrdersOptLogs"]),
      add(param){
        this.optType='add';
        this.param = param;
        this.initPage({});
      },
      edit(record){
        this.optType='edit';
        this.initPage(record);
      },
      view(record){
        this.optType='view';
        this.initPage(record);
      },
      async getTeeList(){
        let params={}
        getAction('/baseline/assigneeMould/list', params).then((res) => {
          if (res.success && res.result) {
            this.teeList = res.result;
          }
        })
      },
      initPage(record){
        if(this.optType !== 'add'){
          convertToCamelCase(record);
          this.param = record;
        
        }
        this.getRelPartyList({prjCode:this.param.prjCode,relType:'CLIENT'});
        this.getCusAccInfoList({prjCode:this.param.prjCode,status:"AGREE"});
        this.getOrgList({orgType:'IN'});
        this.getTrusteeList({prjCode:this.param.prjCode,relType:'TRUSTEE'});
        this.form.resetFields();
        this.model = Object.assign({}, record);
       
        this.visible = true;
        let that = this;
        if(that.optType!=='add' && record.id) {
          this.$nextTick(() => {
            that.confirmLoading = true;
            let formData = { id: record.id };
            postAction(that.url.find, formData).then((res) => {
              if (res.success) {
                let f = that.form.getFieldsValue();
                that.model.proxyFeeYn = res.result.insRegulations.proxyFeeYn;
                that.model.insType = res.result.insurance.insType;

               
                
                let initValues = {};
                if(res.result.insCommon.policyholderType){
                  that.model.policyholderType = res.result.insCommon.policyholderType;
                  initValues['insCommon.policyholderTypeOth']=res.result.insCommon.policyholderTypeOth;
                }
                Object.keys(f).forEach(key => {
                  if (typeof(f[key]) === 'object') {
                    console.log('key=',key);
                    Object.keys(f[key]).forEach(key1 => {
                      initValues[key + "." + key1] = res.result[key][key1];
                    });
                  } else if (typeof(f[key]) === 'string') {
                    initValues[key] = res.result[key]?res.result[key]:'';
                  }
                });   
                // let insRegulations = JSON.parse(JSON.stringify(res.result.insRegulations))
                if(that.model.proxyFeeYn=='Y'){
                  initValues['insRegulations'] = {
                    feeAmt:res.result.insRegulations.feeAmt,    //每期保费金额
                    feeType:res.result.insRegulations.feeType,    
                    feePeriod:res.result.insRegulations.feePeriod,    
                    frequency:res.result.insRegulations.frequency,    
                    unpaidPeriod:res.result.insRegulations.unpaidPeriod,                    
                  }       
                }
                
                that.dataSource = res.result.insPlans;
                initValues['addrCascader']=[initValues['insCommon.addrCunCode'],initValues['insCommon.addrProvCode'],initValues['insCommon.addrCityCode']];
                if(res.result.insCommon&&res.result.insCommon.idnStartDt){
                  initValues['insCommon.idnDate'] =[ moment(res.result.insCommon.idnStartDt,'YYYY-MM-DD'),moment(res.result.insCommon.idnEndDt,'YYYY-MM-DD')]
                }
                
                setTimeout(() => {
                    that.form.setFieldsValue(initValues);
                  
                    // that.form.setFieldsValue(insRegulations);
                    console.log(this.form.getFieldsValue())
                }, 300);

              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            });
          });
        }
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.confirmLoading = false;
      },
      selectTranOpenBran () {
        this.modal.visible = true
      },
      // 获得开户行
      getTranOpenBran (selectionRows) {
        this.accOpenBank = selectionRows[0].itemText;
        this.accOpenBankCode =  selectionRows[0].itemValue;
        this.form.setFieldsValue({
          'insurance.accOpenBank':selectionRows[0].itemText,
          'insurance.accOpenBankCode':selectionRows[0].itemValue
        }) 
       
       // this.insurance.accOpenBankCode = selectionRows[0].itemValue;
        //this.form.tranOpenBran = selectionRows[0].bankName
        //this.form.bankCode = selectionRows[0].bankCode
      },
      handleOkBank () {
        if( !this.accOpenBank ){
          this.$message.warning('请选择一个开户行')
          return 
        }
        this.modal.visible = false
      },
      handleOk(){           
        const that = this;


        // 触发表单验证
        this.form.validateFieldsAndScroll((err, values) => {       
          if (!err) {         
            // that.confirmLoading = true;
            let formData = Object.assign(this.model, values);

            
            //时间格式化
            // formData.transferDt = formData.transferDt?formData.transferDt.format('YYYY-MM-DD HH:mm:ss'):null;
            console.log(formData)
           
            formData.cta.prjCode = that.param.prjCode;
            formData.cta.periodNo = that.param.periodNo;
            formData.cta.propertyType = that.param.propertyType;
            formData.cta.assetType = that.param.assetType;
            formData.cta.trustPropertyAmt = values.insurance.insPrice;
            formData.cat.prjCode = that.param.prjCode;
            formData.insCommon.prjCode = that.param.prjCode;
            formData.insCommon.periodNo = that.param.periodNo;

         
            formData.insCommon.idnStartDt = that.queryParam.idnStartDt;
            formData.insCommon.idnEndDt = that.queryParam.idnEndDt;

            formData.insurance.prjCode = that.param.prjCode;
            formData.insurance.periodNo = that.param.periodNo;
            formData.insRegulations.prjCode = that.param.prjCode;
            formData.insPlans = that.dataSource;
            console.log("formData:",formData);
             //return;


            let acceptIdC = values.insurance.acceptId
            let insuranceNoC = values.insurance.insuranceNo
            let insSerialNoC = values.insurance.insSerialNo
            if(!acceptIdC&&!insuranceNoC&&!insSerialNoC){
              this.$message.error('受理号、保险单号、投保书流水号/电子投保标识号请至少填写其中一个')
              return
            }
            

            that.confirmLoading = true;
            postAction(that.url.save, formData).then((res)=>{
              if(res.success){
                that.addOrdersOptLogs({
                  odrCode: res.result.cta.orderCode,
                  batchId: res.result.batchId,
                  optType: '委托资产录入',
                  oprations: '委托资产保存',
                  status: '待提交',
                  memo:formData.insurance.insuranceName
                });
                that.SET_batchId(res.result.batchId);

                const filesNeed2Upload = that.files.filter(file => file.id === undefined);
                if(filesNeed2Upload.length>0){
                  const formData = new FormData();
                  formData.append("module","ASSET_IN");
                  formData.append("dataId", res.result.cta.id);
                  filesNeed2Upload.forEach(file => {
                    formData.append('files', file);
                  });
                  httpActionWF(that.url.upload, formData).then((res)=>{
                    if(res.success){
                      that.$message.success('保存成功！');
                      that.$emit('ok');
                      this.close();
                    }else{
                      that.$message.error(res.message);
                    }
                  }).catch(function(error){
                    that.$message.error('文件上传失败，请稍后重新上传，注意文件大小不可超过10M');
                  }).finally(() => {
                    that.confirmLoading = false;
                  });
                }else{
                  that.$message.success('保存成功！');
                  that.$emit('ok');
                  this.close();
                }
              }else{
                that.$message.warning(res.message);
                that.confirmLoading = false;
              }
            });
          }
        })
      },
      handleCancel(){
        this.close();
      },
      beforeUpload(file) {
        this.files = [...this.files, file];
        return false;
      },
      handleFileRemove(file) {
        if(this.optType !== 'view'){
          const index = this.files.indexOf(file);
          const newFileList = this.files.slice();
          newFileList.splice(index, 1);
          this.files = newFileList;
        }else{
          return false;
        }
      },
      // onInsPartySearch(){

      // },
    // 电话号码的验证
    // changePhone(rule,value,callback){

   
     changeFlowDate (val) {
        this.$set(this.queryParam,'idnStartDt',val[0]|| '')
        this.$set(this.queryParam,'idnEndDt',val[1]|| '')

         //this.form.setFieldsValue({'insCommon.idnEndDt':val[0]});
      },
      onAddrCascaderChange(val){
        this.form.setFieldsValue({'insCommon.addrCunCode':val[0]});
        this.form.setFieldsValue({'insCommon.addrProvCode':val[1]});
        this.form.setFieldsValue({'insCommon.addrCityCode':val[2]});
      },
      handleShowPlan(){
        const that = this;
        // 触发表单验证
        this.form.validateFieldsAndScroll(['insRegulations.feeAmt','insRegulations.feeType','insRegulations.feePeriod',
          'insRegulations.frequency','insRegulations.unpaidPeriod','insRegulations.startDt','insRegulations.endDt',
          'insurance.curCode',],(err, values) => {
          if (!err) {
            that.loading = true;
            let formData = Object.assign(this.model, values);
            postAction('/prj/asset/insPlanList', formData).then((res)=>{
              console.log('res:',res);
              res.result.forEach((item)=>{
                item.id = 'P'+Math.random()*100000000;
              });
              that.dataSource = res.result;
            }).finally(()=>{
              that.loading = false;
            });
          }
        })
      },
      handleFrequencyChange(){
        this.$nextTick(()=>{
          let v = this.form.getFieldsValue(['insRegulations.frequency','insRegulations.unpaidPeriod','insRegulations.startDt']);
          console.log('v:',v);
          if(v.insRegulations.frequency && v.insRegulations.unpaidPeriod && v.insRegulations.startDt){
            let dateArr = v.insRegulations.startDt.split("-");
            let year = dateArr[0];//年
            let month = dateArr[1];//月
            let day = dateArr[2];//日
            if(v.insRegulations.frequency === '0'){
              //一次性
              this.form.setFieldsValue({'insRegulations.unpaidPeriod': 1,'insRegulations.endDt':v.insRegulations.startDt, 'hideEndDt':v.insRegulations.startDt});
            }else{
              let model_end_dt = null;
              if(v.insRegulations.frequency === '1'){//按月
                let freq = 12;
                model_end_dt = this.commonDays(year,month,day,freq,v.insRegulations.unpaidPeriod);
              }else if(v.insRegulations.frequency === '2'){//按季度
                let freq = 4;
                model_end_dt = this.commonDays(year,month,day,freq,v.insRegulations.unpaidPeriod);
              }else if(v.insRegulations.frequency === '3'){//按半年
                let freq = 2;
                model_end_dt = this.commonDays(year,month,day,freq,v.insRegulations.unpaidPeriod);
              }else if(v.insRegulations.frequency === '4'){//按年
                let newYear = this.accAdd(year,v.insRegulations.unpaidPeriod);
                model_end_dt = newYear+1+"-"+month+"-"+day;
              }
              let param = {
                'insRegulations.startDt': v.insRegulations.startDt,
                'insRegulations.endDt':model_end_dt,
                'insRegulations.frequency':v.insRegulations.frequency,
                'insRegulations.unpaidPeriod':v.insRegulations.unpaidPeriod
              }
              getAction('/prj/asset/findPlanEndDt', param).then((res)=>{
                let arrayDate = res.message.split("+");
                this.form.setFieldsValue({'insRegulations.endDt':arrayDate[0], 'hideEndDt':arrayDate[1]});
              });
            }
          }
        });
      },
      handleTableChange(){

      },
      handlePlanAdd(){
        this.$refs.m3PlanModal.add();
        this.$refs.m3PlanModal.title = "新增保单缴费计划";
      },
      handlePlanEdit(record){
        this.$refs.m3PlanModal.edit(record);
        this.$refs.m3PlanModal.title = "修改保单缴费计划";
      },
      handlePlanDelete(id){
        this.dataSource.forEach((item,index)=>{
          if(item.id === id){
            this.dataSource.splice(index,1);
          }
        });
      },
      commonDays(year,month,day,freq,unpaid_period){
        let math_year = Math.ceil(unpaid_period/freq);
        let newYear = this.accAdd(year,math_year);
        return newYear + 1 + "-" + month + "-" + day;
      },
      accAdd(arg1, arg2) {
        let r1, r2, m, c;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        c = Math.abs(r1 - r2);
        m = Math.pow(10, Math.max(r1, r2))
        if (c > 0) {
          let cm = Math.pow(10, c);
          if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
          }
          else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
          }
        }
        else {
          arg1 = Number(arg1.toString().replace(".", ""));
          arg2 = Number(arg2.toString().replace(".", ""));
        }
        return (arg1 + arg2) / m
      },
      m3PlanModalOk(vals){
        console.log('vals:',vals);
        if(vals.id || vals.key){
          this.dataSource.forEach(item=>{
            if(item.id === vals.id){
              item.tday=vals.tday;
              item.curCode=vals.curCode;
              item.feeAmt=vals.feeAmt;
              item.dataGenType='MANUAL';
            }
          });
        }else{
          this.dataSource.push(vals);
        }
      }
    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less'
</style>