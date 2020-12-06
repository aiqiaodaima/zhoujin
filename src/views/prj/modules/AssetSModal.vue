<template>
  <j-modal
    title="现金"
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
          <a-button v-if="optType !== 'view'" type="primary" @click="handleOk">提交</a-button>
          <a-button @click="handleCancel">关闭</a-button>
        </a-col>
      </a-row>
    </template>
    <a-spin :spinning="confirmLoading" style="margin: 5px;">
      <a-form :form="form" ref="form" formLayout="horizontal">
        <a-card size="small" title="委托现金信息" :bordered="true">
          <a-form-item style="display: none;">
            <a-input v-decorator="['cta.id', {}]"/>
          </a-form-item>
          <a-form-item style="display: none;">
            <a-input v-decorator="['cat.id', {}]"/>
          </a-form-item>
          <BiFormItemSelect  :disabled="disabled" label="子账户" :decorator="['cat.accNo', rules.globalReq]" :options="cusAccInfoList" custom-key="accNo" custom-val="accName"/>
          <BiFormItemSelect :disabled="disabled" label="委托人" :decorator="['cta.partyCode', rules.globalReq]" :options="relPartyList" custom-key="PARTY_CODE" custom-val="PARTY_NAME"/>          
          <BiFormItemSelect :disabled="disabled" label="币种" :decorator="['cta.curCode', rules.globalReq]" :options="dicts.CUR_CODE" showSearch/>          
          <BiFormItemNumPercent :disabled="disabled" label="金额" :decorator="['cta.trustPropertyAmt', rules.globalReq]"/>
          <BiFormItemSelect label="是否计信托份额" :decorator="['cta.unitYn', rules.globalReq]" :options="dicts.y_n" disabled/> 
          <BiFormItemSelect label="是否收费" :decorator="['cta.feesYn', rules.globalReq]" :options="dicts.y_n" disabled  />
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
  import { convertToCamelCase } from '../../../utils/util'

  export default {
    name: 'AssetSModal',
    mixins:[dictMixin],
    components: {
      BiFormItemNumPercent,
      BiFormItemSelect,
      JDSelectTag
    },
    data() {
      let r = {rules: [{ required: true, message: '必输字段!' }]};
      return {
        param: {},
        visible: false,
        fullscreen: false,
        confirmLoading: false,
        optType:'',
        form:this.$form.createForm(this),
        rules: {
          globalReq:r
        },
        dictOptionsData:[],
        model: {},
        labelCol: {xs: { span: 24 },sm: { span: 5 },},
        wrapperCol: {xs: { span: 24 },sm: { span: 16 }},
        url: {
          save: "/prj/asset/saveFund",
          find: "/prj/asset/findFund"
        }
      }
    },
    computed:{
      ...mapState("project", [
        "cusAccInfoList","relPartyList"
      ]),
       disabled(){
        return  this.optType=='view';
      }
    },
    created() {
      let that = this;
      that.confirmLoading = true;
      initDictOptionsBatch("y_n").then((res) => {
        if (res.success) {
          that.dictOptionsData = res.result;
        }
        that.confirmLoading = false;
      });
      this.getDict('CUR_CODE,y_n');
    },
    mounted() {
      //mounted here     "prjCode='+this.$route.query.prjCode+'&relType=BENEFICIARY"
    },
    methods: {
      moment,
      ...mapMutations("project",["SET_batchId"]),
      ...mapActions("project",["getCusAccInfoList","getRelPartyList","addOrdersOptLogs"]),
      add(param){
        this.param = param;
        this.optType='add';
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
      initPage(record){
        if(this.optType !== 'add'){
          convertToCamelCase(record);
          this.param = record;
        }
        this.getRelPartyList({prjCode:this.param.prjCode,relType:'CLIENT'});
        this.getCusAccInfoList({prjCode:this.param.prjCode,status:"AGREE"});
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        let that = this;
        if(that.optType=='add'){
          this.$nextTick(() => {
            this.form.setFieldsValue({
              'cta.feesYn' :'Y',
              'cta.unitYn':'Y'
            })
          });
        }
        if(that.optType!=='add' && record.id){
          this.$nextTick(() => {
            that.confirmLoading = true;
            let formData = { id:record.id };
            postAction(that.url.find, formData).then((res)=>{
              if(res.success){
                that.form.setFieldsValue({
                  'cta.id' : res.result.cta.id,
                  'cat.id' : res.result.cat.id,
                  'cat.accNo' : res.result.cat.accNo,
                  'cta.partyCode' : res.result.cta.partyCode,
                  'cta.curCode' : res.result.cta.curCode,
                  'cta.trustPropertyAmt' : res.result.cta.trustPropertyAmt,
                  'cta.unitYn' : res.result.cta.unitYn,
                  'cta.feesYn' : res.result.cta.feesYn,
                });
              }else{
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
      },
      handleOk(){
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            //时间格式化
            // formData.transferDt = formData.transferDt?formData.transferDt.format('YYYY-MM-DD HH:mm:ss'):null;
            console.log(formData)
            formData.cta.prjCode = that.param.prjCode;
            formData.cta.periodNo = that.param.periodNo;
            formData.cta.propertyType = that.param.propertyType;
            formData.cta.assetType = that.param.assetType;
            formData.cat.prjCode = that.param.prjCode;
            //操作日志生成 埋点
            postAction(that.url.save, formData).then((res)=>{
              if(res.success){
                that.addOrdersOptLogs({
                  odrCode: res.result.cta.orderCode,
                  batchId: res.result.batchId,
                  optType: '委托资产录入',
                  oprations: '委托资产保存',
                  status: '待提交',
                  memo:'现金'
                });
                that.SET_batchId(res.result.batchId);
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
        })
      },
      handleCancel(){
        this.close();
      }
    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less'
</style>