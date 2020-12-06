<template>
  <a-spin :spinning="loading">
    <page-layout :title="`${periodStr}-${statusName}`" :need-bread-crumb="false">
      <PrjOdrBasicInfo slot="headerContent" :detailData='detailData'/>
      <BasicInformationExtra slot="extra" :sum-amt="tranAmt" />
      <PrjOdrInfoAction slot="action" @submit="submit" @tempSave="tempSave" @withdraw="withdraw" @tradeSuccess="tradeSuccess" @tradeFail="tradeFail"/>
      <PrjOdrProgess />
      <a-collapse accordion style="margin-top:12px" :bordered="false" :activeKey='`${current}`'>
        <a-collapse-panel header="委托资产录入" key="0">
          <Assets v-if='status==="80"||status==="5"' :form='counterParty' ref="iAssets" @assetsChange="assetsChange"></Assets>
          <assets-view v-else ref="iAssetsView" ></assets-view>
        </a-collapse-panel>
        <a-collapse-panel header="委托审核" key="1" :bordered="false" v-if="current>0">
          <wkf-audit-his ref="his" @pageInited="auditHisPageReady"></wkf-audit-his>
        </a-collapse-panel>
        <a-collapse-panel header="委托资产交付" key="2" v-if="current>1">
          <PrjAssetTransfer ref='assetTransfer' @handleUpdate="initialPage" :disabled='status!=="75"' ></PrjAssetTransfer>
        </a-collapse-panel>
        <a-collapse-panel header="信托份额确认" key="3" v-if="current>2">
          <!-- @handleUpdate="handleOk" -->
          <prj-asset-confirm ref="assetConfirm" @handleUpdate="initialPage" :disabled='status !== "20"'></prj-asset-confirm>
        </a-collapse-panel>
      </a-collapse>
      <!-- 操作日志 -->
      <PrjOrderOptLog/>
      <wkf-next-user-modal ref="wkfUserForm" @complete="wkfUserComplete"></wkf-next-user-modal>
    </page-layout>
  </a-spin>
</template>

<script>
  import PageLayout from '@/components/page/PageLayout'
  import { mapState, mapActions, mapMutations } from "vuex";
  import { BasicInformationExtra,FundSource,OrderOther,CheckFlow,FlowTransfer } from '../order/modules'
  import { httpActionWF, postAction } from '../../api/manage'
  import WkfNextUserModal from '../activiti/modules/WkfNextUserModal'
  import { PrjOdrBasicInfo,PrjOdrInfoAction,PrjOdrProgess,Assets,PrjOrderOptLog } from './modules'
  import AssetsView from './modules/AssetsView'
  import WkfAuditHis from '../activiti/modules/WkfAuditHis'
  import PrjAssetTransfer from './modules/PrjAssetTransfer'
  import PrjAssetConfirm from './modules/PrjAssetConfirm'

  export default {
    name: "InitComm",
    components: {
      PrjAssetConfirm,
      PrjAssetTransfer,
      WkfAuditHis,
      AssetsView,
      WkfNextUserModal,
      PageLayout,
      PrjOdrBasicInfo,
      BasicInformationExtra,
      PrjOdrInfoAction,
      PrjOdrProgess,
      Assets,
      FundSource,
      OrderOther,
      PrjOrderOptLog,
      CheckFlow,
      FlowTransfer
    },
    mixins: [],
    data () {
      return {
        fundSource:[],//资金来源
        fileList:[],
        checkFlow:[], //审核流程表格
        counterParty: {
          prjCode:'',
          prjName:'',//项目名称
          propertyType:'',
          assetType:'',
          periodNo: this.periodNo||0,
          bnfDataSource:[]
        }, // 交易对手
        detailData: {
          batchId: '',
          trustPrjName: '',
          createBy: '',
          createDt: '',
          period: this.periodNo||'0',
          curCode: '156'
        },//信息
        assetTransfer:[],
        tranAmt: '0', //总金额
        loading: false,
        url:{
          audit:'/prj/asset/audit',
          // saveUnit:'/prj/asset/saveUnit'//确认份额
        }
      }
    },
    watch:{
      batchId(){
        console.log('waaaatttttcccchhhddd==>','['+this.detailData.batchId+']');
        if(this.detailData.batchId !== this.batchId){
          this.detailData.batchId = this.batchId;
          this.ordersOptLogsList();
          this.getOrders();
        }
      },
      taskId(){
        if(this.taskId){
          this.$refs.his.initPage(null, {taskId: this.taskId});
        }
      },
      currUrl(){
        console.log('currUrl===');
        // if(this.$route.query.batchId||this.$route.query.param){
          this.initialPage();
        // }
      }
    },
    computed: {
      ...mapState("project", [
        "current","statusName","status","batchId","cusAccInfoList","taskId","prjOrderInfo","prjCode","periodNo","prjChangeble"
      ]),
      currUrl: function() {
        return this.$route.query.batchId+","+this.$route.query.param;
      },
      periodStr(){
        return this.periodNo>0?'追加委托':'初始委托';
      }
    },
    filters: {

    },
    methods:{
      ...mapMutations("project",["SET_status","RESET_STATE","SET_batchId","SET_prjCode","SET_periodNo","SET_prjChangeble"]),
      ...mapActions("project",["addOrdersOptLogs","ordersOptLogsList","queryWkfInfoByBatchId","getPrjOrderInfo"]),
      submit(button) {
        //button 保存草稿TEMPS
        if(!this.counterParty.prjCode){
          this.$message.error('请选择项目');
          return;
        }
        if(this.$refs.iAssets.dataSource.length<1){
          this.$message.error('尚未录入资产');
          return;
        }
        let ok = true;
        let that = this;
        let bnfData = [];
        Object.keys(this.$refs.iAssets.bnfDataSource).forEach(accNo=>{
          let acc = that.cusAccInfoList.filter((acc)=>acc.accNo===accNo);
          if(acc&&acc[0]&&acc[0].bnfMode === 'U'){
            let total = 0;
            let bnfTable=that.$refs.iAssets.$refs[accNo+'_bnfEditTable'];
            if(bnfTable && bnfTable[0]){
              let r = bnfTable[0].getValuesSync();
              if(r.error === 0){
                r.values.forEach(bnf=>{
                  total += Number(bnf.AMT_PERCENT);
                });
                bnfData.push(r.values);
              }
              if(total !== 100){
                ok = false;
              }
            }
          }
        });
        if(!ok){
          this.$message.error('受益人比例之和需为100%');
          return;
        }
        let fromData = {
          prjCode: this.counterParty.prjCode,
          prjName: this.counterParty.prjName,
          periodNo: this.periodNo||0,
          bnfData: bnfData
        };
        this.loading = true;
        postAction(this.url.audit,fromData).then(res=>{
          if(res.success){
            that.$refs.wkfUserForm.edit(res.result.instanceId);
            that.$refs.wkfUserForm.disableSubmit = false;

            that.SET_batchId( res.result.batchId );

            that.addOrdersOptLogs({
              batchId: res.result.batchId,
              optType: button ? '保存草稿':'提交申请单',
              oprations: button ? '保存草稿': '提交审核',
              status: button ? '待提交':'审核中',
            });
          }else{
            that.$error({
              title: res.message,
            });
          }
        }).finally(()=>{
          that.loading = false;
        });
      },
      tempSave(){
        this.submit('TEMPS')
      },
      assetsChange(total){
        this.tranAmt = total;
      },
      withdraw(){
        let that = this
        this.$confirm({
          title: '提示',
          content: '确定要撤销审批吗?',
          onOk: function () {
            that.loading = true;
            let formData = new FormData();
            formData.append("task_id", that.taskId);
            formData.append("audiResult", "CANCLE");
            formData.append("comment", "撤销");
            httpActionWF("/wkf/disPather", formData).then((res)=>{
              if(res.success){
                that.$message.success(res.result);
                that.addOrdersOptLogs({
                  batchId: that.batchId,
                  optType: '强制撤回',
                  oprations: '强制撤回',
                  status: '待提交',
                });
                that.initialPage();
              }else{
                that.$message.error(res.result);
              }
            }).finally(()=>{
              that.loading = false;
            });
          }
        });
      },
      // 交易成功
      tradeSuccess(){
        this.$refs.assetConfirm.tradeSuccess();
      },
      wkfUserComplete () {
        let that = this;
        this.$nextTick(() => {
          that.$router.push({path:"/order/orderTrack"});
        });
      },
      // 获取订单详情
      async getOrders() {
        await this.getPrjOrderInfo({batchId:this.batchId});
        let result = this.prjOrderInfo;
        if(!result.orders || !result.orders[0]){
          return
        }
        this.counterParty.prjCode=result.orders[0].prjCode;
        this.counterParty.periodNo=result.periodNo||0;
        this.SET_prjCode(result.orders[0].prjCode);
        this.SET_status(result.orders);
        this.SET_periodNo(result.periodNo||0);

        let that = this;
        this.$nextTick(() => {
          if(this.status==="80"||this.status==="5"){
            that.SET_prjCode(result.orders[0].prjCode);
            that.$refs.iAssets.initPage(result.orders[0].prjCode, this.counterParty.periodNo);
          }else {
            that.$refs.iAssetsView.initPage('stup:'+result.orders[0].prjCode+','+this.counterParty.periodNo+','+this.batchId||'0');
          }
        });
        this.detailData.createBy=result.orders[0].createBy;
        this.detailData.createDt=result.orders[0].createDt;
        this.detailData.trustPrjName=result.cli.trustPrjName;
        this.detailData.curCode=result.orders[0].tranCurCode;
        this.detailData.period = this.periodNo+'';
        this.tranAmt = result.totalAmt;
      },
      auditHisPageReady(){
        this.queryWkfInfoByBatchId();
      },
      initialPage(){
        let that = this;
        this.RESET_STATE();
        //订单点过来
        if( this.$route.query.batchId ){
          // 获取详情
          this.SET_batchId(this.$route.query.batchId);
          this.detailData.batchId = this.batchId;
          this.ordersOptLogsList();
          this.getOrders();
        } else if(this.$route.query.param){//追加委托点过来
          let param = window.atob(this.$route.query.param);
          console.log('initParam=',param);
          param.split('&').forEach(eachParam=>{
            let p = eachParam.split('=');
            if(p[0]==='prjCode'){
              that.SET_prjCode(p[1]);
              that.counterParty.prjCode=that.prjCode;
            }
            if(p[0]==='periodNo'){
              that.SET_periodNo(p[1]);
              that.counterParty.periodNo = that.periodNo;
              that.detailData.period = that.periodNo+'';
            }
          });
          that.SET_prjChangeble(false);
          this.$nextTick(() => {
            that.$refs.iAssets.initPage(that.prjCode,that.periodNo);
          });
        }else{
          this.$nextTick(() => {
            that.$refs.iAssets.initPage('',0);
          });
        }
      },
      tradeFail(){
        let that = this;
        this.$confirm({
          content: "确认取消交易?",
          onOk: async function () {
            that.loading = true;
            const res = await postAction('/prj/asset/cancel', { batchId:that.batchId });
            console.log('resss=',res);
            if (res.success) {
              //添加操作日志
              that.addOrdersOptLogs({
                batchId: that.batchId,
                optType:'信托份额确认',
                oprations: '交易取消',
                status:'已取消'
              });
              that.initialPage();
            } else {
              this.$notification[ 'error' ]({message: res.message,description:"",duration: 4 });
            }
            that.loading = false;
          }
        });
      }
    },
    created(){
      this.initialPage();
    },
    mounted(){
      console.log('mounted============');
    }
  }
</script>

<style lang="stylus" scoped>

</style>
 