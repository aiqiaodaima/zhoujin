<template>
  <j-modal
    title="投资类资产"
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
        <a-card size="small" title="委托资产信息" :bordered="true">
          <a-row :gutter="24">
            <BiCol>
              <BiFormItemSelect :disabled="disabled" label="子账户" :decorator="['cat.accNo', rules.globalReq]" :options="cusAccInfoList" custom-key="accNo" custom-val="accName"></BiFormItemSelect>
            </BiCol>
            <BiCol>
              <BiFormItemSelect :disabled="disabled" label="委托人" :decorator="['cta.partyCode', rules.globalReq]" :options="relPartyList" custom-key="PARTY_CODE" custom-val="PARTY_NAME"></BiFormItemSelect>
            </BiCol>
            <BiCol>
              <BiFormItemSelect :disabled="disabled" label="委托资产" :decorator="['cta.proCode', rules.globalReq]" :options="proNameList" @change="prodChanged" custom-key="proCode" custom-val="proName"></BiFormItemSelect>
              <a-form-item style="display: none;"><a-input :disabled="disabled" v-decorator="['cta.proName', {}]"></a-input></a-form-item>
              <a-form-item style="display: none;"><a-input :disabled="disabled" v-decorator="['cta.bankProCode', {}]"></a-input></a-form-item>
            </BiCol>
            <BiCol><a-form-item label="资产币种">{{ product.curName }}</a-form-item></BiCol>
            <BiCol>
              <a-form-item label="收益率类型">{{product.incomeTypeName}}{{product.incomeRateTypeName?'-'+product.incomeRateTypeName:product.incomeRateTypeName}}</a-form-item>
            </BiCol>
            <BiCol><a-form-item label="预期收益率">{{ product.expReturnRate?product.expReturnRate+'%':'--' }}</a-form-item></BiCol>
            <BiCol><BiFormItemNumPercent :disabled="disabled" label="转让协议金额" :decorator="['cta.invAmtFc', rules.globalReq]" @change="invAmtFcChange"></BiFormItemNumPercent></BiCol>
            <BiCol><BiFormItemNumPercent :disabled="disabled" label="转让协议份额" :decorator="['cta.tranUnit', rules.globalReq]"></BiFormItemNumPercent></BiCol>
          </a-row>
          <a-row>
            <BiCol>
              <a-form-item label="转让日">
                <j-date :disabled="disabled" v-decorator="['cta.transferDt', rules.globalReq]" style="width: 100%" @change="transferDtChange"></j-date>
              </a-form-item>
            </BiCol>
            <BiCol>
              <a-form-item label="转让起息日">
                <j-date :disabled="disabled" v-decorator="['cta.transferValueDt', {}]" style="width: 100%"></j-date>
              </a-form-item>
            </BiCol>
            <BiCol>
              <a-form-item label="投资到期日">
                <j-date :disabled="disabled" v-decorator="['cta.expireDt', {}]" style="width: 100%"></j-date>
              </a-form-item>
            </BiCol>
            <BiCol>
              <BiFormItemSelect  :disabled="disabled"label="转让日前的受益归属" :decorator="['cta.preprofitYn', rules.globalReq]" :options="dicts.PREPROFIT_YN" @change="preprofitYnChange"></BiFormItemSelect>
            </BiCol>
            <BiCol>
              <a-form-item label="前次收益分配日">
                <j-date :disabled="disabled" v-decorator="['cta.preTranDt',pre==='N'? rules.globalReq:{}]" style="width: 100%" @change="preTranDtChange"></j-date>
              </a-form-item>
            </BiCol>
            <BiCol>
              <BiFormItemNumPercent :disabled="disabled" label="应付转让方收益" :decorator="['cta.tranIncomeAmt', pre=='N'? rules.globalReq:{} ]" >{{initialValue}}</BiFormItemNumPercent>
            </BiCol>
            <BiCol>
              <BiFormItemSelect :disabled="disabled" label="是否计信托份额" :options="dicts.y_n" :decorator="['cta.unitYn', rules.globalReq]" disabled></BiFormItemSelect>
            </BiCol>
            <BiCol>
              <BiFormItemSelect :disabled="disabled" label="是否收费" :options="dicts.y_n" :decorator="['cta.feesYn', rules.globalReq]" disabled></BiFormItemSelect>
            </BiCol>
            <BiCol>
              <a-form-item label="委托财产类型">
                <j-multi-select-tag :disabled="disabled" label="委托财产类型" :options="dicts.CITIC_ASSETS_TYPE" v-decorator="['cta.citicAssetsType', rules.globalReq]"></j-multi-select-tag>
              </a-form-item>
              <!-- <BiFormItemSelect label="委托财产类型" mode="multiple" :options="dicts.CITIC_ASSETS_TYPE" :decorator="['cta.citicAssetsType', rules.globalReq]"></BiFormItemSelect> -->
            </BiCol>
            <BiCol>
              <a-form-item label="填表日期">
                <j-date :disabled="disabled" v-decorator="['cta.signDate', rules.dataReq]" style="width: 100%"></j-date>
              </a-form-item>
            </BiCol>
            <BiCol>
              <BiFormItemInput :disabled="disabled" label="办理地址" :decorator="param.periodNo!==0 && param.propertyType==='P'?['cta.signAddress']:['cta.signAddress', rules.globalReq]"></BiFormItemInput>
            </BiCol>
          </a-row>
        </a-card>
        <br/>
        <a-card size="small" title="经办人" :bordered="true">
          <a-row :gutter="24">
            <BiCol>
              <BiFormItemInput :disabled="disabled" label="姓名/名称" :decorator="['trxTransferContacter.contName', {}]"></BiFormItemInput>
            </BiCol>
            <BiCol>
              <BiFormItemSelect :disabled="disabled" label="证件类型" :options="dicts.IDNTYPES" :decorator="['trxTransferContacter.idnType', {}]"></BiFormItemSelect>
            </BiCol>
            <BiCol>
              <BiFormItemInput :disabled="disabled" label="证件号码" :decorator="['trxTransferContacter.idn', {}]"></BiFormItemInput>
            </BiCol>
            <BiCol>
              <a-form-item label="有效期">
                <j-date-range :disabled="disabled" @change="idnRangeChanged" style="width: 100%" v-model="idnRangeVal" @calendarChange="calendarChange" :currentDate="currentDate"></j-date-range>
              </a-form-item>
              <a-form-item style="display: none;">
                <a-input :disabled="disabled" v-decorator="['trxTransferContacter.idnStdDt', {}]"></a-input>
              </a-form-item>
              <a-form-item style="display: none;">
                <a-input :disabled="disabled" v-decorator="['trxTransferContacter.idnEndDt', {}]"></a-input>
              </a-form-item>
            </BiCol>
            <BiCol>
              <BiFormItemInput :disabled="disabled" label="手机号码" :decorator="['trxTransferContacter.ctelNo', rules.phone]"></BiFormItemInput>
            </BiCol>
            <BiCol>
              <BiFormItemInput :disabled="disabled" label="固定电话" :decorator="['trxTransferContacter.ftelNo', rules.fixedPhone]"></BiFormItemInput>
            </BiCol>
            <BiCol>
              <BiFormItemInput :disabled="disabled" label="电子邮箱" :decorator="['trxTransferContacter.email', rules.email]"></BiFormItemInput>
            </BiCol>
          </a-row>
        </a-card>
      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>
  import moment from 'moment'
  import JDSelectTag from '@/components/dict/JDSelectTag'
  import { initDictOptionsBatch } from '@/components/dict/JDictSelectUtil'
  import { postAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import BiFormItemSelect from '@/components/BI/BiFormItemSelect'
  import { mapActions, mapState, mapMutations } from 'vuex'
  import dictMixin from '@/mixins/dictMixin'
  import BiFormItemNumPercent from '@/components/BI/BiFormItemNumPercent'
  import BiCol from '../../../components/BI/BiCol'
  import { filterDictText } from '../../../components/dict/JDictSelectUtil'
  import BiRow from '@/components/BI/BiRow'
  import JDate from '@/components/jeecg/JDate'
  import BiFormItemInput from '../../../components/BI/BiFormItemInput'
  import JMultiSelectTag from '../../../components/dict/JMultiSelectTag'
  import JDateRange from '../../../components/jeecg/JDateRange'
  import BiArea from '../../../components/BI/BiArea'
  import { convertToCamelCase } from '../../../utils/util'
  import { getProducts } from '@/api/BiApi'
  export default {
    name: 'AssetPModal',
    mixins:[dictMixin],
    components: {
      BiArea,
      JDateRange,
      BiFormItemInput,
      JDate,
      BiRow,
      BiCol,
      BiFormItemNumPercent,
      BiFormItemSelect,
      JDSelectTag,
      JMultiSelectTag
    },
    data() {
      let r = {rules: [{ required: true, message: '必输字段!' }]};
      return {
        param: {},
        visible: false,
        fullscreen: true,
        confirmLoading: false,
        optType:'',
        pre:'',
        model: {},
        initialValue:'',
        form:this.$form.createForm(this),
        rules: {
          dataReq:{},
          // globalReq:r,
          globalReq:{
            rules:[
              {
                required:true,
                validator:(rule,value,callback)=>{
                  if(!value){
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
        currentDate: {},
        proNameList:[],
        product: {},
        labelCol: {xs: { span: 24 },sm: { span: 5 },},
        wrapperCol: {xs: { span: 24 },sm: { span: 16 }},
        idnRangeVal:[],
        url: {
          save: "/prj/asset/saveInvestment",
          find: "/prj/asset/findInvestment"
        }
      }
    },
    computed:{
      ...mapState("project", [
        "cusAccInfoList","relPartyList"
//  "proNameList"---加上后报警告 计算属性 XXX已经再data中定义了
      ]),
       disabled(){
        return  this.optType=='view';
      }
    },
    watch:{},
    created() {
      this.getProducts();
      this.getDict('y_n,CUR_CODE,INCOME_TYPE,INCOME_RATE_TYPE,INCOME_RATE_TYPE_CUR,PREPROFIT_YN,CITIC_ASSETS_TYPE,IDNTYPES');
    },
    mounted() {
      //mounted here     "prjCode='+this.$route.query.prjCode+'&relType=BENEFICIARY"
    },
    methods: {
      moment,
      ...mapMutations("project",["SET_batchId"]),
      ...mapActions("project",["getCusAccInfoList","getRelPartyList","getProNameList","addOrdersOptLogs"]),
      add(param){
        this.optType='add';
        this.param = param;
        this.initPage({});
        if (param.periodNo!=0 && param.propertyType=='P') {
          //宋仪泉：追加财产为投资类资产时，【填表日期】、【办理地址】字段，需调整为非强制
          let r = {rules: [{ required: false, message: '必输字段!' }]};
          this.rules.dataReq=r;
        }else {
          let r = {rules: [{ required: true, message: '必输字段!' }]};
          this.rules.dataReq=r;
        }
      },
      edit(record){
        this.optType='edit';
        let r = {rules: [{ required: false, message: '必输字段!' }]};
        this.rules.dataReq=r;
        this.initPage(record);
      },
      view(record){
        this.optType='view';
        this.initPage(record);
      },
      initPage(record){
        this.product = {}
        if(this.optType !== 'add'){
          convertToCamelCase(record);
          this.param = record;
        }
        if(this.optType=='add'){
          this.$nextTick(() => {
            this.form.setFieldsValue({
              'cta.feesYn' :'Y',
              'cta.unitYn':'Y',
            })
          });
          this.idnRangeVal =[]
        }
        this.getRelPartyList({prjCode:this.param.prjCode,relType:'CLIENT'});
        this.getCusAccInfoList({prjCode:this.param.prjCode,status:"AGREE"});
        this.getProducts();
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        let that = this;
        if(that.optType!=='add' && record.id){
          this.$nextTick(() => {
            that.confirmLoading = true;
            let formData = { id:record.id };
            postAction(that.url.find, formData).then((res)=>{
              if(res.success){
                let f = that.form.getFieldsValue();
                let initValues = {};
                console.log("f=",f);
                Object.keys(f).forEach(key=>{
                  if(typeof(f[key] === 'object')){
                    Object.keys(f[key]).forEach(key1=>{
                      initValues[key+"."+key1] = res.result[key][key1];
                    });
                  }else if(typeof(f[key] === 'string')){
                    initValues[key] = res.result[key];
                  }
                });
                console.log("initValues=",initValues);
                that.form.setFieldsValue(initValues);
                if(initValues['trxTransferContacter.idnStdDt']&&initValues['trxTransferContacter.idnEndDt']){
                  that.idnRangeVal = [initValues['trxTransferContacter.idnStdDt'],initValues['trxTransferContacter.idnEndDt']];
                }else{
                  that.idnRangeVal =[]
                }
                that.prodChanged(initValues['cta.proCode']);
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            });
          });
        }
      },
      async getProducts() {
        const res = await getProducts({ pageSize:9999});
        if (res.success) {
          this.proNameList = res.result.records;
        }
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk(){
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            console.log('that.param=',that.param);
            formData.cta.prjCode = that.param.prjCode;
            formData.cta.periodNo = that.param.periodNo;
            formData.cta.propertyType = that.param.propertyType;
            formData.cta.assetType = that.param.assetType;
            formData.cat.prjCode = that.param.prjCode;
            formData.trxTransferContacter.prjCode = that.param.prjCode;
            postAction(that.url.save, formData).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
                that.addOrdersOptLogs({
                  odrCode: res.result.cta.orderCode,
                  batchId: res.result.batchId,
                  optType: '委托资产录入',
                  oprations: '委托资产保存',
                  status: '待提交',
                  memo:that.product.proName
                });
                that.SET_batchId(res.result.batchId);
                that.close();
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            });
          }
        })
      },
      prodChanged(proCode){
        this.product = this.proNameList.filter(item => item.proCode === proCode)[0];
        this.product.curName = this.getDictNameByCode(this.dicts.CUR_CODE, this.product.curCode) || '--';//货币类型
        this.product.incomeTypeName = this.getDictNameByCode(this.dicts.INCOME_TYPE, this.product.incomeType) || '--';
        //  净值型3  货币型4 非净值型0
        if(this.product.incomeType==0){
          this.product.incomeRateTypeName = this.getDictNameByCode(this.dicts.INCOME_RATE_TYPE,this.product.incomeRateType) || '--'
        } else if(this.product.incomeType==4){
          this.product.incomeRateTypeName = this.getDictNameByCode(this.dicts.INCOME_RATE_TYPE_CUR,this.product.incomeRateType) || '--'
        }
        this.form.setFieldsValue({'cta.proName': this.product.proName});
        this.form.setFieldsValue({'cta.bankProCode': this.product.bankProCode});
      },
      handleCancel(){
        this.product = {}
        this.close();
      },
      idnRangeChanged(rangeVal){
        this.form.setFieldsValue({'trxTransferContacter.idnStdDt':rangeVal[0]});
        this.form.setFieldsValue({'trxTransferContacter.idnEndDt':rangeVal[1]});
      },
      calendarChange(val) {
        this.currentDate = val
      },
      // 转让协议金额
      invAmtFcChange(){
        this.form.resetFields('cta.preTranDt')
      },
      // 转让日
      transferDtChange() {
        this.form.resetFields('cta.preTranDt')
      },
      // 转让日前的收益归属
      preprofitYnChange(val){
       this.pre = val;
      },
      // 前次收益分配日
      preTranDtChange(val){
        // 1.再前次收益分配日写change事件
        // 2.获取前面输入的值，可以用getFiledsValue 获取一组值，这里得做判断 如果用户没有输完整 就提示用户 先输入前面的内容。
        // 3.用户输入完整 进行计算 将计算结果给 应付转让方收益
        // 获取输入的值
        let tranIncomC = this.form.getFieldsValue();
        let transferDtC = tranIncomC.cta.transferDt//转让日
        console.log("transferDtC:"+typeof(transferDtC));
       //val 前次收益分配日
        let invAmtFcC = tranIncomC.cta.invAmtFc// 转让协议金额
        let expReturnRateC =this.product.expReturnRate/100 // 预期收益率
        // let tranIncomeAmtC = this.tranIncomC.cta.tranIncomeAmt// 应付转让方收益
        // 1.判断前面输入内容是否完整
        if(!transferDtC||!invAmtFcC){
          this.$message.error('请先填写前面内容')
          // 判断日期 比较日期
        }else {
          // 转换数据类型
          let dayStart = parseInt(transferDtC.replace(/-/gi, '')); // 转让日
          let dayEnd =parseInt(val.replace(/-/gi, ''))// 前次收益分配日
            if((dayStart) < (dayEnd)){
              this.$message.error('转让日不得小于前次收益分配日')
            }else if((dayStart) === (dayEnd)) {
              this.$message.error('转让日不得等于前次收益分配日')
            }
          // 计算:（转让日-前次收益分配日）*转让协议金额*预期收益率/365
          if(!expReturnRateC){
            this.initialValue = (dayStart-dayEnd)*invAmtFcC/365
            this.form.setFieldsValue({'cta.tranIncomeAmt':  this.initialValue});
          }else{
            this.initialValue =(dayStart-dayEnd)*invAmtFcC*expReturnRateC/365
            this.form.setFieldsValue({'cta.tranIncomeAmt':  this.initialValue});
          }
        }

      },


    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less'
</style>