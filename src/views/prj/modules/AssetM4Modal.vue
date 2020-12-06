<template>
  <j-modal
    title="房产"
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
        <a-card size="small" title="基本情况" :bordered="true">
          <a-row :gutter="24">
            <BiCol><BiFormItemSelect  :disabled="disabled"  label ="子账户" :decorator="['cat.accNo', rules.globalReq]" :options="cusAccInfoList" custom-key="accNo" custom-val="accName"/></BiCol>
            <BiCol><BiFormItemSelect  :disabled="disabled"  label ="委托人" :decorator="['cta.partyCode', rules.globalReq]" :options="relPartyList" custom-key="PARTY_CODE" custom-val="PARTY_NAME"/></BiCol>
            <BiCol><BiFormItemSelect  :disabled="disabled"  label ="是否计信托份额" :decorator="['cta.unitYn', rules.globalReq]" :options="dicts.y_n"/></BiCol>
            <BiCol><BiFormItemSelect  :disabled="disabled"  label ="是否收费" :decorator="['cta.feesYn', rules.globalReq]" :options="dicts.y_n"/></BiCol>
            <BiCol><BiFormItemInput  :disabled="disabled"  label ="房地产权证号" :decorator="['assetRealestate.certNo', rules.globalReq]"/></BiCol>
            <BiCol><a-form-item label="登记时间"><j-date v-decorator="['assetRealestate.regDate', {}]" style="width: 100%"/></a-form-item></BiCol>
            <BiCol><BiFormItemInput  :disabled="disabled"  label ="房地产权属人" :decorator="['assetRealestate.owner', {}]"/></BiCol>
            <BiCol><BiFormItemInput  :disabled="disabled"  label ="身份证明号" :decorator="['assetRealestate.idn', {}]"/></BiCol>
            <BiCol><BiFormItemSelect  :disabled="disabled"  label ="国籍/地区" :decorator="['assetRealestate.natCode', rules.globalReq]" :options="dicts.AREA_CODE"/></BiCol>
            <BiCol><BiFormItemInput  :disabled="disabled"  label ="房屋所有权取得方式" :decorator="['assetRealestate.ownType', {}]"/></BiCol>
            <BiCol><BiFormItemInput  :disabled="disabled"  label ="房屋所有权性质" :decorator="['assetRealestate.ownershipProp', {}]"/></BiCol>
            <BiCol><BiFormItemSelect  :disabled="disabled"  label ="共有情况" :decorator="['assetRealestate.coOwnType', {}]" :options="dicts.CO_OWN_TYPE"/></BiCol>
            <BiCol><BiFormItemInput  :disabled="disabled"  label ="房屋编号" :decorator="['assetRealestate.houseSerialNo', {}]"/></BiCol>
            <BiCol><BiFormItemInput  :disabled="disabled"  label ="房屋性质" :decorator="['assetRealestate.houseType', {}]"/></BiCol>
            <BiCol><BiFormItemSelect  :disabled="disabled"  label ="规划用途" :decorator="['assetRealestate.useType', {}]" :options="dicts.USE_TYPE"/></BiCol>
            <BiCol><BiFormItemSelect  :disabled="disabled"  label ="财产管理机构" :decorator="['assetRealestate.amOrgCode', {}]" :options="orgList" custom-key="orgCode" custom-val="orgName"/></BiCol>
          </a-row>
        </a-card>
        <a-card size="small" title="房屋及土地情况" style="margin-top: 15px">
          <a-row :gutter="24">
            <BiCol><BiFormItemInput  :disabled="disabled"  label ="房屋坐落" :decorator="['assetRealestate.location', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemInput  :disabled="disabled"  label ="房屋结构" :decorator="['assetRealestate.structure', {}]"/></BiCol>
            <BiCol><BiFormItemNumPercent  :disabled="disabled"  label ="层数" :decorator="['assetRealestate.floor', {}]"/></BiCol>
            <BiCol><BiFormItemNumPercent  :disabled="disabled"  label ="建筑面积(㎡)" :decorator="['assetRealestate.floorArea', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemNumPercent  :disabled="disabled"  label ="套内面积(㎡)" :decorator="['assetRealestate.floorSpace', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemNumPercent  :disabled="disabled"  label ="价值金额" :decorator="['assetRealestate.propPrice', rules.globalReq]"/></BiCol>
            <BiCol><BiFormItemInput  :disabled="disabled"  label ="地号" :decorator="['assetRealestate.plotNo', {}]"/></BiCol>
            <BiCol><BiFormItemNumPercent  :disabled="disabled"  label ="共用面积" :decorator="['assetRealestate.sharingArea', {}]"/></BiCol>
            <BiCol><BiFormItemNumPercent  :disabled="disabled"  label ="自用面积" :decorator="['assetRealestate.exUseArea', {}]"/></BiCol>
            <BiCol><BiFormItemInput  :disabled="disabled"  label ="土地性质" :decorator="['assetRealestate.landUsage', {}]"/></BiCol>
            <BiCol><BiFormItemInput  :disabled="disabled"  label ="土地使用权取得方式" :decorator="['assetRealestate.landAcqMode', {}]"/></BiCol>
            <BiCol><BiFormItemNumPercent  :disabled="disabled"  label ="土地使用年限" :decorator="['assetRealestate.landUseTerm', {}]"/></BiCol>
          </a-row>
        </a-card>
        <a-card size="small" title="房屋共有(用)情况" style="margin-top: 15px">
          <!-- <j-editable-table style="padding-bottom: 20px" :columns="columns" :dataSource="dataSource" :actionButton="true" ref="editAssetReMulinfoEditTable">
            <template v-slot:action="props">
              <a @click="handleDelete(props)">删除|</a>
            </template>
          </j-editable-table> -->
          <a-table
            :columns="columns"
            :dataSource="dataSource"
            :pagination="false"
            rowKey="key"
            >
            <template slot="index" slot-scope="text, record, index">{{index+1}}</template>
            <template v-for="(col,i) in ['mulOwner', 'houseUnit', 'certNo']" :slot="col" slot-scope="text, record, index">
              <a-input
                :key="col"
                v-if="record.editable"
                :value="text[col]"
                :placeholder="columns[i+1].title"
                @change="e => handleChange(e.target.value,col,index)"
                />
              <template v-else>{{ text[col]}}</template>
            </template>

            <template slot="operation" slot-scope="text, record, index">
                <template v-if="record.editable">
                  <span v-if="record.isNew">
                    <a @click="saveRow(index)">保存</a>
                    <a-divider type="vertical" />
                    <a-popconfirm title="是否要删除此行？" @confirm="remove(index)">
                      <a>删除</a>
                    </a-popconfirm>
                  </span>
                  <span v-else>
                    <a @click="saveRow(index)">保存</a>
                    <a-divider type="vertical" />
                    <a @click="cancel(index)">取消</a>
                  </span>
                </template>
                <span v-else>
                  <a @click="toggle(index)">编辑</a>
                  <a-divider type="vertical" />
                  <a-popconfirm title="是否要删除此行？" @confirm="remove(index)">
                    <a>删除</a>
                  </a-popconfirm>
                </span>
                <!-- <template v-else>
                  <span v-if="!record.isNew">
                    <a @click="toggle(index)">编辑</a>
                    <a-divider type="vertical" />
                    <a-popconfirm title="是否要删除此行？" @confirm="remove(index)">
                      <a>删除</a>
                    </a-popconfirm>
                  </span>
                  <span v-else>
                    <a @click="saveRow(index)">保存</a>
                    <a-divider type="vertical" />
                    <a @click="cancel(index)">取消</a>
                  </span>
                </template> -->
            </template>
          </a-table>
          <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="addClick">新增</a-button>
        </a-card>
        <a-card size="small" title="其他信息" style="margin-top: 15px">
          <a-row :gutter="24">
            <BiCol><BiFormItemNumPercent  :disabled="disabled"  label ="契税契价" :decorator="['assetRealestate.contractPrice', {}]"/></BiCol>
            <BiCol><BiFormItemInput  :disabled="disabled"  label ="契税种类" :decorator="['assetRealestate.contractTaxType', {}]"/></BiCol>
            <BiCol><BiFormItemNumPercent  :disabled="disabled"  label ="契税税率" :decorator="['assetRealestate.contractTaxRate', {}]"/></BiCol>
            <BiCol><BiFormItemNumPercent  :disabled="disabled"  label ="纳税金额" :decorator="['assetRealestate.tax', {}]"/></BiCol>
            <BiCol><a-form-item label="核准日期"><j-date :disabled="disabled" v-decorator="['assetRealestate.approvalDate', {}]" style="width: 100%"/></a-form-item></BiCol>
            <BiCol><BiFormItemInput  :disabled="disabled"  label ="登记字号" :decorator="['assetRealestate.regNo', {}]"/></BiCol>
            <BiCol><BiFormItemTextarea  :disabled="disabled" label="附记" :decorator="['assetRealestate.excursus', {}]"/></BiCol>
            <BiCol><BiFormItemTextarea :disabled="disabled" label="后续资金划分规则" :decorator="['assetRealestate.subfundsDivRul', {}]"/></BiCol>
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
  import { convertToCamelCase, formatAmt, genInitVal } from '../../../utils/util'
  import JEditableTable from '../../../components/jeecg/JEditableTable'
  import { FormTypes } from '../../../utils/JEditableTableUtil'

  export default {
    name: 'AssetM4Modal',
    mixins:[dictMixin],
    components: {
      JEditableTable,
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
        columns:[
          {
            title: '序号',
            key: 'index',
            width: '30',
            scopedSlots: { customRender: 'index' }
          },
          {
            title:'共有(用)人',
            width: '20%',
            key:'mulOwner',
            placeholder: '',
            scopedSlots: { customRender: 'mulOwner' }
          },{
            title:'占有房屋份额(%)',
            width: '20%',
            key:'houseUnit',
            placeholder: '',
            scopedSlots: { customRender: 'houseUnit' }
          },{
            title:'共有(用)权证号',
            width: '40%',
            key:'certNo',

            placeholder: '',
            scopedSlots: { customRender: 'certNo' }
          },{
            title: '操作',
            key: 'action',
            width: '20%',
            scopedSlots: { customRender: 'operation' }
          }
        ],
        dataSource:[],
        url: {
          save: "/prj/asset/saveRealEstate",
          upload: "/sys/common/biUpload",
          find: "/prj/asset/findRealEstate"
        }
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
      this.getDict('y_n,CUR_CODE,AREA_CODE,CO_OWN_TYPE,USE_TYPE');
    },
    mounted() {
      //mounted here     "prjCode='+this.$route.query.prjCode+'&relType=BENEFICIARY"
    },
    methods: {
      moment,
      ...mapMutations("project",["SET_batchId"]),
      ...mapActions("project",["getCusAccInfoList","getRelPartyList","getProNameList","getOrgList","addOrdersOptLogs"]),
      add(param){
        this.optType='add';
        this.param = param;
        this.initPage({"cta":{"partyCode":"A0320201z7pozaCLIENTLMs5Qi","unitYn":"Y","feesYn":"Y","prjCode":"A0320201z7poza","periodNo":0,"propertyType":"M","assetType":"4","trustPropertyAmt":20000000,"bankProCode":"11111","proName":"11111"},"cat":{"accNo":"A0320201z7pozaACCXPzrdf","prjCode":"A0320201z7poza"},"assetRealestate":{"certNo":"11111","regDate":"2020-06-30","owner":"11111","idn":"11111","natCode":"001","ownType":"11111","ownershipProp":"11111","coOwnType":"M","houseSerialNo":"11111","houseType":"11111","useType":"B","amOrgCode":"202005180003","location":"11111","structure":"11111","floor":25,"floorArea":250,"floorSpace":230,"propPrice":20000000,"plotNo":"11111","sharingArea":115,"exUseArea":115,"landUsage":"11111","landAcqMode":"11111","landUseTerm":70,"contractPrice":1,"contractTaxType":"11111","contractTaxRate":10,"tax":200000,"excursus":"11111","regNo":"11111","approvalDate":"2020-06-30","subfundsDivRul":"11111","prjCode":"A0320201z7poza","periodNo":0}});
        this.dataSource=[]
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
        this.getOrgList({orgType:'AM'});
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        let that = this;
        if(that.optType!=='add' && record.id) {
          console.log("record",record);
          this.$nextTick(() => {
            that.confirmLoading = true;
            let formData = { id: record.id };
            postAction(that.url.find, formData).then((res) => {
              if (res.success) {
                let f = that.form.getFieldsValue();
                let initValues = genInitVal(f, res.result);
                that.form.setFieldsValue(initValues);
                that.dataSource = res.result.listEditAssetReMulinfo;
                that.dataSource.forEach((item,index)=>{
                  item.key = index
                  item.isNew = false
                })
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
      handleDelete(props){
        let { rowId, target } = props
        target.removeRows(rowId);
      },
      handleSave(props){
        let { rowId, target } = props
        target.disabledRows({rowId})
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
            formData.cta.trustPropertyAmt = values.assetRealestate.propPrice;
            formData.cta.bankProCode = values.assetRealestate.certNo;
            formData.cta.proName = values.assetRealestate.location;
            formData.cta.curCode = values.assetRealestate.curCode;

            formData.cat.prjCode = that.param.prjCode;

            formData.assetRealestate.prjCode = that.param.prjCode;
            formData.assetRealestate.periodNo = that.param.periodNo;
            let pass = true;
            // debugger
            console.log(this.dataSource)
              // 错误数 = 0 则代表验证通过
                formData.listEditAssetReMulinfo = this.dataSource;
                // that.confirmLoading = true;
                postAction(that.url.save, formData).then((res)=>{
                  if(res.success){
                    that.addOrdersOptLogs({
                      odrCode: res.result.cta.orderCode,
                      batchId: res.result.batchId,
                      optType: '委托资产录入',
                      oprations: '委托资产保存',
                      status: '待提交',
                      memo: '房产'
                    });
                    that.SET_batchId(res.result.batchId);

                    const filesNeed2Upload = that.files.filter(file => file.id == undefined);
                    if(filesNeed2Upload.length>0){
                      const formData = new FormData();
                      formData.append("module","ASSET_RE");
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
      addClick(){
        this.dataSource.push({
          editable: true,
          isNew: true,
          mulOwner:'',
          houseUnit: '',
          certNo: '',
          key: this.dataSource.length
        })
      },
      saveRow (index,column) {
        let target = this.dataSource[index]
        target.editable = false
        target.isNew =  false
        this.dataSource = [...this.dataSource]
      },
      remove(index){
        this.dataSource.splice(index,1)
      },
      cancel (index){
        let target = this.dataSource[index]
        target.editable = false
        this.dataSource = [...this.dataSource]
      },
      // this.dataSource = [...this.dataSource]   触发dom 更新
      toggle (index) {
        let target = this.dataSource[index]
        target.editable = !target.editable
        this.dataSource = [...this.dataSource]

      },
      handleChange (value,column,index) {
        const newData = [...this.dataSource]
        const target = newData[index]
        if (target) {
          target[column] = value
          this.dataSource = newData
        }
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>