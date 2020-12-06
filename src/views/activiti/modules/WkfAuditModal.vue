<template>
  <j-modal :width="1200" :okText='onlyHisPage?"关闭":"确定"' :fullscreen="true" :title="title" :visible="visible" :switchFullscreen="false" :destroyOnClose="true" @ok="doAudit" @cancel="handleCancel">
    <a-card :bordered="false" :body-style="{padding: '0 !important'}" size="small">
      <div class="salesCard">
        <a-tabs :default-active-key="onlyHisPage?'2':'1'" size="large" @change="handleTabChanged">
          <a-tab-pane loading="true" tab="审核单信息" key="1" v-if="!onlyHisPage">
            <a-spin :spinning="loading">
              <a-form :form="form" formLayout="horizontal" ref="form">
                <a-row :gutter="24">
                  <a-col :span="3">
                    <a-form-item label="审核单类型">
                      {{ processName }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="4">
                    <a-form-item label="审核单名称">
                      {{ instanceTitle }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="3">
                    <a-form-item label="申请时间">
                      {{ applyDt }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="3">
                    <a-form-item label="申请人">
                      {{ applyerName }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="3">
                    <a-form-item label="操作">
                      <a-radio-group :options="audiResultOptions" @change="audiResultChange" v-decorator="['audiResult', validatorRules.audiResult]"></a-radio-group>
                    </a-form-item>
                  </a-col>
                  <a-col v-if="audiResult === 'REJECT'" :span="0">
                    <a-form-item label="驳回节点">
                      <a-radio-group :options="nextActivityOptions" v-decorator="['nextActivity', {}]"></a-radio-group>
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="审核意见">
                      <a-textarea placeholder="请填写审核意见" v-decorator="['comment', validatorRules.comment]" :rows="2"></a-textarea>
                    </a-form-item>
                  </a-col>
                </a-row>
                <hr/>
                <component :is="auditComp" ref="auditComp" @pageMounted="auditContentMounted" :businessKey="businessKey"></component>
              </a-form>
              <wkf-next-user-modal ref="wkfUserForm" @complete="wkfUserComplete"></wkf-next-user-modal>
            </a-spin>
          </a-tab-pane>
          <a-tab-pane tab="审核记录" key="2">
            <a-row>
              <wkf-audit-his ref="his" @pageInited="hisPageInited"></wkf-audit-his>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </j-modal>
<!--  <a-modal-->
<!--    :title="title"-->
<!--    :visible="visible"-->
<!--    :width="modalWidths[tabkey]"-->
<!--    :footer="null"-->
<!--    :destroyOnClose="true"-->
<!--    @cancel="handleCancel"-->
<!--    cancelText="关闭">-->
<!--    -->
<!--  </a-modal>-->
</template>

<script>
  import moment from 'moment';
  import WkfAuditHis from "./WkfAuditHis";
  import WkfNextUserModal from './WkfNextUserModal';
  import {httpActionWF} from '@/api/manage';
  import {isEmpty} from "@/utils/util";
  import RouteView from '../../../components/layouts/RouteView'
  import { mapState, mapActions, mapMutations } from "vuex";
  export default {
    name: "WkfAuditModal",
    components: {
      RouteView,
      WkfAuditHis,
      WkfNextUserModal
    },
    props: {
      onlyHisPage: Boolean,
      title: {type:String,default:"审核页面"}
    },
    data () {
      return {
        modalWidths: [600, 1000],
        tabkey: (this.onlyHisPage?1:0),
        visible: false,
        record: {},
        auditInitData: {},
        hisPageInitor: null,
        form: this.$form.createForm(this),
        url: {
          auditInitData: "/wkf/auditInitData",
          disPather: "/wkf/disPather",
          doValidateDisPather: "/wkf/doValidateDisPather"
        },
        validatorRules:{
          audiResult:{rules: [{ required: true, message: '请选择同意或者驳回!' }]},
          comment:{rules: [{ required: true, message: '请填写审核意见!' }]}
        },
        audiResult: "ACCEPT",
        taskId: "",
        processName: "",
        instancecId: "",
        instanceTitle: "",
        applyDt: "",
        applyerName: "",
        audiResultOptions: [{ label: '同意', value: 'ACCEPT' },{ label: '驳回', value: 'REJECT' }],
        nextActivityOptions: [],
        nextActivity: "",
        actValidateYn: "",
        businessKey: "",
        loading:false,
        auditComp:'',
        auditComps:[]
      }
    },
    methods: {
      ...mapActions("order",["addOrdersOptLogs"]),
      ...mapMutations("order",["SET_isFromWkf"]),
      audit (record) {
        this.visible = true;
        this.record = record;
        this.initAuditPage();
      },
      hisPageInited (){
        this.$refs.his.initPage(this.onlyHisPage?null:this.auditInitData, this.record);
      },
      dataLoaded (res){
        this.auditInitData = res;
      },
      handleCancel () {
        this.$emit('updateList')
        this.$emit('close');
        this.visible = false;
      },
      handleTabChanged (a) {
        this.tabkey = a-1;
      },
      audiResultChange (r) {
        if(r.target.value=="ACCEPT"){
          this.form.setFieldsValue({"comment":"同意"})
        }
        this.audiResult = r.target.value;
        if(this.audiResult === "REJECT"){
          this.form.setFieldsValue({"comment":""})
          let that = this;
          this.$nextTick( () => {
            that.form.setFieldsValue({"nextActivity": that.nextActivity});
          });
        }
      },
      doAudit () {
        // 发送消息
        if(this.onlyHisPage){
          this.handleCancel()
          return
        }
        if(this.audiResult === "REJECT" && isEmpty(this.nextActivity)){
          this.$message.warning("驳回节点不能为空！");
        }else{
          const that = this;
          // 触发表单验证
          this.form.validateFields((err, values) => {
            if (!err) {
              that.$confirm({
                title: '您确定要提交审核吗？',
                okText: '是',
                okType: 'danger',
                cancelText: '否',
                onOk() {
                  that.loading = true;
                  let formData = new FormData();
                  formData.append("taskId", that.taskId);
                  if(that.actValidateYn === "Y" && that.audiResult === "ACCEPT"){
                    //调用校验方法
                    httpActionWF(that.url.doValidateDisPather, formData).then((res)=>{
                      if(res.success){
                        if(!isEmpty(res.message)){
                          that.$message.success(res.message);
                        }
                        that.doAudi(values);
                      }else{
                        that.$error({
                          title: res.message,
                        });
                        that.loading = false;
                      }
                    });
                  }else{
                    //提交审核方法
                    that.doAudi(values);
                  }
                }
              });
            }
          });
        }
      },
      doAudi (values) {
        let that = this;
        let formData = new FormData();
        formData.append("audiResult", values.audiResult);
        formData.append("comment", values.comment);
        formData.append("task_id", this.taskId);
        formData.append("next_activity_Id", values.nextActivity);
        console.log('that.businessKey=======',that.businessKey);
        httpActionWF(this.url.disPather, formData).then((res)=>{
          if(res.success){
            // that.$refs.wkfUserForm.edit(that.instancecId);
            // that.$refs.wkfUserForm.disableSubmit = false;
            // 埋点
            that.$message.success("审核完成");
            let batchId=that.businessKey.split(':')[1];
            if(that.businessKey.split(':')[0]==='trust_asset_initcomm'||that.businessKey.split(':')[0]==='trust_asset_addcomm'){
              batchId = batchId.split(',')[2];
            }
            that.addOrdersOptLogs({
              batchId: batchId,
              optType: values.audiResult === "REJECT"?'审核驳回':'审核同意',
              oprations: values.audiResult === "REJECT"?'审核驳回':'审核同意',
              status: values.audiResult === "REJECT"?'审核驳回':'审核同意',
              memo: values.comment
            });
            that.handleCancel();
          }else{
            that.$error({
              title: res.message,
            });
          }
        }).finally(() => {
          that.loading = false;
        })
      },
      wkfUserComplete () {
        let that = this;
        this.$success({
          title: '操作完成！',
          onOk () {
            that.$emit('ok');
            that.visible = false;
          }
        });
      },
      loadComp(c){
        let that = this;
        if(!that.auditComps[c]){
          that.auditComps[c] = ()=>import('@/views'+c);
        }
        that.auditComp = that.auditComps[c];
      },
      initAuditPage(){
        this.loading = true;
        let that = this;
        that.form.resetFields();
        this.processName = this.record.processName;
        this.instanceTitle = this.record.instanceTitle;
        this.instancecId = this.record.procInstId;
        this.applyDt = moment(this.record.createTime).format('YYYY-MM-DD HH:mm:ss');
        this.applyerName = this.record.applyerName+"("+this.record.applyer+")";
        this.taskId = this.record.taskId;

        let formData = new FormData();
        formData.append('taskId', this.record.taskId);
        httpActionWF(this.url.auditInitData, formData).then((res)=>{
          if(res.success){
            this.auditInitData = res;
            that.actValidateYn = res.result.actValidateYn;
            that.instancecId = res.result.instancecId;
            that.nextActivityOptions = [];
            that.nextActivity = "";
            that.businessKey = res.result.businessKey;
            console.log("businessKey=",that.businessKey);
            let taskStaticVariable = res.result.taskStaticVariable;

            for(let i of res.result.nextActInfo){
              that.nextActivityOptions.push({label:i.activity_name, value:i.activity_Id});
              if(that.nextActivity === ""){
                that.nextActivity = i.activity_Id;
              }
            }
            const trantypeCodes = {
              "INV01": '/order/CreateOrder', // 认购
              "INV02": '/order/CreateSubscribe', // 追加申购
              "INV06": '/order/CreateRedeem',// 赎回
              "INV09": '/order/CreateInterestDistribution', // 收益分配
              "INV15": '/order/CreateInterestDistribution',//返本
              "INV16": '/order/CreateInterestDistribution',//返本+收益分配
              "INV10": '/order/CreateBonusReInvest',// 红利再投
              "LOA03": '/order/Payment',//费用支付
              "LOA04": '/order/DistributeManage',//分配处理
              "LOA13": '/order/PayPermium',//代缴保费
              "LOA06": '/order/Asttransfer',//受益人间份额转让
              "LOA07": '/order/Asttransferzy',//子账户间资产转让
              "INV12": '/order/CreateBankInterestSettlement',//银行结息
              "LOA01": '/prj/modules/AssetsView',//初始委托
              "LOA02": '/prj/modules/AssetsView',//追加委托
              "LOA1401": '/order/CapitalAdjustment',//资金调帐-收入
              "LOA1402": '/order/CapitalAdjustmentOut',//资金调帐-支出
              "LOA17": '/order/OriginalDistribution',//原状分配
              "LOA20": '/order/AdjustFund',//银转证
              "LOA21": '/order/AdjustFund',//证转银
              "LOA1601": '/order/CharitableaidBenf',//慈善信托-受益人直接收款
              "LOA1602": '/order/CharitableaidBenf',//慈善信托-项目执行人收款
              "products_change":'/asset/AssetDetail',//资产信息
              "LOA09": '/order/TAunitAdjust',//TA份额调减
              "LOA10": '/order/TAunitAdjust',//TA份额调增
              "cus_accinfo_change": '/prj/modules/SubAccInfoView',
              "cus_dist_regulation": '/prj/modules/DistplanModalView',
              "cus_fee_rule_bank": '/prj/modules/FeeAccountModal',
              "cus_relparty_info": '/prj/modules/RelPartyModalView',//项目关系人
              "INV13":'/order/PrivateInvestment',//股权交易
              "INV14":'/order/PrivateInvestment',//合伙公司
              "cus_fee_regulation":'/prj/modules/ProjectPeriodFeeModel'//项目期间费用
            }
            let matched = false;
            for(let key in trantypeCodes){
              if(this.businessKey.indexOf(key) > -1){
                matched = true;
                this.SET_isFromWkf(true)
                this.loadComp(`${trantypeCodes[key]}.vue`);
              }
            }
            if(!matched && taskStaticVariable && taskStaticVariable.form_action.indexOf('/')===0){
              this.loadComp(taskStaticVariable.form_action+'.vue');
            }
          }else{
            that.$message.warning(res.message);
          }
        }).finally(() => {
          that.loading = false;
          that.form.setFieldsValue({"audiResult":"ACCEPT"});
          this.form.setFieldsValue({"comment":"同意"})
        });
      },
      auditContentMounted(){
        this.$refs.auditComp.initPage(this.businessKey);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .salesCard {
    margin: -24px 0 0 0 !important;
  }
  textarea {
    resize: none !important;
  }
</style>
