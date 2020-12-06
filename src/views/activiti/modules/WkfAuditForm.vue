<template>
  <div>
    <a-spin :spinning="loading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="审核单类型">
          {{ processName }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="审核单名称">
          <a @click="handleITClick">{{ instanceTitle }}</a>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="申请时间">
          {{ applyDt }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="申请人">
          {{ applyerName }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="操作">
          <a-radio-group :options="audiResultOptions" @change="audiResultChange" v-decorator="['audiResult', validatorRules.audiResult]"></a-radio-group>
        </a-form-item>
        <a-form-item v-if="audiResult === 'REJECT'" :labelCol="labelCol" :wrapperCol="wrapperCol" label="驳回节点">
          <a-radio-group :options="nextActivityOptions" v-decorator="['nextActivity', {}]"></a-radio-group>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="审核意见">
          <a-textarea placeholder="请填写审核意见" v-decorator="['comment', validatorRules.comment]" :rows="4"></a-textarea>
        </a-form-item>
        <a-row>
          <a-col :span="24" :style="{ textAlign: 'right' }">
            <a-button type="primary" @click="doAudit">确认</a-button>
            <a-button @click="cancel" :style="{ marginLeft: '8px' }">取消</a-button>
          </a-col>
        </a-row>
      </a-form>
      <wkf-next-user-modal ref="wkfUserForm" @complete="wkfUserComplete"></wkf-next-user-modal>
    </a-spin>
  </div>
</template>

<script>
  import moment from 'moment';
  import {httpActionWF} from '@/api/manage';
  import WkfNextUserModal from './WkfNextUserModal';
  import {isEmpty} from "@/utils/util";

  export default {
    name: "WkfAuditForm",
    components: {
      WkfNextUserModal
    },
    data() {
      return {
        loading: false,
        labelCol: {
          xs: { span: 20 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 20 },
          sm: { span: 14 },
        },
        form: this.$form.createForm(this),
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
        url: {
          auditInitData: "/wkf/auditInitData",
          disPather: "/wkf/disPather",
          doValidateDisPather: "/wkf/doValidateDisPather"
        }
      }
    },
    methods: {
      audiResultChange (r) {
        this.audiResult = r.target.value;
        if(this.audiResult === "REJECT"){
          let that = this;
          this.$nextTick( () => {
            that.form.setFieldsValue({"nextActivity": that.nextActivity});
          });
        }
      },
      handleITClick () {
        if(!isEmpty(this.businessKey)){
          window.location.href = `${window._CONFIG['domianURL']}/zhitou/cusLoaInfo/exportHtDocx?prjId=` + this.businessKey;
        }
      },
      doAudit () {
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
        httpActionWF(this.url.disPather, formData).then((res)=>{
          if(res.success){
            that.$refs.wkfUserForm.edit(that.instancecId);
            that.$refs.wkfUserForm.disableSubmit = false;
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
        this.$emit("ok");
      },
      cancel () {
        this.$emit("cancel");
      }
    },
    mounted(){
      this.$emit("pageInited",(record)=>{
        this.loading = true;
        let that = this;
        that.form.resetFields();
        this.processName = record.processName;
        this.instanceTitle = record.instanceTitle;
        this.instancecId = record.procInstId;
        this.applyDt = moment(record.createTime).format('YYYY-MM-DD HH:mm:ss');
        this.applyerName = record.applyerName+"("+record.applyer+")";
        this.taskId = record.taskId;

        let formData = new FormData();
        formData.append('taskId', record.taskId);
        httpActionWF(this.url.auditInitData, formData).then((res)=>{
          if(res.success){
            console.dir(res);
            that.$emit("dataLoaded", res);
            that.actValidateYn = res.result.actValidateYn;
            that.instancecId = res.result.instancecId;
            that.nextActivityOptions = [];
            that.nextActivity = "";
            that.businessKey = res.result.businessKey;

            for(let i of res.result.nextActInfo){
              that.nextActivityOptions.push({label:i.activity_name, value:i.activity_Id});
              if(that.nextActivity === ""){
                that.nextActivity = i.activity_Id;
              }
            }
          }else{
            that.$message.warning(res.message);
          }
        }).finally(() => {
          that.loading = false;
          that.form.setFieldsValue({"audiResult":"ACCEPT"});
        });
      });
    }
  }
</script>

<style lang="less" scoped>
</style>