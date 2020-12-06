<template>
  <div style="background-color: #e8e8e8;">
  <div style="margin-top: 12px">
    <a-card :bordered="false" >
      <a-row :gutter="24" style="margin-top: -12px">
          <span style="font-size: 25px;color: #000;">{{this.$route.query.prjName}}</span>
          <span v-if="this.prj.contractName !=null && this.prj.contractName !=''">
           <a-input style="width: 100px"  v-model="prj.contractName" name="contractName" class="input-text" :readOnly="readOnly"></a-input>
        </span>
        <span v-if="this.prj.sfgz !=null && this.prj.sfgz !=''">
      <a-input style="width: 80px" v-model="prj.sfgz"  name="sfgz" class="input-text" :readOnly="readOnly"></a-input>
        </span>
        <span v-if="this.prj.statu !=null && this.prj.statu !=''">
      <a-input style="width: 100px" v-model="prj.statu" name="statu" class="input-text" :readOnly="readOnly"></a-input>
        </span>
        <div style="float: right">
        <a-button style="margin-right: 15px"  type="primary" @click="xtht">信托合同</a-button>
        <a-button  style="margin-right: 2px" type="primary" @click="dbsx">待办事项</a-button>
        </div>
      </a-row>
      <a-row :gutter="24" style="margin-top: 12px">
        <span>{{fd()}}</span>
      </a-row>
      <a-row :gutter="24" style="margin-top: 5px">
        <a-form-model>
          <a-col :span="4" style="padding-left: 0px">
            <a-form-model-item  label="可用现金余额">
              <span style="color:#ffc53d;font-weight: 700;">{{fa(prj.SAVING_BAL)}}</span>
            </a-form-model-item>
          </a-col>

          <a-col :span="4">
            <a-form-model-item  label="账户余额">
              <span style="color:#ffc53d;font-weight: 700; ">{{ fa(prj.BANK_SAVING_BAL) }}</span>
            </a-form-model-item>
          </a-col>

          <a-col :span="4">
            <a-form-model-item  label="财产净值">
              <span style="color:#ffc53d;font-weight: 700; ">{{fa(prj.NET_AMT_AUA)}}</span>
            </a-form-model-item>
          </a-col>

          <a-col :span="4">
            <a-form-model-item  label="信托份额">
              <span style="color:#000;font-weight: 700; ">{{ fa(prj.UNIT) }}</span>
            </a-form-model-item>
          </a-col>

          <a-col :span="4" v-if="detail.VOA_TYPE=='1'">
            <a-form-model-item  label="单位净值">
              <span style="color:#000;font-weight: 700; ">{{ fa(prj.PRICE) }}</span>
            </a-form-model-item>
          </a-col>

          <a-col :span="4" v-if="detail.VOA_TYPE=='1'">
            <a-form-model-item  label="净值日期">
              <span style="color:#000;font-weight: 700; "></span>
            </a-form-model-item>
          </a-col>
        </a-form-model>

      </a-row>
    </a-card>

    <a-card :bordered="false" :body-style="{padding: '0'}" style="margin-top: 20px">
      <div class="salesCard">
        <a-tabs defaultActiveKey="project_detail"  size="large" @change="changeCard">
          <a-tab-pane key="project_detail" tab="项目概要" forceRender>
            <project-detail ref="ProjectDetail"></project-detail>
          </a-tab-pane>
         <a-tab-pane key="project_person" tab="项目关系人" forceRender>
            <project-person ref="ProjectPerson"></project-person>
          </a-tab-pane>
           <a-tab-pane key="project_ccmx" tab="持仓明细" forceRender>
             <project-position ref="ProjectPosition"></project-position>
           </a-tab-pane>
             <a-tab-pane key="project_jyjl" tab="交易记录" forceRender>
              <project-transaction ref="ProjectTransaction"></project-transaction>
            </a-tab-pane>
            <a-tab-pane key="project_tzxz" v-if="customizeEnv === 'zrt'" tab="投资限制" forceRender>
              <asset-tacticList ref="AssetTacticList"></asset-tacticList>
            </a-tab-pane>
          <!--  <a-tab-pane key="project_zqjyjl" tab="证券交易记录" forceRender>
               <project-securitie-record ref="ProjectSecuritieRecord"></project-securitie-record>
             </a-tab-pane>
             <a-tab-pane key="project_xxplbg" tab="信息披露报告" forceRender>
               <project-info-report ref="ProjectInfoReport"></project-info-report>
             </a-tab-pane>
             <a-tab-pane key="project_htxgjl" tab="合同修改记录" forceRender>
               <project-contract-modif ref="ProjectContractModif"></project-contract-modif>
             </a-tab-pane>-->
        </a-tabs>
      </div>
    </a-card>
  </div>
  </div>
</template>

<script>


  import { postAction,getAction } from '../../api/manage'
  import PrjChartCard from '@/components/PrjChartCard'
  import ProjectDetail from './modules/ProjectDetail'
  import ProjectPerson from './modules/ProjectPerson'
  import ProjectPosition from './modules/ProjectPosition'
  import ProjectTransaction from './modules/ProjectTransaction'
  import AssetTacticList from '@/views/assetParam/AssetTacticList'
  import ProjectSecuritieRecord from './modules/ProjectSecuritieRecord'
  import ProjectInfoReport from './modules/ProjectInfoReport'
  import ProjectContractModif from './modules/ProjectContractModif'
  import dictMixin from '@mixins/dictMixin'
  import { filterDictText } from '@/components/dict/JDictSelectUtil'
  import { initDictOptionsBatch } from '../../components/dict/JDictSelectUtil'
  import { queryDepartTreeList } from '@/api/api'
  import { formatAmt } from '../../utils/util'
  import * as customizeConfigs from '../../customizeConfig'
  export default {
    name: "ProjectView",
    components: {
      PrjChartCard,
      ProjectDetail,
      ProjectPerson,
      ProjectPosition,
      ProjectTransaction,
      ProjectSecuritieRecord,
      ProjectInfoReport,
      ProjectContractModif,
      AssetTacticList
    },
    mixins: [dictMixin],
    data() {
     let customizeEnv = customizeConfigs.customizeEnv
      return {
        customizeEnv: customizeEnv,
        readOnly:true,
        prjCode:this.$route.query.prjCode,
        prj:{
          contractName:'',
          clientName:'',
          source:'',
          hzqd:'',
          sfgz:'',
          statu:'',
          SAVING_BAL:0.00,
          BANK_SAVING_BAL:0.00,
          MKT_AMT_AUA:0.00,
          NET_AMT_AUA:0.00,
          UNIT:0.00,
          PRICE:0.00,
          BJ_AMT:0.00,
          SY_AMT:0.00
        },
        dictOptionsData:[],
        treeData:[],
        detail:'',

    }
    },
    created() {
      this.getDictInfo()
      this.initDictConfig();
      console.log('222'+this.$route.query.prjCode)
    },
    mounted(){

    },
    methods: {
      xtht(){
        this.$router.push({path:"/prj/setup",query:{optType:'EDIT',prjCode:this.$route.query.prjCode}});
      },
      dbsx(){
        this.$router.push({path:"/wkf/schedule"});
      },
      fa(v){
        return formatAmt(v,2);
      },
      fd(){
        let text='';
        if (this.prj.clientName!=null && this.prj.clientName!='' && this.prj.clientName!=undefined){
          text='受托人:'+this.prj.clientName
        }
        if (this.prj.source!=null && this.prj.source!='' && this.prj.source!=undefined){
          if (this.prj.hzqd!=null && this.prj.hzqd!='' && this.prj.hzqd!=undefined){
            text+=' |客户来源:'+this.prj.source+'-'+this.prj.hzqd
          }else {
            text+=' |客户来源:'+this.prj.source
          }
        }
        return text;
      },
      changeCard(key) {
          console.log(key)
      },
      getDictInfo(){
        let that = this;
        initDictOptionsBatch("CONTRACT_TYPE,VOA_TYPE,CUSTOMER_SOURCE,CUSTOMER_SOURCE,PRJ_STATUS").then((res) => {
          if (res.success) {
            that.dictOptionsData = res.result;
              that.queryPrjInfo();
          }
        });
      },
      initDictConfig(){
        this.getDict('CONTRACT_TYPE,VOA_TYPE,CUSTOMER_SOURCE,CUSTOMER_SOURCE,PRJ_STATUS')
      },
      fdText(o,v){
        return filterDictText(this.dictOptionsData[o],v);
      },
      queryPrjInfo(){
        getAction('/prj/list', {prjCode: this.$route.query.prjCode}).then(res=>{
          if(res.success){
            this.detail = res.result.records[0];
            this.prj.contractName=this.fdText('CONTRACT_TYPE',this.detail.CONTRACT_TYPE)
            this.prj.sfgz=this.fdText('VOA_TYPE',this.detail.VOA_TYPE)
            this.prj.source=this.fdText('CUSTOMER_SOURCE',this.detail.CUSTOMER_SOURCE)
            this.prj.statu=this.fdText('PRJ_STATUS',this.detail.PRJ_STATUS)
            this.prj.SAVING_BAL=this.detail.SAVING_BAL;
            this.prj.BANK_SAVING_BAL=this.detail.BANK_SAVING_BAL;
            this.prj.MKT_AMT_AUA=this.detail.MKT_AMT_AUA;
            this.prj.NET_AMT_AUA=this.detail.NET_AMT_AUA;
            this.prj.UNIT=this.detail.UNIT;
            this.prj.PRICE=this.detail.PRICE;
            this.prj.BJ_AMT=this.detail.BJ_AMT;
            this.prj.SY_AMT=this.detail.SY_AMT;
            this.prj.hzqd=this.detail.DEPART_NAME;
          }
        });
        getAction('/prj/rel/list', {prjCode: this.$route.query.prjCode,relType:'CLIENT'}).then(res=>{
          if(res.success){
            let str ='';
            res.result.records.forEach(item=>{
              str +=item.PARTY_NAME+'，'
            })
            this.prj.clientName=str.substring(0,str.length-1)
          }
        });
      },
    }
  }
</script>

<style lang="less" scoped>
  .input-text
  {
    border: 1px solid #C3CED9;
    border-radius:20px;
    height: 40px;
    margin-left: 10px;
    text-align: center;
    color: #ffc53d;
  }
</style>