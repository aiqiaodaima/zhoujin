/**
  委托资产录入
 */
<template>
  <div>
    <a-form-model ref="assetConditionform" :model="form" :rules="rules">
      <a-card size="small" style="margin-top: 12px;padding-bottom: 12px" :bordered="false" title="委托资产">
        <a-row v-if="!disabled">
          <BiCol>
            <BiFormItemSelect label="项目名称" name="prjCode" v-model="form.prjCode" :disabled="!canPrjChange" :options="prjectInfoList" @change="prjChoosed" customKey="PRJ_CODE" customVal="TRUST_PRJ_NAME" showSearch/>
          </BiCol>
          <BiCol>
            <a-row :gutter="24">
              <a-col :span="12">
                <BiFormItemSelect label="委托财产类型" v-model="form.propertyType" @change="ptChange" :disabled="disabled" :options="dicts.PROPERTY_TYPE" name="propertyType"/>
              </a-col>
              <a-col v-if="form.propertyType === 'M'" :span="12">
                <BiFormItemSelect :disabled="disabled" :options="dicts.TRUST_ASSET_TYPE"  :label="customizeEnv==='zrt'?'其他类资产类型':'管理类资产类型'"   name="assetType" v-model="form.assetType" showSearch/>
              </a-col>
            </a-row>
          </BiCol>
          <BiCol>
            <a-form-model-item>
              <a-button style="margin-top: 42px;" @click="handleAdd" type="primary" icon="plus">新增</a-button>
            </a-form-model-item>
          </BiCol>
        </a-row>
        <a-table
          ref="table"
          bordered
          size="small"
          rowKey="ID"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          @change="handleTableChange">
          <span slot="action" slot-scope="text, record">
            <a @click="handleView(record)">查看</a>
            <a-divider type="vertical"></a-divider>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical"></a-divider>
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </a-table>
      </a-card>
    </a-form-model>
    <component :is="comp" @reloadTable="reloadTable" ref="assetModal" @ok="this.loadData"></component>

    <a-spin :spinning="loading">
      <template v-for="acc in cusAccInfoList">
        <a-card v-if="accNoSet.has(acc.accNo)" :key="acc.accNo" size="small" style="margin-top: 12px;padding-bottom: 12px;z-index: 0;"
                :bordered="false" :title="getDictNameByCode(dicts['BNF_MODE'],acc.bnfMode)+'子账户：'+acc.accName">
          <j-editable-table style="padding-bottom: 20px" :columns="getBnfColumns(acc.bnfMode)" :dataSource="bnfDataSource[acc.accNo]"
                            :actionButton="false" :ref="acc.accNo+'_bnfEditTable'"/>
        </a-card>
      </template>
    </a-spin>
  </div>
</template>
<script>
  import moment from 'moment'
  import { mapActions, mapState, mapMutations } from 'vuex'
  import dictMixin from '@/mixins/dictMixin'
  import BiCol from '@/components/BI/BiCol'
  import { FtsListMixin } from '@/mixins/FtsListMixin'
  import { postAction } from '../../../api/manage'
  import { FormTypes } from '../../../utils/JEditableTableUtil'
  import JEditableTable from '../../../components/jeecg/JEditableTable'
  import * as customizeConfigs from '../../../customizeConfig'

  export default {

    name: "Assets",
    mixins:[dictMixin, FtsListMixin],
    props: {
      disabled:{
        default: false
      },
      form: {
        prjCode:'',
        prjName:'',
        propertyType:'',
        assetType:'',
        periodNo:0,
        optType:'EDIT'
      }
    },
    data(){
      let r = { required: true, message: '请选择', trigger: 'change' };
      let customizeEnv = customizeConfigs.customizeEnv;
      return {
        customizeEnv: customizeEnv,
        rules:{
          prjCode: [r],
          propertyType: [r],
          assetType: [r]
        },
        accNoSet:new Set(),
        comp:'',
        comps:[],
        columns:[
          {
            title: '资产类型',
            align:"center",
            dataIndex: 'PROPERTY_TYPE',
            customRender: (text) => {
              return this.getDictNameByCode(this.dicts.PROPERTY_TYPE,text);
            }
          },{
            title: '资产名称',
            align:"center",
            dataIndex: 'A',
            customRender: (text, record) => {
              let astName = '';
              if(record.PROPERTY_TYPE === 'S'){
                astName = this.getDictNameByCode(this.dicts.PROPERTY_TYPE,record.PROPERTY_TYPE);
              }else if(record.PROPERTY_TYPE === 'P'){
                astName = record.PRO_NAME;
              }else{
                astName = this.getDictNameByCode(this.dicts.TRUST_ASSET_TYPE,record.ASSET_TYPE);
              }
              record.astName = astName;
              return astName;
            }
          },{
            title: '金额',
            align:"center",
            dataIndex: 'TRUST_PROPERTY_AMT',
            customRender: (text, record) => {
              if(record.PROPERTY_TYPE === 'P'){
                return record.INV_AMT_FC;
              }else{
                return record.TRUST_PROPERTY_AMT;
              }
            }
          },{
            title: '子账户',
            align:"center",
            dataIndex: 'ACC_NAME'
          },{
            title: '交付日期',
            align:"center",
            dataIndex: 'TRAN_DT'
          },{
            title: '委托人',
            align:"center",
            dataIndex: 'PARTY_NAME'
          },{
            title: '订单状态',
            align:"center",
            dataIndex: 'STATUS_NAME',
            customRender: (text) => {
              return text?text:'未提交';
            }
          },{
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        bnfDataSource: {},
        url:{
          list:'/prj/asset/list',
          del: "/prj/asset/delAsset",
          getRelatedBnf: '/prj/asset/relatedBnfList'
        },
        autoLoadData:false,
        canPrjChange:true
      }
    },
    components: {
      JEditableTable,
      BiCol
    },
    computed: {
      ...mapState("project", [
        "prjectInfoList","cusAccInfoList","batchId"
      ]),
      compStr(){
        return this.form.propertyType+this.form.assetType;
      }
    },
    watch: {
      compStr:{
        immediate:true,
        handler(v) {
          if(v&&(v==='S'||v==='P'||(v.indexOf("M")>-1&&v.length>1))){
            this.loadComp(v);
          }
        }
      },
      dataSource(){
        let that=this
        let total=0
        this.accNoSet.clear()
        for(let i=0;i<that.dataSource.length;i++){
          let sub=that.dataSource[i]
          that.accNoSet.add(sub.ACC_NO)

          //计算金额
          let price=0
          if(sub.PROPERTY_TYPE === 'P'){
            price=sub.INV_AMT_FC
          }else{
            price=sub.TRUST_PROPERTY_AMT
          }
          if(!isNaN(Number(price))){
            total+=Number(price)
          }
        }
        that.$emit("assetsChange",total)
      }
    },
    methods: {
      moment,
      ...mapMutations("project",["SET_batchId"]),
      ...mapActions("project",["getPrjectInfoList","getCusAccInfoList","addOrdersOptLogs"]),
      getBnfColumns(bnfMode){
        let that=this
        return [
          {
            title:'受益顺位',
            width: '10%',
            key:'BNF_RANK',
            type: FormTypes.normal
          },{
            title:'姓名/名称',
            width: '10%',
            key:'PARTY_NAME',
            type: FormTypes.normal
          },{
            title:'受益比例(%)',
            width: '10%',
            key:'AMT_PERCENT',
            type: bnfMode==='P'?FormTypes.normal:FormTypes.inputNumber,
            placeholder: '请输入受益比例',
            customRender: function (text) {
              return '--';
            }
          },{
            title:'受益人状态',
            width: '10%',
            key:'BNF_STATUS',
            type: FormTypes.normal,
            customRender: function (text) {
              return that.getDictNameByCode(that.dicts.BNF_STATUS,text);
            }
          },{
            title:'与委托人关系',
            width: '10%',
            key:'CUS_RELATIVE_TYPE',
            type: FormTypes.normal,
            customRender: function (text) {
              return that.getDictNameByCode(that.dicts.PTY_RELATIVE_TYPE,text);
            }
          },{
            title:'证件类型/证件号码',
            width: '20%',
            key:'IDN',
            type: FormTypes.normal
          },{
            title:'婚姻状况',
            width: '10%',
            key:'MARITAL_CODE',
            type: FormTypes.normal,
            customRender: function (text) {
              return that.getDictNameByCode(that.dicts.MARITAL_CODE,text);
            }
          },{
            title:'手机号码',
            width: '10%',
            key:'CPHONE',
            type: FormTypes.normal
          },{
            title:'固定电话',
            width: '10%',
            key:'FPHONE',
            type: FormTypes.normal
          },{
            key:'ACC_NO',
            type: FormTypes.hidden
          },{
            key:'PARTY_CODE',
            type: FormTypes.hidden
          }
        ];
      },
      handleAdd () {
        const that = this;
        that.$refs.assetConditionform.validate(valid => {
          if (valid) {
            this.loadComp();
            // this.$nextTick DOM 更新后回调
            this.$nextTick(() => {
              that.$refs.assetModal.add(that.form);
            })
          } else {
            return false;
          }
        })
      },
      handleView (record){
        let that = this;
        this.loadComp(record.PROPERTY_TYPE+record.ASSET_TYPE);
        let i = setInterval(()=>{
          if(that.$refs.assetModal){
            that.$refs.assetModal.view(record);
            clearInterval(i);
          }
        }, 200);
      },
      handleEdit(record){
        let that = this;
        this.loadComp(record.PROPERTY_TYPE+record.ASSET_TYPE);
        // this.$nextTick DOM 更新后回调
        let i = setInterval(()=>{
          if(that.$refs.assetModal){
            that.$refs.assetModal.edit(record);
            clearInterval(i);
          }
        }, 200);
      },
      handleDelete(record){
        let that = this;
        that.loading = true;
        let formData = {cta:{ id: record.ID }};
        // 操作日志--删除埋点
        postAction(that.url.del, formData).then((res)=>{
          if(res.success){
            that.$message.success('删除成功！');
            that.addOrdersOptLogs({
              batchId: that.batchId,
              optType: '委托资产录入',
              oprations: '委托资产删除',
              status: '待提交',
              memo:record.astName
            });
            that.prjChoosed(that.form.prjCode);
          }else{
            that.$message.warning(res.message);
            that.loading = false;
          }
        });
      },
      reloadTable(){

      },
      ptChange(){
        if(this.form.propertyType!=='M'){
          this.form.assetType='';
        }
      },
      loadComp(c){
        let v = c||this.compStr;
        if(v){
          let that = this;
          if(!that.comps[v]){
            that.comps[v] = ()=>import('@/views/prj/modules/Asset' + v + 'Modal.vue');
          }
          that.comp = that.comps[v];
        }
      },
      prjChoosed(prjCode){
        if(prjCode){
          let that = this;
          that.loading = true;
          this.queryParam.prjCode = prjCode;
          this.queryParam.periodNo = this.form.periodNo;
          this.queryParam.isInit = true;

          let cli = this.prjectInfoList.filter(item => item.PRJ_CODE===prjCode);
          console.log("cli=",cli);
          this.form.prjName = cli[0].TRUST_PRJ_NAME;
          this.loadData();
          that.bnfDataSource={};

          postAction(this.url.getRelatedBnf,{prjCode:prjCode, periodNo: this.form.periodNo}).then(res=>{
            if(res.success){
              console.log('getRelatedBnf======',res.result);
              res.result.forEach(r=>{
                if(!that.bnfDataSource[r.ACC_NO]){
                  that.bnfDataSource[r.ACC_NO] = [];
                }
                that.bnfDataSource[r.ACC_NO].push(r);
              });
            }else{
              that.$message.warning(res.message);
            }
            console.log('bnfDataSource=',that.bnfDataSource);
          }).finally(()=>{
            this.getCusAccInfoList({prjCode:prjCode});
            that.loading = false;
          });
        }
      },
      async initPage(prjCode,periodNo){
        console.log('initPage in');
        this.loading = true;
        this.form.periodNo = periodNo||0;
        if(prjCode){
          await this.getPrjectInfoList({pageSize:999999999, prjCode:prjCode});
          console.log('prjCode=',prjCode);
        } else {
          await this.getPrjectInfoList({pageSize:999999999, prjStatus:'U'});
          console.log('else no prjCode');
        }
        await this.getDict('PROPERTY_TYPE,TRUST_ASSET_TYPE,BNF_MODE,MARITAL_CODE,BNF_STATUS,PTY_RELATIVE_TYPE');
        let that = this;
        this.$on('ftsListDataLoaded',(u)=>{
          console.log('ftsListDataLoaded'+u,that.dataSource);
          if(u==='/prj/asset/list' && that.dataSource && that.dataSource.length>0){
            that.SET_batchId(that.dataSource[0].BATCH_ID);
          }
        });
        if(prjCode){
          this.canPrjChange = false;
          this.prjChoosed(prjCode);
        }else{
          console.log('oldPrjCode',this.form.prjCode);
          if(this.form.prjCode){
            this.prjChoosed(this.form.prjCode);
          }else{
            this.loading = false;
          }
        }
      }
    },
    created() {
      this.getDict('PROPERTY_TYPE,TRUST_ASSET_TYPE,BNF_MODE,MARITAL_CODE,BNF_STATUS,PTY_RELATIVE_TYPE')
    }
  }
</script>
<style lang="stylus" scoped>

</style>
