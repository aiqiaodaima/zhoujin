<template>
  <j-modal
    title="股票"
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
        <a-card size="small" title="股票信息" :bordered="true">
          <a-row :gutter="24">
            <BiCol><BiFormItemSelect  :disabled="disabled"  label="子账户" :decorator="['cat.accNo', rules.globalReq]" :options="cusAccInfoList" custom-key="accNo" custom-val="accName"/></BiCol>
            <BiCol><BiFormItemSelect :disabled="disabled" label="委托人" :decorator="['cta.partyCode', rules.globalReq]" :options="relPartyList" custom-key="PARTY_CODE" custom-val="PARTY_NAME"/></BiCol>
          </a-row>
          <a-row :gutter="24">
            <BiCol><BiFormItemInput :disabled="disabled" label="股票代码" :decorator="['cusAssetStock.stockCode', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemInput :disabled="disabled" label="股票名称" :decorator="['cusAssetStock.stockName', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemSelect :disabled="disabled" label="股票类型" :options="dicts.STOCK_TYPE" :decorator="['cusAssetStock.stockType', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemSelect :disabled="disabled" label="币种" :options="dicts.CUR_CODE" :decorator="['cusAssetStock.curCode', rules.globalReq]" :showSearch="true"/></BiCol>
            <BiCol><BiFormItemNumPercent :disabled="disabled" label="转让日股价" :decorator="['cusAssetStock.trusetStoPri', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemNumPercent :disabled="disabled" label="转让股数" :decorator="['cusAssetStock.trustShares', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemNumPercent :disabled="disabled" label="价值金额" :decorator="['cusAssetStock.insPrice', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemSelect :disabled="disabled" label="财产管理机构" :decorator="['cusAssetStock.amOrgCode', {}]" :options="orgList" custom-key="orgCode" custom-val="orgName" :showSearch="true"/></BiCol>
            <BiCol><BiFormItemSelect :disabled="disabled" label="是否计信托份额" :options="dicts.y_n" :decorator="['cta.unitYn', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemSelect :disabled="disabled" label="是否收费" :options="dicts.y_n" :decorator="['cta.feesYn', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemTextarea :disabled="disabled" label="备注" :decorator="['cusAssetStock.memo', {}]"/></BiCol>
          </a-row>
        </a-card>
        <a-card size="small" title="附件" style="margin-top: 15px">
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item label="文件上传">
                <a-upload :fileList="files" :multiple="true" :remove="handleRemove" :beforeUpload="beforeUpload">
                  <a-button v-if="optType !== 'view'"> <a-icon type="upload"></a-icon> 选择 </a-button>
                </a-upload>
              </a-form-item>
            </a-col>
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
  import JDateRange from '../../../components/jeecg/JDateRange'
  import BiArea from '../../../components/BI/BiArea'
  import BiFormItemTextarea from '../../../components/BI/BiFormItemTextarea'
  import { httpActionWF } from '../../../api/manage'
  import { convertToCamelCase } from '../../../utils/util'

  export default {
    name: 'AssetM1Modal',
    mixins:[dictMixin],
    components: {
      BiFormItemTextarea,
      BiArea,
      JDateRange,
      BiFormItemInput,
      JDate,
      BiRow,
      BiCol,
      BiFormItemNumPercent,
      BiFormItemSelect,
      JDSelectTag
    },
    data() {
      let r = {rules: [{ required: true, message: '必输字段!' }]};
      return {
        param: {},
        visible: false,
        fullscreen: true,
        confirmLoading: false,
        optType:'',
        files:[],
        showSearch:false,
        form:this.$form.createForm(this),
        rules: {
          globalReq:r
        },
        model: {},
        product: {},
        labelCol: {xs: { span: 24 },sm: { span: 5 },},
        wrapperCol: {xs: { span: 24 },sm: { span: 16 }},
        url: {
          save: "/prj/asset/saveStock",
          upload: "/sys/common/biUpload",
          find: "/prj/asset/findStock"
        }
      }
    },
    computed:{
      ...mapState("project", [
        "cusAccInfoList","relPartyList","proNameList","orgList"
      ]),
      disabled(){
        return  this.optType=='view';
      }
    },
    created() {
      let that = this;
      this.getDict('y_n,STOCK_TYPE,CUR_CODE');
    },
    mounted() {
      //mounted here     "prjCode='+this.$route.query.prjCode+'&relType=BENEFICIARY"
    },
    methods: {
      moment,
      ...mapMutations("project",["SET_batchId"]),
      ...mapActions("project",["getCusAccInfoList","getRelPartyList","getOrgList","addOrdersOptLogs"]),
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
      initPage(record){
        if(this.optType !== 'add'){
          convertToCamelCase(record);
          this.param = record;
        }
        this.getRelPartyList({prjCode:this.param.prjCode,relType:'CLIENT'});
        this.getCusAccInfoList({prjCode:this.param.prjCode,status:"AGREE"});
        this.getOrgList({orgType:'AS'});
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
                Object.keys(f).forEach(key=>{
                  if(typeof(f[key]) === 'object'){
                    Object.keys(f[key]).forEach(key1=>{
                      initValues[key+"."+key1] = res.result[key][key1];
                    });
                  }else if(typeof(f[key]) === 'string'){
                    initValues[key] = res.result[key];
                  }
                });
                that.form.setFieldsValue(initValues);
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
         // 页面关闭时关闭
        this.confirmLoading = false;
      },
      handleOk(){
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          console.log('values:',values);
          if (!err) {
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            //时间格式化
            // formData.transferDt = formData.transferDt?formData.transferDt.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.cta.prjCode = that.param.prjCode;
            formData.cta.periodNo = that.param.periodNo;
            formData.cta.propertyType = that.param.propertyType;
            formData.cta.assetType = that.param.assetType;
            formData.cat.prjCode = that.param.prjCode;
            formData.cusAssetStock.prjCode = that.param.prjCode;
            formData.cusAssetStock.periodNo = that.param.periodNo;
            formData.cta.trustPropertyAmt = formData.cusAssetStock.insPrice;
            postAction(that.url.save, formData).then((res)=>{
              if(res.success){
                that.addOrdersOptLogs({
                  odrCode: res.result.cta.orderCode,
                  batchId: res.result.batchId,
                  optType: '委托资产录入',
                  oprations: '委托资产保存',
                  status: '待提交',
                  memo:formData.cusAssetStock.stockName
                });
                that.SET_batchId(res.result.batchId);

                const filesNeed2Upload = that.files.filter(file => file.id == undefined);
                if(filesNeed2Upload.length>0){
                  const formData = new FormData();
                  formData.append("module","ASSET_STOCK");
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
      idnRangeChanged(rangeVal){
        this.form.setFieldsValue({'trxTransferContacter.idnStdDt':rangeVal[0]});
        this.form.setFieldsValue({'trxTransferContacter.idnEndDt':rangeVal[1]});
      },
      beforeUpload(file) {
        this.files = [...this.files, file];
        return false;
      },
      handleRemove(file) {
        if(this.optType !== 'view'){
          const index = this.files.indexOf(file);
          const newFileList = this.files.slice();
          newFileList.splice(index, 1);
          this.files = newFileList;
        }else{
          return false;
        }
      }
    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less'
</style>