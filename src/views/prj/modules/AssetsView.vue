<template>
  <div>
    <a-card size="small" style="margin-top: 12px;padding-bottom: 12px" title="委托资产">
      <a-table
        ref="table"
        bordered
        size="small"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange">
          <span slot="action" slot-scope="text, record">
            <a @click="handleView(record)">查看</a>
          </span>
      </a-table>
    </a-card>

    <component :is="comp" ref="assetModal"></component>

    <template v-for="acc in cusAccInfoList">
      <a-card v-if="accNoSet.has(acc.accNo)" :key="acc.accNo" size="small" style="margin-top: 12px;padding-bottom: 12px"
              :title="getDictNameByCode(dicts['BNF_MODE'],acc.bnfMode)+'子账户：'+acc.accName">
        <j-editable-table style="margin: -20px -20px -5px -20px" :columns="getBnfColumns(acc.bnfMode)" :dataSource="bnfDataSource[acc.accNo]"
                          :actionButton="false" :ref="acc.accNo+'_bnfEditTable'"/>
      </a-card>
    </template>
  </div>
</template>
<script>
  import moment from 'moment'
  import dictMixin from '../../../mixins/dictMixin'
  import { FtsListMixin } from '../../../mixins/FtsListMixin'
  import { FormTypes } from '../../../utils/JEditableTableUtil'
  import JEditableTable from '../../../components/jeecg/JEditableTable'
  import { mapActions, mapState } from 'vuex'
  import { postAction } from '../../../api/manage'
  import { formatDate } from '../../../utils/util'

  export default {
    name: "AssetsView",
    mixins:[dictMixin, FtsListMixin],
    computed: {
      ...mapState("project", [
        "prjectInfoList","cusAccInfoList"
      ])
    },
    components: {
      JEditableTable
    },
    props:{
      businessKey:''
    },
    watch:{
      businessKey(){
        this.initPage();
      },
      dataSource(){
        let that=this
        this.accNoSet.clear()
        this.dataSource.forEach(sub=>{
          that.accNoSet.add(sub.ACC_NO)
        })
      }
    },
    data(){
      return {
        comp:'',
        comps:[],
        accNoSet:new Set(),
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
              if(record.PROPERTY_TYPE === 'S'){
                return this.getDictNameByCode(this.dicts.PROPERTY_TYPE,record.PROPERTY_TYPE);
              }else if(record.PROPERTY_TYPE === 'P'){
                return record.PRO_NAME;
              }else{
                return this.getDictNameByCode(this.dicts.TRUST_ASSET_TYPE,record.ASSET_TYPE);
              }
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
            dataIndex: 'PAY_DT',
            customRender: (text) => {
              return text?formatDate(text,'yyyy-MM-dd'):'--';
            }
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
          getRelatedBnf: '/prj/asset/relatedBnfList'
        },
        autoLoadData:false,
        batchId:'',
        prjCode:'',
        propertyType:'',
        assetType:'',
        periodNo:0
      }
    },
    methods: {
      moment,
      ...mapActions("project", ["getPrjectInfoList", "getCusAccInfoList"]),
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
            type: FormTypes.normal,
            placeholder: '请输入受益比例',
            customRender: function (text) {
              return bnfMode==='U'?text:'--';
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
        ]
      },
      initPage(data){
        let param = (data||this.businessKey).split(":")[1].split(",");
        this.prjCode=param[0];
        this.periodNo=param[1];
        this.batchId = param[2];
        this.queryParam.prjCode = this.prjCode;
        this.queryParam.periodNo = this.periodNo;
        this.queryParam.batchId = this.batchId;
        this.loadData();
        let that = this;
        that.loading = true;
        postAction(this.url.getRelatedBnf,{prjCode:this.prjCode, periodNo:this.periodNo}).then(res=>{
          if(res.success){
            res.result.forEach(r=>{
              if(!that.bnfDataSource[r.ACC_NO]){
                that.bnfDataSource[r.ACC_NO] = [];
              }
              that.bnfDataSource[r.ACC_NO].push(r);
            });
          }else{
            that.$message.warning(res.message);
          }
        }).finally(()=>{
          this.getCusAccInfoList({prjCode:this.prjCode});
          that.loading = false;
        });
      },
      loadComp(c){
        let v = c;
        if(v){
          let that = this;
          if(!that.comps[v]){
            that.comps[v] = ()=>import('@/views/prj/modules/Asset' + v + 'Modal.vue');
          }
          that.comp = that.comps[v];
        }
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
      }
    },
    created() {
      this.getDict('PROPERTY_TYPE,TRUST_ASSET_TYPE,BNF_MODE,MARITAL_CODE,BNF_STATUS,PTY_RELATIVE_TYPE');
    },
    mounted(){
      this.$emit('pageMounted');
    }
  }
</script>
<style>

</style>
