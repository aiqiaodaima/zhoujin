<template>
  <j-modal
    title="奢侈品"
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
        <a-form-item style="display: none;">
          <a-input v-decorator="['cta.id', {}]"/>
        </a-form-item>
        <a-form-item style="display: none;">
          <a-input v-decorator="['cat.id', {}]"/>
        </a-form-item>
        <a-card size="small" title="奢侈品信息" :bordered="true">
          <a-row :gutter="24">
            <BiCol><BiFormItemSelect :disabled="disabled" label="子账户" :decorator="['cat.accNo', rules.globalReq]" :options="cusAccInfoList" custom-key="accNo" custom-val="accName"/></BiCol>
            <BiCol><BiFormItemSelect :disabled="disabled" label="委托人" :decorator="['cta.partyCode', rules.globalReq]" :options="relPartyList" custom-key="PARTY_CODE" custom-val="PARTY_NAME"/></BiCol>
            <BiCol><BiFormItemInput :disabled="disabled" label="代码/证书编号" :decorator="['cusAssetOth.certCode', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemInput :disabled="disabled" label="名称" :decorator="['cusAssetOth.propName', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemInput :disabled="disabled" label="类型" :decorator="['cusAssetOth.propType', {}]"/></BiCol>
            <BiCol><BiFormItemSelect :disabled="disabled" label="币种" :options="dicts.CUR_CODE" :decorator="['cusAssetOth.curCode', {...rules.globalReq, initialValue:'156'}]"/></BiCol>
            <BiCol><BiFormItemNumPercent :disabled="disabled" label="价值金额" :decorator="['cusAssetOth.propPrice', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemSelect :disabled="disabled" label="财产管理机构" :decorator="['cusAssetOth.amOrgCode', {}]" :options="orgList" custom-key="orgCode" custom-val="orgName"/></BiCol>
            <BiCol><BiFormItemSelect :disabled="disabled" label="是否计信托份额" :decorator="['cta.unitYn', rules.globalReq]" :options="dicts.y_n"/></BiCol>
            <BiCol><BiFormItemSelect :disabled="disabled" label="是否收费" :decorator="['cta.feesYn', rules.globalReq]" :options="dicts.y_n"/></BiCol>
            <BiCol><BiFormItemTextarea :disabled="disabled" label="备注" :decorator="['cusAssetOth.memo', {}]"/></BiCol>
          </a-row>
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
  </j-modal>
</template>

<script>
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
  import BiFormItemTextarea from '../../../components/BI/BiFormItemTextarea'
  import { convertToCamelCase, genInitVal } from '../../../utils/util'

  export default {
    name: 'AssetM4Modal',
    mixins:[dictMixin],
    components: {
      BiFormItemTextarea,
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
      let that = this;
      return {
        param: {},
        visible: false,
        fullscreen: true,
        confirmLoading: false,
        optType:'',
        files:[],
        form:this.$form.createForm(this),
        rules: {
          globalReq:r
        },
        model: {},
        url: {
          save: "/prj/asset/saveArt",
          upload: "/sys/common/biUpload",
          find: "/prj/asset/findArt"
        }
      }
    },
    computed:{
      ...mapState("project", [
        "cusAccInfoList","relPartyList","orgList"
      ]),
       disabled(){
        return  this.optType=='view';
      }
    },
    created() {
      this.getDict('y_n,CUR_CODE');
    },
    mounted() {
      //mounted here     "prjCode='+this.$route.query.prjCode+'&relType=BENEFICIARY"
    },
    methods: {
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
        if(that.optType!=='add' && record.id) {
          this.$nextTick(() => {
            that.confirmLoading = true;
            let formData = { id: record.id };
            postAction(that.url.find, formData).then((res) => {
              if (res.success) {
                let f = that.form.getFieldsValue();
                console.log('form=',f);
                console.log('data=',res.result);
                let initValues = genInitVal(f, res.result);
                that.form.setFieldsValue(initValues);
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
         // 页面关闭时关闭
        this.confirmLoading = false;
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
            formData.cta.prjCode = that.param.prjCode;
            formData.cta.periodNo = that.param.periodNo;
            formData.cta.propertyType = that.param.propertyType;
            formData.cta.assetType = that.param.assetType;
            formData.cta.trustPropertyAmt = values.cusAssetOth.propPrice;
            formData.cta.bankProCode = values.cusAssetOth.certCode;
            formData.cta.proName = values.cusAssetOth.propName;
            formData.cta.curCode = values.cusAssetOth.curCode;

            formData.cat.prjCode = that.param.prjCode;

            formData.cusAssetOth.prjCode = that.param.prjCode;
            formData.cusAssetOth.periodNo = that.param.periodNo;
            formData.cusAssetOth.assetType = that.param.assetType;
            console.log("formData:",formData);
            that.confirmLoading = true;
            postAction(that.url.save, formData).then((res)=>{
              if(res.success){
                that.addOrdersOptLogs({
                  odrCode: res.result.cta.orderCode,
                  batchId: res.result.batchId,
                  optType: '委托资产录入',
                  oprations: '委托资产保存',
                  status: '待提交',
                  memo: formData.cusAssetOth.propName
                });
                that.SET_batchId(res.result.batchId);

                const filesNeed2Upload = that.files.filter(file => file.id == undefined);
                if(filesNeed2Upload.length>0){
                  const formData = new FormData();
                  formData.append("module","ASSET_LUX");
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
      }
    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less'
</style>